const { app, BrowserWindow, ipcMain, dialog } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");

require("@electron/remote/main").initialize();

const fs = require("fs");

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

  ipcMain.on("file", (event, data) => {
    console.log(openFile(win));
    // console.log(data);
    const content = "sugma nuts";
    event.reply("reply", content);
  });

  function openFile(win) {
    const files = dialog.showOpenDialogSync(win, {
      properties: ["openFile"],
      filters: [
        {
          name: "Markdown",
          extensions: ["md", "markdown", "txt"],
        },
      ],
    });
    if (!files) {
      return;
    } else {
      const fileContent = fs.readFileSync(files[0]).toString;
      return fileContent;
    }
  }
}

//====================================================

// ipcMain.on("READ_FILE", (event, payload) => {
//   if (fs.existsSync("./dummy.txt")) {
//     const content = fs.readFileSync("./dummy.txt", {
//       encoding: "utf8",
//       flag: "r",
//     });
//     event.reply("READ_FILE", content);
//   } else {
//     event.reply("READ_FILE", "");
//   }
// });

//====================================================

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
