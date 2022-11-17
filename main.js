const {app, Menu, remote, BrowserWindow, ipcMain, ipc} = require('electron');
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
//const $ = require("jquery")(dom.window);

var Jimp = require("jimp");
var QrCode = require('qrcode-reader');
const { resolve } = require('path');
const { rejects } = require('assert');



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
    
    console.log(args+' -- Recherche des fichiers à indexer.');
    var scanFiles = [];
    var groupedScannedFiles = []
    var countFiles = 0;
    var numberFiles;
    //joining path of directory 
    const directoryPath = path.join('C:\\numarch\\', 'scans');
    const indexedPath = path.join('C:\\numarch\\', 'indexes');
    const worksPath = path.join('C:\\numarch\\', 'works');

    // Scans works folders
    var indexedDir = fs.readdirSync(indexedPath);
    for (var ind = 0; indexedDir.length; ind++) {
        console.log(indexedDir[ind]);
    }
/*
    fs.readdir(indexedPath, async function (err, files) {
        
        if (err) {
            console.log('Unable to scan directory: ' + err);
        } 

        
        await files.forEach(async function (dir) {
            //console.log(dir);
            var countFiles = 0;

            fs.readdir(path.join(indexedPath, dir), async function (err, dirfiles) {
                var nbre = 0;
                countFiles = dirfiles.length;
                numberFiles = numberFiles + dirfiles.length

                dirfiles.forEach(async indexfile => {
                    console.log(indexfile);
                    var obj;
                    obj = {}
                    obj.filenom = ""
                    obj.enbase64 = ""
                    obj.state = false
                    obj.data = ""
                    obj.filenom = indexfile
                    obj.enbase64 = await base64_encode(path.join(indexedPath, dir, indexfile));
                    
                    nbre++;
                    if (countFiles == nbre) {
                        obj.state = true;
                        scanFiles.push(obj);
                        groupedScannedFiles.push(scanFiles)
                    }
                    else{
                        scanFiles.push(obj);
                    }
                });
            }); 
        })

    });
*/
    fs.readdir(worksPath, async function (err, files) {
    
    });

     //passsing directoryPath and callback function
     fs.readdir(directoryPath, async function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 

       numberFiles = numberFiles + files.length
       if (numberFiles == 0) {
          dialog.showErrorBox('AFB-SCANNUMARCH', 'Aucun document à numeriser.');
       }

       await files.forEach(async function (file) {
            // Do whatever you want to do with the file
            var obj;
            obj = {}
            obj.filenom = ""
            obj.enbase64 = ""
            obj.state = false
            obj.data = ""
        //    console.log(file); 
            obj.filenom = file
            obj.enbase64 = await base64_encode(path.join(directoryPath, file))
        //   obj.enbase64 = ""
           
            await readQRCode(path.join(directoryPath, file))
                  .then((message) => {
                    
                    countFiles++;
                    if (message.indexOf('AFB QRCODE NOT FOUND') !== -1) {
                        console.log("qrcode = "+message);
                        obj.state = false
                        obj.data = ""
                        scanFiles.push(obj);
                    }
                    else{
                        console.log("qrcode = "+message);
                        obj.state = true
                        obj.data = extractInformation(message)
                        scanFiles.push(obj);
                        groupedScannedFiles.push(scanFiles)
                        scanFiles = [];
                    }
                
                    if(countFiles === numberFiles) {
                        console.log("countFiles = "+countFiles)
                        if (scanFiles.length !==0 ){
                            groupedScannedFiles.push(scanFiles)
                        }
                        event.sender.send('actionReply', groupedScannedFiles);
                       
                    }
                  }).catch((err) => {
                    console.log("error: " + err);
                    obj.state = false
                    obj.data = ""
                    scanFiles.push(obj);
                  });
            
        });
        // Send result back to renderer process
        
        
    });

    console.log(groupedScannedFiles.length)
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

ipcMain.on("validData", async (event, args) => {
    console.log('args: '+args)
    if(!args){
        dialog.showErrorBox('AFB-SCANNUMARCH', 'Veuillez renseigner les propriétés correctes.');
        /*dialog.showMessageBox({
            type: 'warning',
            title: 'Attention !',
            message: 'Veuillez renseigner les propriétés correctes.',
            buttons: ['D\'accord', 'Euh ... je vais faire demi-tour alors.']
        });
        */
    }
   
    event.sender.send('validDataReply', 'groupedScannedFiles');
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



const readQRCode = async (filePath) => {
    try{
      if (fs.existsSync(filePath)) {
        const img = await Jimp.read(fs.readFileSync(filePath));
        const qr = new QrCode();
        const value = await new Promise((resolve, reject) => {
          qr.callback = (err, v) => err != null ? reject(err) : resolve(v);
          qr.decode(img.bitmap);
        });
        return value.result;
      }
    }
    catch(error){
      return error + '- AFB QRCODE NOT FOUND';
    }
}

const readQRCode2 = async (filename) => {
    const filePath = path.join(__dirname, filename);
    try{
      if (fs.existsSync(filePath)) {
        const img = await Jimp.read(fs.readFileSync(filePath));
        const qr = new QrCode();
        const value = await new Promise((resolve, reject) => {
          qr.callback = (err, v) => err != null ? reject(err) : resolve(v);
          qr.decode(img.bitmap);
        });
        return value.result;
      }
    }
    catch(error){
      return error + '- ';
    }
  }
 /* readQRCode2('./assets/img/numarch.jpg').then((message) => {
    console.log("qrcode = "+message);
    }).catch(console.log);
  readQRCode2('./assets/img/image-002.jpg').then(console.log).catch(console.log);
*/
 function extractInformation(message) {
    var trx = {};
    trx.setEve = message.substring(0, 6);
    trx.setAge = message.substring(6, 11);
    trx.setNcp = message.substring(11, 22);
    trx.setCle = message.substring(22, 24);
    trx.setDco = message.substring(24, 32);
    trx.setUti = message.substring(32, 36);
    trx.setMon = parseInt(message.substring(36, 50));
    trx.setType = message.substring(50);

    console.log(JSON.stringify(trx))
    return trx;
 }