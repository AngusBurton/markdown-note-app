const { app, BrowserWindow, ipcMain, dialog } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");

require("@electron/remote/main").initialize();

const fs = require("fs");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1480,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInSubFrames: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
}

app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// =========================================================== //

const currentWindow = BrowserWindow.getAllWindows()[0];
let mainFolder = "";
let currentFilePath = "";
let currentSelected = "";

function getCurrentFolder(win) {
  dialog
    .showOpenDialog(win, {
      properties: ["openDirectory"],
    })
    .then((result) => {
      if (result.canceled) {
        console.log(result.canceled);
      } else {
        mainFolder = result.filePaths[0];
        // Calling openfile on init when no file is selected ***need to fix
        // readFile(currentFilePath, arguments[2]);
        buildTree(mainFolder, arguments[2]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

const dirTree = require("directory-tree");

function buildTree(path, e) {
  const filteredTree = dirTree(path, {
    extensions: /\.(md|txt)$/,
  });
  e.reply("tree", filteredTree);
}

function readFile(path, e) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    // Send text from file back to editor
    e.reply("reply", data);
  });
}

ipcMain.on("get-folder", (event, data) => {
  // getCurrentFile(currentWindow, readFile, event);
  getCurrentFolder(currentWindow, buildTree, event);
});

ipcMain.on("get-file", (event, data) => {
  readFile(data, event);
  currentFilePath = data;
});

ipcMain.on("active-item", (event, data) => {
  currentSelected = data;
  event.reply("active", currentSelected);
});

ipcMain.on("new-file", (event, data) => {
  if (mainFolder === "") {
    console.log("[ERROR] No main folder has been selected!");
    return;
  } else {
    // Checks if the current selected item is folder, if so will make a new file inside of it.
    currentFilePath = mainFolder + "\\" + data;
    if (currentSelected === "") {
      createFile(event);
    } else {
      fs.lstat(currentSelected, (err, stats) => {
        if (err) {
          console.log(err);
        } else {
          if (stats.isDirectory()) {
            // folder
            currentFilePath = currentSelected + "\\" + data;
            createFile(event);
          } else {
            // file
            createFile(event);
          }
        }
      });
    }
  }
});

function createFile(event) {
  fs.writeFile(currentFilePath, "", function (err) {
    if (err) {
      return console.log(err);
    }
    buildTree(mainFolder, event);
    console.log("File: " + currentFilePath + " was created!");
  });
}

function createFolder(path, event) {
  fs.mkdir(path, { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }
    buildTree(mainFolder, event);
    console.log("Folder: " + path + " was created!");
  });
}

ipcMain.on("new-folder", (event, data) => {
  if (mainFolder === "") {
    console.log("[ERROR] No folder has been selected!");
    return;
  } else {
    if (currentSelected === "") {
      createFolder(mainFolder + "\\" + data, event);
    } else {
      fs.lstat(currentSelected, (err, stats) => {
        if (err) {
          console.log(err);
        } else {
          if (stats.isDirectory()) {
            // folder
            createFolder(currentSelected + "\\" + data, event);
          } else {
            // file
            var folderParentOfFile = require("path").dirname(currentSelected);
            folderParentOfFile = folderParentOfFile + "\\" + data;
            createFolder(folderParentOfFile, event);
          }
        }
      });
    }
  }
});

ipcMain.on("save", (event, data) => {
  // Auto saves current file based on 2.5 sec timer based on when user types.
  if (currentFilePath === "") {
    return;
  } else {
    fs.writeFile(currentFilePath, data, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  }
});

ipcMain.on("delete", (event, data) => {
  // define options
  const options = {
    type: "question",
    buttons: ["Cancel", "Yes"],
    defaultId: 2,
    title: "Question",
    message: "Are you sure you want to delete this file?",
  };
  dialog.showMessageBox(currentWindow, options).then((res) => {
    console.log(res.response);
    if (res.response === 1) {
      // yes delete
      fs.lstat(data, (err, stats) => {
        if (err) {
          console.log(err);
        } else {
          if (stats.isDirectory()) {
            //delete folder
            fs.rmdir(data, { recursive: true }, (err) => {
              if (err) {
                throw err;
              }
              buildTree(mainFolder, event);
              console.log(`${data} is deleted!`);
            });
          } else {
            // delete file
            fs.unlink(data, (err) => {
              if (err) {
                console.error(err);
                return;
              }
              buildTree(mainFolder, event);
            });
          }
        }
      });
    } else {
      // no don't delete
      return;
    }
  });
});

// mkdir
