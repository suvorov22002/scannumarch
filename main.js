const {app, Menu, remote, BrowserWindow, ipcMain} = require('electron');
const fs = require('fs');
//const app = electron.app;
//const remote = electron.remote
//const BrowserWindow = electron.BrowserWindow
const url = require('url');
const path = require('path');

//const ipc = require('electron').ipcMain;
const { dialog } = require('electron');

const jsdom = require('jsdom');
const dom = new jsdom.JSDOM("");
const $ = require("jquery")(dom.window);

let mainWindow;

function createWindow () {

    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        minWidth: 800, minHeight: 600,
        icon:__dirname+'/assets/img/logo.png',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    
    
    mainWindow.maximize();

    const template = [
        {
            label: 'Fichier',
            submenu: [
                {
                    label: 'Enregistrer'
                },
                {
                    label: 'Ouvrir'
                },
                {
                    label: 'Quitter'
                }
            ]
        },
        {
            label: 'Edition',
            submenu: [
                {
                    label: 'Annuler'
                },
                {
                    label: 'Refaire'
                },
                {
                    label: 'Copier'
                },
                {
                    label: 'Coller'
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
 //   Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on("loadScanFile", (event, args) => {

    dialog.showOpenDialog(mainWindow, {
        properties: ['openFile', 'openDirectory'],
       // defaultPath: "D:\\projetsAfb\\scanToAveroes"
      }).then(result => {
        console.log(result.canceled)
        console.log(result.filePaths)
        result = result.filePaths
        event.sender.send('actionReply', result);
      }).catch(err => {
        console.log(err)
      })
   /* 
      fs.readFile("path/to/file", (error, data) => {
      // Do something with file contents
  
      // Send result back to renderer process
      //mainWindow.webContents.send("fromMain", responseObj);
      mainWindow.webContents.send("fromMain", "responseObj");
    });
    */
});
