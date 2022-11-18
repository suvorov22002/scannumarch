/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 * 
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
 const path = require('path');
 let fs = require('fs');

 window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type])
    }
  })
  
  console.log(process)

  
function configFolders() {
  
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
}
configFolders();

