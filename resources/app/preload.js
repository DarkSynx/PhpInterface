// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { Titlebar, Color } = require('custom-electron-titlebar');
const path = require('path');

let titlebar;

window.addEventListener('DOMContentLoaded', () => {
  titlebar = new Titlebar({
    backgroundColor: Color.fromHex("#2F324170"),
    itemBackgroundColor: Color.fromHex("#74B1BE70"),
    svgColor: Color.WHITE,
    icon: path.join(__dirname, '', '/logo.ico'),
    //menuPosition: 'bottom',
    //menu: null // = do not automatically use Menu.applicationMenu
    menuTransparent: 50,
  })

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})