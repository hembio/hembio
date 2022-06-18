import { BrowserWindow } from "@electron/remote";
import "./index.css";

const mainWindow = BrowserWindow.getFocusedWindow();

const iframe = document.getElementById("iframe");
const minBtn = document.getElementById("min-btn");
const maxBtn = document.getElementById("max-btn");
const closeBtn = document.getElementById("close-btn");

minBtn.onclick = () => {
  mainWindow.minimize();
};

maxBtn.onclick = () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    maxBtn.innerText = "🗖︎";
  } else {
    mainWindow.maximize();
    maxBtn.innerText = "🗗︎";
  }
};

closeBtn.onclick = () => {
  const win = BrowserWindow.getFocusedWindow();
  win.close();
  mainWindow.close();
};

iframe.setAttribute("src", "https://hembio.local:3443");

iframe.onload = () => {
  iframe.style.opacity = "1.0";
};
