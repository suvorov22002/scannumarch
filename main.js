const {app, Menu, remote, BrowserWindow} = require('electron');
//const app = electron.app;
//const remote = electron.remote
//const BrowserWindow = electron.BrowserWindow
const url = require('url');
const path = require('path');

const jsdom = require('jsdom');
const dom = new jsdom.JSDOM("");
const $ = require("jquery")(dom.window);

let mainWindow;

function createWindow () {

    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        icon:__dirname+'/assets/img/logo.png',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.maximize

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

