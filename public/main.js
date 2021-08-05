const { app, BrowserWindow, ipcMain, dialog } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");

require("@electron/remote/main").initialize();

const fs = require("fs");
const { resolve } = require("path");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
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
let currentFilePath = "";

function getCurrentFile(win) {
  dialog
    .showOpenDialog(win, {
      properties: ["openFile"],
      filters: [
        {
          name: "Markdown",
          extensions: ["md", "markdown", "txt"],
        },
      ],
    })
    .then((result) => {
      if (result.canceled) {
        console.log(result.canceled);
      } else {
        currentFilePath = result.filePaths[0];
        openFile(currentFilePath, arguments[2]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function openFile(path, e) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    // Send text from file back to editor
    e.reply("reply", data);
  });
}

ipcMain.on("file", (event, data) => {
  getCurrentFile(currentWindow, openFile, event);
});

ipcMain.on("save", (event, data) => {
  console.log("saved - " + currentFilePath);
  // fs.writeFile(, data, function (err) {
  //   if (err) return console.log(err);
  //   console.log("hit");
  // });
});
