import { app, BrowserWindow } from "electron";
import { dialog } from "electron/main";
import * as path from "path";
// import * as isDev from "electron-is-dev";
// import {url} from 'url';
let win: BrowserWindow;
let deepLinkUrl: string;

if (process.defaultApp) {
  console.log("process found");
  if (process.argv.length >= 2) {
    console.log("length greater than 2");
    app.setAsDefaultProtocolClient("bettrdash", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
    console.log(app.isDefaultProtocolClient("bettrdash"));
  }
} else {
  console.log("length less than 2");
  app.setAsDefaultProtocolClient("bettrdash");
}

const createWindow = () => {
  win = new BrowserWindow({
    // titleBarStyle: "hiddenInset",
    title: "BettrDash",
    webPreferences: {
      // contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.maximize();

  if (app.isPackaged) {
    // win.loadURL(`file://${path.join(__dirname, "../index.html")}`);
    win.loadURL("file://" + path.join(__dirname, "../index.html"));
  } else {
    win.loadURL("http://localhost:3000");
    // Hot Reloading on 'node_modules/.bin/electronPath'
    // require("electron-reload")(__dirname, {
    //   electron: path.join(
    //     __dirname,
    //     "..",
    //     "..",
    //     "node_modules",
    //     ".bin",
    //     // "electron" + (process.platform === "win32" ? ".cmd" : ""),
    //   ),
    //   forceHardReset: true,
    //   hardResetMethod: "exit",
    // });
  }
};
app.on("will-finish-launching", function () {
  // Protocol handler for osx
  app.on("open-url", function (event, url) {
    event.preventDefault();
    deepLinkUrl = url;
    console.log(deepLinkUrl);
    // logEverywhere('open-url# ' + deeplinkingUrl)
  });
});

// const gotTheLock = app.requestSingleInstanceLock();

// if (gotTheLock) {
//   app.on("second-instance", (_event, argv, _workingDir) => {
//     // if (process.platform === 'win32') {
//     //   deepLinkUrl = argv.slice(1)
//     // }
//     console.log(argv.slice(1));
//     // if (win) {
//     //   if (win.isMinimized()) {
//     //     win.restore();
//     //   }
//     //   win.focus();
//     // }
//   });
// }

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("open-url", (_event, url) => {
  console.log("hi");
  dialog.showErrorBox("welcome back", `you arrived from ${url}`);
});

app.on("ready", createWindow);

// const { app, BrowserWindow } = require('electron')
// // Module with utilities for working with file and directory paths.
// const path = require('path')
// // Module with utilities for URL resolution and parsing.
// const url = require('url')

// // Keep a global reference of the window object, if you don't, the window will
// // be closed automatically when the JavaScript object is garbage collected.
// let mainWindow: typeof BrowserWindow

// // Deep linked url
// let deeplinkingUrl: any

// // Force Single Instance Application
// const gotTheLock = app.requestSingleInstanceLock()
// if (gotTheLock) {
//   app.on('second-instance', (_e:any , argv: any) => {
//     // Someone tried to run a second instance, we should focus our window.

//     // Protocol handler for win32
//     // argv: An array of the second instance’s (command line / deep linked) arguments
//     if (process.platform == 'win32') {
//       // Keep only command line / deep linked arguments
//       deeplinkingUrl = argv.slice(1)
//     }
//     logEverywhere('app.makeSingleInstance# ' + deeplinkingUrl)

//     if (mainWindow) {
//       if (mainWindow.isMinimized()) mainWindow.restore()
//       mainWindow.focus()
//     }
//   })
// } else {
//   app.quit()
//   // return
// }

// function createWindow() {
//   // Create the browser window.
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       nodeIntegration: true
//     }
//   })

//   if (app.isPackaged) {
//     // win.loadURL(`file://${path.join(__dirname, "../index.html")}`);
//     mainWindow.loadURL("file://" + path.join(__dirname, "../index.html"));
//   } else {
//     // win.loadURL(url.format({
//     //   pathname: path.join(__dirname, "../index.html"),
//     //   protocol: 'file:',
//     //   slashes: true
//     // }))
//     mainWindow.loadURL("http://localhost:3000");
//     // Hot Reloading on 'node_modules/.bin/electronPath'
//     // require("electron-reload")(__dirname, {
//     //   electron: path.join(
//     //     __dirname,
//     //     "..",
//     //     "..",
//     //     "node_modules",
//     //     ".bin",
//     //     // "electron" + (process.platform === "win32" ? ".cmd" : ""),
//     //   ),
//     //   forceHardReset: true,
//     //   hardResetMethod: "exit",
//     // });
//   }

//   // Open the DevTools.
//   mainWindow.webContents.openDevTools()

//   // Protocol handler for win32
//   if (process.platform == 'win32') {
//     // Keep only command line / deep linked arguments
//     deeplinkingUrl = process.argv.slice(1)
//   }
//   logEverywhere('createWindow# ' + deeplinkingUrl)

//   // Emitted when the window is closed.
//   mainWindow.on('closed', function() {
//     // Dereference the window object, usually you would store windows
//     // in an array if your app supports multi windows, this is the time
//     // when you should delete the corresponding element.
//     mainWindow = null
//   })
// }

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)

// // Quit when all windows are closed.
// app.on('window-all-closed', function() {
//   // On OS X it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

// app.on('activate', function() {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) {
//     createWindow()
//   }
// })

// if (!app.isDefaultProtocolClient('myapp')) {
//   // Define custom protocol handler. Deep linking works on packaged versions of the application!
//   app.setAsDefaultProtocolClient('myapp')
// }

// app.on('will-finish-launching', function() {
//   // Protocol handler for osx
//   app.on('open-url', function(event: any, url: string) {
//     event.preventDefault()
//     deeplinkingUrl = url
//     logEverywhere('open-url# ' + deeplinkingUrl)
//   })
// })

// // Log both at dev console and at running node console instance
// function logEverywhere(s: string) {
//   console.log(s)
//   if (mainWindow && mainWindow.webContents) {
//     mainWindow.webContents.executeJavaScript(`console.log("${s}")`)
//   }
// }
