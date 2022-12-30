const {app, Menu, remote, BrowserWindow, ipcMain} = require('electron');
const fs = require('fs');
const log = require('electron-log');
const settings = require('electron-settings')
//const app = electron.app;
//const remote = electron.remote
//const BrowserWindow = electron.BrowserWindow
const url = require('url');
const path = require('path');
const net = require('electron').net;

const { dialog } = require('electron');

const jsdom = require('jsdom');
const dom = new jsdom.JSDOM("");

//const {getMimeType} = require('stream-mime-type')
//const { PDFDocument, PageSizes } = require('pdf-lib')

var Jimp = require("jimp");
var QrCode = require('qrcode-reader');
//const { resolve } = require('path');
//npm const { rejects } = require('assert');
const moment = require('moment');

const simpleFormat = 'YYMMDDHHmmssSSSS'; 
let mainWindow;

const ProgressBar = require('electron-progressbar');

function createWindow () {
    var link = 'C:\\numarch'
    log.info("Creating window for", link)
    let key = `windowState-${link}`
//    try{
        let windowState = settings.getSync(key) || {width: 1024, height: 768}
//    }
//    catch(err){
//        log.error(err)
//    }
   

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
log.warn('Some problem appears');
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
    
    try{
        createWindow()
    }
    catch(err){
        log.error(err)
        app.quit()
    }
   

    app.on('activate', function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})




