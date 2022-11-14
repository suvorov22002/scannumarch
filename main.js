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

ipcMain.on("loadScanFile", async (event, args) => {
    
    console.log(args+' -- Erreur ! Veuillez rapporter ce bug au développeur de l\'application.');
    var scanFiles = [];

    //joining path of directory 
    const directoryPath = path.join('C:\\numarch\\', 'scans');
    var dirScans = 'C:\\numarch\\scans';
    var dirIndexes = 'C:\\numarch\\indexes';
    var dirAlfreco = 'C:\\numarch\\alfresco';
    var dirWorks = 'C:\\numarch\\works';

    // Configure all directories

    /* Repertoire des dossiers scannés en attente d'indexation */
    if (!fs.existsSync(dirScans)){
        fs.mkdirSync(dirScans, { recursive: true });
    }
    /* Repertoire des dossiers scannés en attente d'indexation */
    if (!fs.existsSync(dirIndexes)){
        fs.mkdirSync(dirIndexes, { recursive: true });
    }
    /* Repertoire des dossiers traités en attente denvoi vers alfresco */
    if (!fs.existsSync(dirAlfreco)){
        fs.mkdirSync(dirAlfreco, { recursive: true });
    }
    /* Repertoire des dossiers en cours de traitement */
    if (!fs.existsSync(dirWorks)){
        fs.mkdirSync(dirWorks, { recursive: true });
    }



     //passsing directoryPath and callback function
     fs.readdir(directoryPath, async function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 

       await files.forEach(async function (file) {
            // Do whatever you want to do with the file
            var obj;
            obj = {}
            obj.filenom = ""
            obj.enbase64 = ""
        //    console.log(file); 
            obj.filenom = file
            obj.enbase64 = await base64_encode(path.join(directoryPath, file))
            scanFiles.push(obj);
            
        });

        // Send result back to renderer process
        event.sender.send('actionReply', scanFiles);
        
    });
/*
    dialog.showOpenDialog(mainWindow, {
        //properties: ['openFile', 'openDirectory'],
        properties: ['openFile','multiSelections'],
        defaultPath: "C:\\numarch\\scans"
      }).then(result => {
        console.log(result.canceled)
        console.log(result.filePaths)
       // result = result.filePaths
        event.sender.send('actionReply', result);
      }).catch(err => {
        console.log(err)
      })

    */
     
      // Send result back to renderer process
      //mainWindow.webContents.send("fromMain", responseObj);
  
});

function processFile() {
    
    //joining path of directory 
    const directoryPath = path.join('C:\\numarch\\', 'scans');

    //passsing directoryPath and callback function
    fs.readdir(directoryPath, async function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
  
        var blob = files[0]
        const base64String = await base64_encode(path.join(directoryPath, blob))
        console.log(base64String)
        return base64String;
        //listing all files using forEach
       files.forEach(async function (file) {
            // Do whatever you want to do with the file
            console.log(file); 
  
            //const fs = require('fs').promises;
            //const contents = await fs.readFile(path.join(__dirname, 'img/'+file), {encoding: 'base64'});
           // const contents = base64_encode(path.join(__dirname, 'img/'+file));
            //console.log('base64String: ' + contents);
            
        });
    
    });
  }

  // function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    //return new Buffer(bitmap).toString('base64');
    return bitmap.toString('base64');
}

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}

  
