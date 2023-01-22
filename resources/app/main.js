const { app, Menu } = require('electron')
const { PARAMS, VALUE,  MicaBrowserWindow, IS_WINDOWS_11 } = require('mica-electron');
const { exec, spawn } = require('node:child_process');
const path = require('path')


const { setupTitlebar, attachTitlebarToWindow } = require('custom-electron-titlebar/main');
// setup the titlebar main process
setupTitlebar();

const isMac = process.platform === 'darwin'



const template = [
	{
    label: 'menu',
    submenu: [
      { 
		label: 'Refresh',
		 accelerator: 'F5',
		 click: (menuItem, browserWindow, event) => {
		 win.reload();
		 }
	  },
      { label: 'openDevTools',
		 accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
		 click: (menuItem, browserWindow, event) => {
		 win.webContents.openDevTools()
		 }
	  },
      { type: 'separator' },
      { role: 'quit',
		accelerator: 'Alt+F4'
	  }
    ]
  }
]
	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)





let win;
let bat;
bat = spawn( '.\\resources\\php\\phpserv.exe', ['-S localhost:3232 -t .\\resources\\www'],{ shell: true });



// SSL/TSL: this is the self signed certificate support
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
        // On certificate error we disable default behaviour (stop loading the page)
        // and we then say "it is all fine - true" to the callback
        event.preventDefault();
        callback(true);
});

// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quand cet événement est émit.
app.on('ready', () => {
	
  // Créer le browser window.
  win = new MicaBrowserWindow({
    width: 1280,
    height: 720,
    center: true,
    title: 'Loading Interface...',
	resizable: true,
	frame: false,
	//backgroundColor: '#333333',
	titleBarStyle: 'hidden',
	 autoHideMenuBar: false,
	//titleBarOverlay: true,
	titleBarOverlay: {    color: '#2f3241',    symbolColor: '#74b1be'  },
	show: false,
	transparent: false,
	webPreferences: {
		 sandbox: false,
		preload: path.join(__dirname, 'preload.js'),
		webviewTag: true,
        nodeIntegration: true
    },

  })

	

	//win.setTransparent();
	//win.setBlur();        // Blurred window
	//win.setAcrylic();     // Acrylic window
	//win.setRoundedCorner();	
	
	win.setDarkTheme();
    win.setMicaEffect();


	  // win.webContents.openDevTools()
	 
	  // attach fullscreen(f11 and not 'maximized') && focus listeners
	  attachTitlebarToWindow(win);
  

	//win.setBackgroundColor('#333333') // turns opaque brown

	win.once('ready-to-show', () => {
		win.show();
	})
		
	win.loadFile('index.html');
	
  // Émit lorsque la fenêtre est fermée.
  win.on('closed', () => {
	exec('taskkill /F /IM phpserv.exe');
   	win = null;
  })
  

})

// Émit lorsque la fenêtre est fermée.
app.on('closed', () => {
	exec('taskkill /F /IM phpserv.exe');
	// Does not terminate the Node.js process in the shell.
})

// Quitte l'application quand toutes les fenêtres sont fermées.
app.on('window-all-closed', () => {
  // Sur macOS, il est commun pour une application et leur barre de menu
  // de rester active tant que l'utilisateur ne quitte pas explicitement avec Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // Sur macOS, il est commun de re-créer une fenêtre de l'application quand
  // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres d'ouvertes.
  if (win === null) {
    createWindow()
  }
})