ipcMain.on("loadScanFile", async (event, args) => {
    
    //console.log(args+' -- Recherche des fichiers à indexer.');
    var scanFiles = [];
    var groupedScannedFiles = []
    var countFiles = 0;
    var numberFiles;
    //joining path of directory 
    const directoryPath = path.join('C:\\numarch\\', 'scans');
    const indexedPath = path.join('C:\\numarch\\', 'indexes');
    const worksPath = path.join('C:\\numarch\\', 'works');

    // Scans folders
    var indexedDir;
    ////console.log(JSON.stringify(indexedDir));
    var inFileName;
    var inFileNames;
    var str64;
    var obj;
    var nbre;
    var countFiles;
    var loadData;
    var content;
    
/*
    indexedDir = fs.readdirSync(indexedPath);

    for (var ind = 0; ind < indexedDir.length; ind++) {
        ////console.log('Index Folder: ' ,indexedDir[ind]);
        inFileName = indexedDir[ind];
        inFileNames = fs.readdirSync(path.join(indexedPath, inFileName));
        countFiles = inFileNames.length - 1;
        nbre = 0;
        scanFiles = [];
        loadData = ""

        
        try{
            content = fs.readFileSync(path.join(indexedPath, inFileName, 'data.json'), {encoding:'utf8', flag:'r'});
            loadData = JSON.parse(content); //now it an object
        } catch (err) {
             console.error();
        }
      
       // //console.log(JSON.stringify(inFileNames));
        for (f in inFileNames) {
            
            if (inFileNames[f] === 'data.json') continue;
               
            obj = {}
            obj.filenom = ""
            obj.enbase64 = ""
            obj.state = false
            obj.data = "" //TODO: extract data from xml file
            obj.filenom = inFileNames[f];
            obj.enbase64 = await base64_encode(path.join(indexedPath, inFileName, inFileNames[f]));
            nbre++;
            if (countFiles == nbre) {
                obj.state = true;
                obj.data = loadData;
                scanFiles.push(obj);
                groupedScannedFiles.push(scanFiles)
            }
            else{
                scanFiles.push(obj);
            }

        }
    }
    //console.log('scanned: ',groupedScannedFiles.length);
 */   
    // Scans works directory

    // Extract jpg files from scanned document
    await getImageFromPdf(event);

/*
    scanFiles = [];
    indexedDir = fs.readdirSync(worksPath);

    for (var ind = 0; ind < indexedDir.length; ind++) {
        //console.log('Index Folder: ' ,indexedDir[ind]);
        inFileName = indexedDir[ind];
        inFileNames = fs.readdirSync(path.join(worksPath, inFileName));
        countFiles = inFileNames.length - 1;
        nbre = 0;
        scanFiles = [];
        loadData = ""
       /// if (fs.existsSync(dir)) { 
        try{
            content = fs.readFileSync(path.join(worksPath, inFileName, 'data.json'), {encoding:'utf8', flag:'r'});
            //console.log(content);
            loadData = JSON.parse(content); //now it an object
        } catch (err) {
             countFiles++;
             console.error();
        }
       

       // //console.log(JSON.stringify(inFileNames));
        for (f in inFileNames) {

            if (inFileNames[f] === 'data.json') continue;

            obj = {}
            obj.filenom = ""
            obj.enbase64 = ""
            obj.state = false
            obj.data = "" //TODO: extract data from xml file
            obj.filenom = inFileNames[f];
            obj.enbase64 = await base64_encode(path.join(worksPath, inFileName, inFileNames[f]));
            
            nbre++;
            if (countFiles == nbre) {
                obj.data = loadData;
                scanFiles.push(obj);
                groupedScannedFiles.push(scanFiles)
            }
            else{
                scanFiles.push(obj);
            }
        }
    }
    //console.log('scanned: ',groupedScannedFiles.length);

    scanFiles = [];
    var indexedDirs = fs.readdirSync(directoryPath);
    var chemin;
    indexedDirs = indexedDirs.filter(f => fs.statSync(path.join(directoryPath,f)).isDirectory())
    countFolders = indexedDirs.length;
    nbreFolder = 0;
    
    if (countFolders === 0) {
        var message = groupedScannedFiles.length;
        var piece = (groupedScannedFiles.length < 2) ? 'Pièce trouvé' : 'Pièces trouvées';
        message = message.toString();
        message = message + " " + piece
        event.sender.send('actionReply', groupedScannedFiles.reverse());

        dialog.showMessageBoxSync(mainWindow, {
            type: 'info',
            title: 'AFB-SCANNUMARCH',
            message: message,
            buttons: ['OK']
        });
    }

    for (var d in indexedDirs) {
        nbreFolder++;
        chemin = fs.statSync(path.join(directoryPath,indexedDirs[d]));
        if (chemin.isDirectory()) {
            //console.log('Scan folder: ' + indexedDirs[d])
            indexedDir = fs.readdirSync(path.join(directoryPath,indexedDirs[d]));
            countFiles = indexedDir.length;
            nbre = 0;
            var timestamp;

            for (var ind in indexedDir) {
                //console.log('Index Folder: ' ,indexedDir[ind]);
                inFileName = indexedDir[ind];
    
                timestamp = new Date();
                var instantTime = moment(timestamp).format(simpleFormat); 
                //console.log('instantTime ',instantTime);
                 
                obj = {}
                obj.foldernom = indexedDirs[d]
                obj.filenom = ""
                obj.enbase64 = ""
                obj.state = false
                obj.data = "" //TODO: extract data from xml file
                obj.filenom = 'tmp_' + instantTime + '_' + inFileName;
                obj.enbase64 = await base64_encode(path.join(directoryPath, indexedDirs[d], inFileName));
                
                
                await readQRCode(path.join(directoryPath, indexedDirs[d], inFileName))
                        .then((message) => {
                        
                    nbre++;
                    if (message.indexOf('AFB QRCODE NOT FOUND') !== -1) {
                        //console.log("qrcode = "+message);
                        obj.state = false
                        obj.data = ""
                        scanFiles.push(obj);
                    }
                    else{
                        //console.log("qrcode = "+message);
                        obj.state = true
                        obj.data = extractInformation(message)
                        scanFiles.push(obj);
                        groupedScannedFiles.push(scanFiles)
                        scanFiles = [];
                    }
                    //console.log("countFiles = "+countFiles+", nbre = "+nbre)
                    if(countFiles === nbre) {
                        if (scanFiles.length !==0 ){
                            groupedScannedFiles.push(scanFiles)
                        }
                        //  dialog.showMessageBox('AFB-SCANNUMARCH', groupedScannedFiles.length + groupedScannedFiles.length < 2 ? 'Pièce trouvé' : 'Pièces trouvées');
                        //console.log('message scanned: ',groupedScannedFiles.length);
                    
                    }
                }).catch((err) => {
                    //console.log("error: " + err);
                    obj.state = false
                    obj.data = ""
                    scanFiles.push(obj);
                });
            }
            //console.log("countFolders = "+countFolders+", nbreFolder = "+nbreFolder)
            if(countFolders === nbreFolder) {
                //console.log('message scanned: ',groupedScannedFiles.length);
                var message = groupedScannedFiles.length;
                var piece = (groupedScannedFiles.length < 2) ? 'Pièce trouvé' : 'Pièces trouvées';
                message = message.toString();
                message = message + " " + piece

                event.sender.send('actionReply', groupedScannedFiles.reverse());

                dialog.showMessageBoxSync(mainWindow, {
                    type: 'info',
                    title: 'AFB-SCANNUMARCH',
                    message: message,
                    buttons: ['OK']
                });
            }
            
        }
    }
*/

   /* 
    countFiles = indexedDir.length;
    nbre = 0;
    var timestamp;

    if (countFiles == 0) {
        var message;
        if (groupedScannedFiles.length === 0) {
            var message = "Aucune pièce trouvé."
            dialog.showMessageBoxSync(mainWindow, {
                type: 'info',
                title: 'AFB-SCANNUMARCH',
                message: message,
                buttons: ['OK']
            });
        }
        else{
            message = groupedScannedFiles.length;
            var piece = (groupedScannedFiles.length < 2) ? 'Pièce trouvé' : 'Pièces trouvées';
            message = message.toString();
            message = message + " " + piece
            dialog.showMessageBoxSync(mainWindow, {
                type: 'info',
                title: 'AFB-SCANNUMARCH',
                message: message,
                buttons: ['OK']
            });
        }
       
        
        event.sender.send('actionReply', groupedScannedFiles.reverse());
    }
    else{
        for (var ind in indexedDir) {
            //console.log('Index Folder: ' ,indexedDir[ind]);
            inFileName = indexedDir[ind];

            timestamp = new Date();
            var instantTime = moment(timestamp).format(simpleFormat); 
            //console.log('instantTime ',instantTime);
             
            obj = {}
            obj.filenom = ""
            obj.enbase64 = ""
            obj.state = false
            obj.data = "" //TODO: extract data from xml file
            obj.filenom = 'tmp_' + instantTime + '_' + inFileName;
            obj.enbase64 = await base64_encode(path.join(directoryPath, inFileName));
            
            
            await readQRCode(path.join(directoryPath, inFileName))
                    .then((message) => {
                    
                    nbre++;
                    if (message.indexOf('AFB QRCODE NOT FOUND') !== -1) {
                        //console.log("qrcode = "+message);
                        obj.state = false
                        obj.data = ""
                        scanFiles.push(obj);
                    }
                    else{
                        //console.log("qrcode = "+message);
                        obj.state = true
                        obj.data = extractInformation(message)
                        scanFiles.push(obj);
                        groupedScannedFiles.push(scanFiles)
                        scanFiles = [];
                    }
                    //console.log("countFiles = "+countFiles+", nbre = "+nbre)
                    if(countFiles === nbre) {
                        if (scanFiles.length !==0 ){
                            groupedScannedFiles.push(scanFiles)
                        }
                      //  dialog.showMessageBox('AFB-SCANNUMARCH', groupedScannedFiles.length + groupedScannedFiles.length < 2 ? 'Pièce trouvé' : 'Pièces trouvées');
                        //console.log('message scanned: ',groupedScannedFiles.length);
                        var message = groupedScannedFiles.length;
                        var piece = (groupedScannedFiles.length < 2) ? 'Pièce trouvé' : 'Pièces trouvées';
                        message = message.toString();
                        message = message + " " + piece
                        event.sender.send('actionReply', groupedScannedFiles.reverse());
                        dialog.showMessageBoxSync(mainWindow, {
                            type: 'info',
                            title: 'AFB-SCANNUMARCH',
                            message: message,
                            buttons: ['OK']
                        });
                    }
                    }).catch((err) => {
                    //console.log("error: " + err);
                    obj.state = false
                    obj.data = ""
                    scanFiles.push(obj);
                    });
        }
    }

  */  
    
    
/*
     //passsing directoryPath and callback function
     fs.readdir(directoryPath, async function (err, files) {
        //handling error
        if (err) {
            return //console.log('Unable to scan directory: ' + err);
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
        //    //console.log(file); 
            obj.filenom = file
            obj.enbase64 = await base64_encode(path.join(directoryPath, file))
        //   obj.enbase64 = ""
           
            await readQRCode(path.join(directoryPath, file))
                  .then((message) => {
                    
                    countFiles++;
                    if (message.indexOf('AFB QRCODE NOT FOUND') !== -1) {
                        //console.log("qrcode = "+message);
                        obj.state = false
                        obj.data = ""
                        scanFiles.push(obj);
                    }
                    else{
                        //console.log("qrcode = "+message);
                        obj.state = true
                        obj.data = extractInformation(message)
                        scanFiles.push(obj);
                        groupedScannedFiles.push(scanFiles)
                        scanFiles = [];
                    }
                
                    if(countFiles === numberFiles) {
                        //console.log("countFiles = "+countFiles)
                        if (scanFiles.length !==0 ){
                            groupedScannedFiles.push(scanFiles)
                        }
                        event.sender.send('actionReply', groupedScannedFiles);
                       
                    }
                  }).catch((err) => {
                    //console.log("error: " + err);
                    obj.state = false
                    obj.data = ""
                    scanFiles.push(obj);
                  });
            
        });
        // Send result back to renderer process
    });

    */
    ////console.log('scanned: ',groupedScannedFiles.length);
      // Send result back to renderer process
      //mainWindow.webContents.send("fromMain", responseObj);
  
});

