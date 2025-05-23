const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { updateElectronApp } = require("update-electron-app");

// 启用自动更新, 需要在 package 中添加一下repo的信息
updateElectronApp();

// ✅ 自动重启：保存 main.js 自动重启 Electron
try {
  // require("electron-reloader")(module);
} catch (_) {}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    // show: false,
  });

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  // 为进程通信注册handler
  ipcMain.handle("ping", () => "pong");
  createWindow();

  // macOS 适配
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      // win.show();
    }
  });
});

// windows 桌面行为适配
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
