const { app, BrowserWindow, ipcMain, dialog } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");

require("@electron/remote/main").initialize();

const fs = require("fs");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1280,
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
let currentFolderPath = "";
let currentFilePath = "";

function getCurrentFolder(win) {
  dialog
    .showOpenDialog(win, {
      properties: ["openDirectory"],
    })
    .then((result) => {
      if (result.canceled) {
        console.log(result.canceled);
      } else {
        currentFolderPath = result.filePaths[0];
        // Calling openfile on init when no file is selected ***need to fix
        // readFile(currentFilePath, arguments[2]);
        folderContent(currentFolderPath, arguments[2]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

const dirTree = require("directory-tree");

function folderContent(path, e) {
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
  getCurrentFolder(currentWindow, folderContent, event);
});

ipcMain.on("get-file", (event, data) => {
  readFile(data, event);
  currentFilePath = data;
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