ipcMain.on("validData", async (event, args) => {
    //console.log('args: '+args)
    if(!args){
        dialog.showErrorBox('AFB-SCANNUMARCH', 'Veuillez renseigner les propriétés correctes.');
    }
   
    event.sender.send('validDataReply', 'groupedScannedFiles');
});

ipcMain.on("toAlfresco", async (event, args) => {
    //console.log('args: '+args)
    var nbreEnvoye = readAlfrescoFolder()
    event.sender.send('alfrescoReply', 'Response from Alfresco: ' + nbreEnvoye);
});

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
    //console.log('******** File created from base64 encoded string ********');
}

function createGif() {
    const loadingImageDate = "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";
    var chemin = path.join(__dirname, 'assets/img/loading.gif')
    var bitmap = Buffer.from(loadingImageDate, 'base64');
    fs.writeFileSync(chemin, bitmap);

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
    //const filePath = path.join(__dirname, filename);
    const filePath = path.join(filename);
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
//  readQRCode2('C://numarch/inputs/numarch0512/image-276/image-274.jpg').then((message) => {
//    console.log("qrcode = "+message);
//    }).catch(console.log);
//  readQRCode2('./assets/img/image-002.jpg').then(console.log).catch(console.log);

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

    //console.log(JSON.stringify(trx))
    return trx;
 }

 async function getImageFromPdf(event) {
   
    var inputDir = path.join('C:\\numarch\\', 'in');
    // Parcours du dossier pour rechercher les pdf scannés
    var indexedDir = fs.readdirSync(inputDir);
    //console.log(indexedDir.length + ' dossier trouvé')

    var file;
    var ext;
    var basename
    /*
    for (var ind = 0; ind < indexedDir.length; ind++) {
        file = indexedDir[ind];

        //Verifie si l'extension est .pdf
        ext = path.extname(path.join(inputDir, file));
        basename = path.basename( file, ext )
        if (ext === '.pdf') {
           
            const existingPdfBytes = await new Promise((resolve, reject) => {
                fs.readFile(path.join(inputDir, file), (err, result) => {
                  if (err) {
                    reject(err)
                  }
                  if (!err) {
                    resolve(result)
                 }
               })
              })

              const pdfDoc = await PDFDocument.load(existingPdfBytes)
              const pages = pdfDoc.getPages()
        //      //console.log(file+' Page: '+pages[0].doc.context.indirectObjects.get("R"))
              const result = []
             
              pages[0].doc.context.indirectObjects.forEach(el => {
                 if (el.hasOwnProperty('contents')) result.push(el.contents)
               })
              const mime = await Promise.all(result.map(async (el) => {
                 return new Promise(async (resolve) => {
                   const res = await getMimeType(el)
                   if (res) {
                     resolve(res)
                   }
                 })
               }));
               var num = 0
               await Promise.all(mime.map(async (el, i) => {
                  // //console.log('el.mime: '+el.mime+' counter: '+basename)
                   if (el.mime === 'image/jpeg') {
                     return new Promise(async (resolve) => {
                       const res = await writeJpgFile(result[i], `image-${num++}`, basename);
                      resolve(res)
                     })
                   }
                 })
               )


               
        }
    }
    */
    await request2(event);
    //indexedDir.forEach(d => deleteFile(path.join(inputDir, d)));
    
 }

 function deleteFolder(dir) {
    if (fs.existsSync(dir)) { 
      try {
        fs.rmdirSync(dir, { recursive: true });
        //console.log(`${dir} is deleted!`);
      } catch (err) {
          console.error(`Error while deleting ${dir}.`);
      }
    }
  }

  function deleteFile(directoryPAth) {
    if (fs.existsSync(directoryPAth)) { 
      fs.unlink(directoryPAth, (err) => {
        if (err) {
            throw err;
        }
        //console.log("Delete File successfully.");
      });
    }
  }
 //  getImageFromPdf();
  
   function writeJpgFile(tabFile, filename,ext) {
      var outputDir = path.join('C:\\numarch\\', 'scans', ext);

      if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir, { recursive: true });
      }

      var callback = (err) => {
        if (err){
          //console.log('Error: '+err);
         // throw err;
        } 
       // //console.log('It\'s saved!');
      }
        // Uint8Array
        const data = tabFile; //new Uint8Array(Buffer.from(pdfBytes));
        fs.writeFile(path.join(outputDir, filename+'.jpg'), data, callback);
   }

   function readAlfrescoFolder() {

        var indexedPath = path.join('C:\\numarch\\', 'alfresco');
        indexedDir = fs.readdirSync(indexedPath);
        //console.log(indexedDir.length)

        indexedDir.forEach(dir => {
            //console.log(dir)
        });

        requestGet();



        return indexedDir.length;
   }

