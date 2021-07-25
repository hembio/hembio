import { remote } from "electron";
import "./index.css";

const currentWindow = remote.getCurrentWindow();
const iframe = document.getElementById("iframe");
const minBtn = document.getElementById("min-btn");
const maxBtn = document.getElementById("max-btn");
const closeBtn = document.getElementById("close-btn");

minBtn.onclick = () => {
  currentWindow.minimize();
};

maxBtn.onclick = () => {
  if (currentWindow.isMaximized()) {
    currentWindow.unmaximize();
    maxBtn.innerText = "🗖︎";
  } else {
    currentWindow.maximize();
    maxBtn.innerText = "🗗︎";
  }
};

closeBtn.onclick = () => {
  const win = remote.BrowserWindow.getFocusedWindow();
  console.log("close btn clicked", win, currentWindow);
  win.close();
  currentWindow.close();
};

iframe.setAttribute("src", "https://hembio.local:3443");

iframe.onload = () => {
  iframe.style.opacity = "1.0";
};