function requestGet() {

        const request = net.request({
            method: 'GET',
            protocol: 'http:',
            hostname: '127.0.0.1',
            port: 8080,
            path: '/rest/api/v1/files/tmp_2211231853389690_image-64',
            redirect: 'follow'
        });
        request.on('response', (response) => {
            //console.log(`STATUS: ${response.statusCode}`);
            //console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
    
            response.on('data', (chunk) => {
                //console.log(`BODY: ${chunk}`)
            });
        });
        request.on('finish', () => {
            //console.log('Request is Finished')
        });
        request.on('abort', () => {
            //console.log('Request is Aborted')
        });
        request.on('error', (error) => {
            //console.log(`ERROR: ${JSON.stringify(error)}`)
        });
        request.on('close', (error) => {
            //console.log('Last Transaction has occurred')
        });
        request.setHeader('Content-Type', 'application/json');
        request.end();
   
}

async function request2(event) {
    const fs = require('fs-extra');
    var endpoint = "http://127.0.0.1:8989/rest/api/v1/files/images";
    const request = net.request(endpoint);

    request.on('response', (response) => {
        console.log(`STATUS: ${response.statusCode}`);

        response.on('end', () => {
            console.log('No more data in response.');
            var inputDir = path.join('C:\\numarch\\', 'in') 
            var archDir = path.join('C:\\numarch\\', 'archDocx') 
            var indexedDir = fs.readdirSync(inputDir);
            timestamp = new Date();
            var instantTime = moment(timestamp).format(simpleFormat); 

            indexedDir.forEach(d => {
              //  deleteFile(path.join(inputDir, d))
                fs.move(path.join(inputDir, d), path.join(archDir, 'arch_'+instantTime+'_'+d), (err) => {
                    if (err) return console.log(err);
                    console.log(`File successfully moved!!`);
                });
            });
           

            requestServiceCode(event);
        });

        response.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });


    });

    request.on('finish', () => {
        console.log('Request is Finished')
    });
    request.on('abort', () => {
        console.log('Request is Aborted')
    });
    request.on('error', (error) => {
        //console.log(`ERROR: ${JSON.stringify(error)}`)
        dialog.showErrorBox('AFB-SCANNUMARCH', 'SERVICE INDISPONIBLE.');
        event.sender.send('actionReply', "AFB-SERVICE-ERROR");
    });
    request.on('close', (error) => {
        console.log('Last Transaction has occurred')
    });

    request.end();
}

async function processFile(event) {

    var scanFiles = [];
    var groupedScannedFiles = []
    var countFiles = 0;
    var numberFiles;
    //joining path of directory 
    const directoryPath = path.join('C:\\numarch\\', 'scans');
    const indexedPath = path.join('C:\\numarch\\', 'indexes');
    const worksPath = path.join('C:\\numarch\\', 'works');

    // Scans folders
    var indexedDir;
    ////console.log(JSON.stringify(indexedDir));
    var inFileName;
    var inFileNames;
    var str64;
    var obj;
    var nbre;
    var countFiles;
    var loadData;
    var content;

    scanFiles = [];
    indexedDir = fs.readdirSync(worksPath);

    for (var ind = 0; ind < indexedDir.length; ind++) {
        //console.log('Index Folder: ' ,indexedDir[ind]);
        inFileName = indexedDir[ind];
        inFileNames = fs.readdirSync(path.join(worksPath, inFileName));
        countFiles = inFileNames.length - 1;
        nbre = 0;
        scanFiles = [];
        loadData = ""
       /// if (fs.existsSync(dir)) { 
        try{
            content = fs.readFileSync(path.join(worksPath, inFileName, 'data.json'), {encoding:'utf8', flag:'r'});
            //console.log(content);
            loadData = JSON.parse(content); //now it an object
        } catch (err) {
             countFiles++;
             console.error();
        }
       

       // //console.log(JSON.stringify(inFileNames));
        for (f in inFileNames) {

            if (inFileNames[f] === 'data.json') continue;

            obj = {}
            obj.filenom = ""
            obj.enbase64 = ""
            obj.state = false
            obj.data = "" //TODO: extract data from xml file
            obj.filenom = inFileNames[f];
            obj.enbase64 = await base64_encode(path.join(worksPath, inFileName, inFileNames[f]));
            
            nbre++;
            if (countFiles == nbre) {
                obj.data = loadData;
                scanFiles.push(obj);
                groupedScannedFiles.push(scanFiles)
            }
            else{
                scanFiles.push(obj);
            }
        }
    }
    //console.log('scanned: ',groupedScannedFiles.length);

    scanFiles = [];
    var indexedDirs = fs.readdirSync(directoryPath);
    var chemin;
    indexedDirs = indexedDirs.filter(f => fs.statSync(path.join(directoryPath,f)).isDirectory())
    countFolders = indexedDirs.length;
    nbreFolder = 0;
    
    if (countFolders === 0) {
        var message = groupedScannedFiles.length;
        var piece = (groupedScannedFiles.length < 2) ? 'Pièce trouvé' : 'Pièces trouvées';
        message = message.toString();
        message = message + " " + piece
         //    event.sender.send('actionReply', groupedScannedFiles.reverse());
         event.sender.send('actionReply', groupedScannedFiles);

        dialog.showMessageBoxSync(mainWindow, {
            type: 'info',
            title: 'AFB-SCANNUMARCH',
            message: message,
            buttons: ['OK']
        });
    }

    for (var d in indexedDirs) {
        nbreFolder++;
        chemin = fs.statSync(path.join(directoryPath,indexedDirs[d]));
        if (chemin.isDirectory()) {
            console.log('Scan folder: ' + indexedDirs[d])
            indexedDir = fs.readdirSync(path.join(directoryPath,indexedDirs[d]));
            countFiles = indexedDir.length;
            nbre = 0;
            var timestamp;
            await orderCollectFile(indexedDir)

            for (var ind in indexedDir) {
                
                inFileName = indexedDir[ind];

            //    ext = path.extname(path.join(directoryPath, indexedDirs[d], inFileName));
             //   basename = path.basename( inFileName, ext )
            //    console.log('basename ',parseInt(basename.replace('image-', '')));
                timestamp = new Date();
                var instantTime = moment(timestamp).format(simpleFormat); 
                //console.log('instantTime ',instantTime);
                 
                obj = {}
                obj.foldernom = indexedDirs[d]
                obj.filenom = ""
                obj.enbase64 = ""
                obj.state = false
                obj.data = "" //TODO: extract data from xml file
                obj.filenom = 'tmp_' + instantTime + '_' + inFileName;
            //    console.log('Processing File - 0: ' ,indexedDir[ind]);
                obj.enbase64 = await base64_encode(path.join(directoryPath, indexedDirs[d], inFileName));
            //    console.log('Processing File: ' ,indexedDir[ind]);
                
                await readQRCode(path.join(directoryPath, indexedDirs[d], inFileName))
                        .then((message) => {
                        
                    nbre++;
                    if (message.indexOf('AFB QRCODE NOT FOUND') !== -1) {
                        //console.log("qrcode = "+message);
                        obj.state = false
                        obj.data = ""
                        scanFiles.push(obj);
                    }
                    else{
                        //console.log("qrcode = "+message);
                        obj.state = true
                        obj.data = extractInformation(message)
                        scanFiles.push(obj);
                        groupedScannedFiles.push(scanFiles)
                        scanFiles = [];
                    }
                    //console.log("countFiles = "+countFiles+", nbre = "+nbre)
                    if(countFiles === nbre) {
                        if (scanFiles.length !==0 ){
                            groupedScannedFiles.push(scanFiles)
                        }
                        //  dialog.showMessageBox('AFB-SCANNUMARCH', groupedScannedFiles.length + groupedScannedFiles.length < 2 ? 'Pièce trouvé' : 'Pièces trouvées');
                        //console.log('message scanned: ',groupedScannedFiles.length);
                   
                    }
                }).catch((err) => {
                    //console.log("error: " + err);
                    obj.state = false
                    obj.data = ""
                    scanFiles.push(obj);
                });
            }
            //console.log("countFolders = "+countFolders+", nbreFolder = "+nbreFolder)
            if(countFolders === nbreFolder) {
                console.log('message scanned: ',groupedScannedFiles.length);
                var message = groupedScannedFiles.length;
                var piece = (groupedScannedFiles.length < 2) ? 'Pièce trouvé' : 'Pièces trouvées';
                message = message.toString();
                message = message + " " + piece

               // event.sender.send('actionReply', groupedScannedFiles.reverse());
                event.sender.send('actionReply', groupedScannedFiles);

                dialog.showMessageBoxSync(mainWindow, {
                    type: 'info',
                    title: 'AFB-SCANNUMARCH',
                    message: message,
                    buttons: ['OK']
                });
            }
            
        }
    }
}

async function processFile2(event) {

    var scanFiles = [];
    var groupedScannedFiles = []
    var countFiles = 0;
    var numberFiles;
    //joining path of directory 
    const directoryPath = path.join('C:\\numarch\\', 'inputs');
    const indexedPath = path.join('C:\\numarch\\', 'indexes');
    const worksPath = path.join('C:\\numarch\\', 'works');

    // Scans folders
    var indexedDir;
    var indexedFiles;
    var qrFileName;
    ////console.log(JSON.stringify(indexedDir));
    var inFileName;
    var inFileNames;
    var str64;
    var obj;
    var nbre;
    var countFiles;
    var loadData;
    var content;

    scanFiles = [];
    indexedDir = fs.readdirSync(worksPath);

    for (var ind = 0; ind < indexedDir.length; ind++) {
        //console.log('Index Folder: ' ,indexedDir[ind]);
        inFileName = indexedDir[ind];
        inFileNames = fs.readdirSync(path.join(worksPath, inFileName));
        countFiles = inFileNames.length - 1;
        nbre = 0;
        scanFiles = [];
        loadData = ""
       /// if (fs.existsSync(dir)) { 
        try{
            content = fs.readFileSync(path.join(worksPath, inFileName, 'data.json'), {encoding:'utf8', flag:'r'});
            //console.log(content);
            loadData = JSON.parse(content); //now it an object
        } catch (err) {
             countFiles++;
             console.error();
        }
    
        for (f in inFileNames) {

            if (inFileNames[f] === 'data.json') continue;

            obj = {}
            obj.filenom = ""
            obj.enbase64 = ""
            obj.state = false
            obj.data = "" //TODO: extract data from xml file
            obj.filenom = inFileNames[f];
            obj.enbase64 = await base64_encode(path.join(worksPath, inFileName, inFileNames[f]));
            
            nbre++;
            if (countFiles == nbre) {
                obj.data = loadData;
                scanFiles.push(obj);
                groupedScannedFiles.push(scanFiles)
            }
            else{
                scanFiles.push(obj);
            }
        }
    }
    //console.log('scanned: ',groupedScannedFiles.length);

    scanFiles = [];
    var indexedDirs = fs.readdirSync(directoryPath);
    var chemin;

    // Compte le nombre de dossiers (caisse differentes) dans le repertoire inputs
    indexedDirs = indexedDirs.filter(f => fs.statSync(path.join(directoryPath,f)).isDirectory())
    var qrcountFolders = indexedDirs.length;
    var qrnbreFolder = 0;
    
    if (qrcountFolders === 0) {
        var message = groupedScannedFiles.length;
        var piece = (groupedScannedFiles.length < 2) ? 'Pièce trouvé' : 'Pièces trouvées';
        message = message.toString();
        message = message + " " + piece
    //    event.sender.send('actionReply', groupedScannedFiles.reverse());
        event.sender.send('actionReply', groupedScannedFiles);

        dialog.showMessageBoxSync(mainWindow, {
            type: 'info',
            title: 'AFB-SCANNUMARCH',
            message: message,
            buttons: ['OK']
        });
    }
    else {
        for (var d in indexedDirs) {
            qrnbreFolder++;
            // Chaque Piece comptable
            chemin = fs.statSync(path.join(directoryPath,indexedDirs[d]));
            if (chemin.isDirectory()) {
             //   console.log('Scan folder: ' + indexedDirs[d])
                indexedDir = fs.readdirSync(path.join(directoryPath,indexedDirs[d]));
                qrcountFolder= indexedDir.length;
                nbreFolder = 0;
                var qrnbre = 0;

                indexedDir = await orderCollectFile2(indexedDir)

               
                for (var ind in indexedDir) {
                    
                    inFileName = indexedDir[ind];
                //    console.log("qrcode - inFileName = "+inFileName);
                    indexedFiles = fs.readdirSync(path.join(directoryPath,indexedDirs[d], inFileName));
                    qrcountFiles = indexedFiles.length - 1
                    qrnbre = 0;
                    scanFiles = [];
                    loadData = ""

                    try{
                        content = fs.readFileSync(path.join(directoryPath,indexedDirs[d], inFileName, 'data.json'), {encoding:'utf8', flag:'r'});
                        //console.log(content);
                        loadData = JSON.parse(content); //now it an object
                      //  console.log(loadData);
                    } catch (err) {
    
                         console.error();
                    }
                   
                    indexedFiles = await orderCollectFile2(indexedFiles)

                    for (var inf in indexedFiles) {

                        qrFileName = indexedFiles[inf]
                      //  console.log("qrcode = "+qrFileName);
                       
                            if (qrFileName === 'data.json') continue;
                            timestamp = new Date();
                            var instantTime = moment(timestamp).format(simpleFormat); 

                            obj = {}
                            obj.filenom = ""
                            obj.foldernom = indexedDirs[d]
                            obj.enbase64 = ""
                            obj.state = false
                            obj.data = "" //TODO: extract data from xml file
                            obj.filenom = 'tmp_' + instantTime + '_' + qrFileName;
                           
                            obj.enbase64 = await base64_encode(path.join(directoryPath,indexedDirs[d], inFileName, qrFileName));
                            
                            qrnbre++;
                            if (qrcountFiles == qrnbre) {
                                obj.data = loadData;
                                obj.state = true
                                scanFiles.push(obj);
                                groupedScannedFiles.push(scanFiles)
                            }
                            else{
                                scanFiles.push(obj);
                            }
                    
                    }
                
                }
             //   console.log("qrcountFolders = "+qrcountFolders+", qrnbreFolder = "+qrnbreFolder)
                if(qrcountFolders === qrnbreFolder) {
                    console.log('message scanned: ',groupedScannedFiles.length);
                    var message = groupedScannedFiles.length;
                    var piece = (groupedScannedFiles.length < 2) ? 'Pièce trouvé' : 'Pièces trouvées';
                    message = message.toString();
                    message = message + " " + piece
    
                   // event.sender.send('actionReply', groupedScannedFiles.reverse());
                    event.sender.send('actionReply', groupedScannedFiles);
    
                    dialog.showMessageBoxSync(mainWindow, {
                        type: 'info',
                        title: 'AFB-SCANNUMARCH',
                        message: message,
                        buttons: ['OK']
                    });
                }
                
            }
        }
    }


   

}

async function orderCollectFile(collection) {

         collection = await collection.sort((n1,n2) => {
        
          var extNum1,num1, extNum2, num2 
          extNum1 = path.extname(n1);
          num1 = path.basename( n1, extNum1 ).replace('image-', '')
          extNum2 = path.extname(n2);
          num2 = path.basename( n2, extNum2 ).replace('image-', '')
          

          if (parseInt(num1) > parseInt(num2)) {
              return 1;
          }
  
          if (parseInt(num1) < parseInt(num2)) {
              return -1;
          }
  
          return 0;
         
         //return parseInt(num1) - parseInt(num2);
      });

      return collection;
  
}

async function orderCollectFile2(collection) {

    collection = await collection
    .filter(f => path.extname(f) !== 'json')
    .sort((n1,n2) => {
   
     var extNum1,num1, extNum2, num2 
     extNum1 = path.extname(n1);
     num1 = path.basename( n1, extNum1 ).replace('image-', '')
     extNum2 = path.extname(n2);
     num2 = path.basename( n2, extNum2 ).replace('image-', '')
     

     if (parseInt(num1) > parseInt(num2)) {
         return 1;
     }

     if (parseInt(num1) < parseInt(num2)) {
         return -1;
     }

     return 0;
    
    //return parseInt(num1) - parseInt(num2);
 });

 return collection;

}

async function requestServiceCode(event) {
    //console.log("..... REQUEST ......")
     var endpoint = "http://127.0.0.1:8989/rest/api/v1/files/images/qrcode";
     const request = net.request(endpoint);
 
     request.on('response', (response) => {
         console.log(`STATUS: ${response.statusCode}`);
 
         response.on('end', () => {
             console.log('Service QRCODE - No more data in response.');
            
         });
 
         response.on('data', (chunk) => {
             console.log(`BODY - DOSSIERS: ${chunk}`);
             processFile2(event)
         });
 
 
     });
 
     request.on('finish', () => {
         //console.log('Request is Finished')
     });
     request.on('abort', () => {
         //console.log('Request is Aborted')
     });
     request.on('error', (error) => {
         //console.log(`ERROR: ${JSON.stringify(error)}`)
         dialog.showErrorBox('AFB-SCANNUMARCH', 'SERVICE INDISPONIBLE.');
         event.sender.send('actionReply', "AFB-SERVICE-ERROR");
     });
     request.on('close', (error) => {
         //console.log('Last Transaction has occurred')
     });
 
     request.end();
 }
  
   