let globalResponse; // handle array of object's  (name and base64)
let map = new Map();
let charge = 0;
const fs = require('fs');
const path = require('path');

let filteredTypes = [
    { code: 'NULL', name: 'Choisir le type de document' },
    { code: 'VERESP', name: 'Versement especes' },
    { code: 'RETESP', name: 'Retrait espèces' },
    { code: 'REMCHQ', name: 'Remise cheque' },
    { code: 'ACHDEV', name: 'Achat de devise' },
    { code: 'AUTNCP', name: 'Autorisation en compte' },
    { code: 'AUTRFC', name: 'Autre Flash Cash' },
    { code: 'BONCAI', name: 'Bon de Caisse' },
    { code: 'CAUTIO', name: 'Bordereau de caution' },
    { code: 'CHGESP', name: 'Change espèce' },
    { code: 'CHQBAN', name: 'Chèque Banque' },
    { code: 'CHQCRT', name: 'Chèque certifié' },
    { code: 'CLOCPT', name: 'Cloture compte' },
    { code: 'DATDAT', name: 'Bordereau DAT' },
    { code: 'DEPTER', name: 'Bordereau Dépot à Terme' },
    { code: 'DOMICI', name: 'Bordereau Domiciliation' },
    { code: 'ENVOFT', name: 'Envoi Flash Transfert' },
    { code: 'ENVOMG', name: 'Envoi Money Gram' },
    { code: 'FDCRDT', name: 'Frais Dossier Crédit' },
    { code: 'FRAISA', name: 'Frais Attestations diverses' },
    { code: 'FRSDIV', name: 'Frais Diverses' },
    { code: 'MADMAS', name: 'Bordereau MAD' },
    { code: 'OPECAI', name: 'Autres Opérations de caisse' },
    { code: 'OPECHQ', name: 'Autres Opérations de chèque' },
    { code: 'OPPOFC', name: 'Opposition Flash Cash' },
    { code: 'ORDRAP', name: 'Ordre de rapatriement' },
    { code: 'ORDTRF', name: 'Ordre de transfert' },
    { code: 'PROCUR', name: 'Bordereau Procuration' },
    { code: 'RECPFT', name: 'Reception Flash Transfert' },
    { code: 'RECPMG', name: 'Reception Money Gram' },
    { code: 'REMBFC', name: 'Remboursement Flash Cash' },
    { code: 'REMDOC', name: 'Remise Documentaire' },
    { code: 'REMIFC', name: 'Remise Flash Cash' },
    { code: 'REPRFC', name: 'Reprise Flash Cash' },
    { code: 'RETCOF', name: 'Retrait Coffre' },
    { code: 'RETDEV', name: 'Retrait Devise' },
    { code: 'RSRVFD', name: 'Réservation de fonds' },
    { code: 'TRFAVI', name: 'Transfert AVI' },
    { code: 'TRXBAN', name: 'Transaction banalisée' },
    { code: 'VERDEV', name: 'Versement Devise' },
    { code: 'VIREMT', name: 'Virement' },
    { code: 'VIRMUL', name: 'Virement multiple' },
    { code: 'VIRPER', name: 'Virement permanent' },
    { code: 'VNTDEV', name: 'Vente devise' },
    { code: 'FRSDIV', name: 'Frais Diverses' },
    { code: 'VNTEFC', name: 'Vente Flash Cash' }
  ];

  function listTypes() {

    var dropdown = $('#testlist');
   
    $('>option', dropdown).remove();

    filteredTypes.forEach(function(res, value){
        //console.log(res.code + " : " + res.name);
        dropdown.append($('<option/>').val(res.code).text(res.name));
        //dropdown.append($('<option/>').val("res.code").text("res.name"));
    });
  }
  listTypes();

  function retrieveDocument() {
    var dropdown = $('#testlist').val();
    console.log(dropdown);
  }

  /* All input to uppercase */
  $(function() {
    $('input').keyup(function() {
        this.value = this.value.toLocaleUpperCase();
    });
  });


//$('#testlist').change(function () {
//    var selectedItem = $('#testlist').val();
//    alert(selectedItem);
//});

  /* Format number */
$("input.mask").each((i,ele)=>{
    let clone=$(ele).clone(false)
    clone.attr("type","text")
    let ele1=$(ele)
    clone.val(Number(ele1.val()).toLocaleString("en"))
    $(ele).after(clone)
    $(ele).hide()
    clone.mouseenter(()=>{

        ele1.show()
        clone.hide()
    })
    setInterval(()=>{
        let newv=Number(ele1.val()).toLocaleString("en")
        if(clone.val()!=newv){
            clone.val(newv)
        }
    },10)

    $(ele).mouseleave(()=>{
        $(clone).show()
        $(ele1).hide()
    })
})

/* Check if input is number */
function verifNumber(evt) {

    const accept = '0123456789';
    const keyCode = evt.which ? evt.which : evt.keyCode;
    var balance1 = $("#balance1").text();
    if (accept.indexOf(String.fromCharCode(keyCode)) >= 0 || evt.keyCode===13) {
        if (evt.keyCode === 13) {
          evt.preventDefault();
        }
      return true;
    } else {
        return false;
    }
}

function onLoadQRDoc(btn) {
    var id = btn.id
    var index = id.split('-')[1]
    var internData = globalResponse[index]; // Array of grouped files; last object contains qr code
   
    const elements =  $("div.block");
    if(elements) elements.remove();

    // Fill properties
    fillProperties(internData);
   
   
    localStorage.setItem('CURRENT_FILE', internData[internData.length - 1].filenom);
 
}

function onSupp(btn) {
  var id = btn.id
  var index = id.replace("btnOne-","")
  console.log("index: "+index)
  var ele = globalResponse[index]
  console.log("globalResponse: "+ele[ele.length - 1].filenom)
  //alert("onSupp: "+globalResponse[index].filenom);
  //console.log("globalResponse: "+globalResponse.length)

  if (globalResponse){
    for (let i = 0; i < globalResponse.length; i++) {
      $('#btn-'+i).remove();
      $('#btnOne-'+i).remove();
      $('#btnTwo-'+i).remove();
    }
  }

  // Remove from globalResponse
  globalResponse = globalResponse.filter(item => item !== ele)
  //console.log("globalResponse: "+globalResponse.length)

  // Enlever dans MAP
  map.delete(ele[ele.length - 1].filenom);

   /* Mise à jour de toutes les vues */

  // - Bloc visuel et propriétés
      // Remove element of visual
      const elets =  $("div.block");
      if(elets) elets.remove();

      var nn = globalResponse.length;
      var lastFilesRetrieved = globalResponse[nn-1]
      var fileDisplayed = lastFilesRetrieved[lastFilesRetrieved.length-1]

      // Fill properties and display receipts
      fillProperties(lastFilesRetrieved);
      localStorage.setItem('CURRENT_FILE', fileDisplayed.filenom);

  // - Bloc documents traités (see, approve, delete)
        var currProcess = $('#process');
        for (let j = 0; j < globalResponse.length; j++) {
            var internData = globalResponse[j];
            currProcess.append("<button type='button' id='btn-" + j + "' onclick='onLoadQRDoc(this);' class='bg-blueGray-200  border-blueGray-500 text-black text-xs btn_num rounded mr-2  m-1'>"+internData[internData.length-1].filenom+"</button>")
            currProcess.append("<button type='button' class='mr-2' id='btnOne-" + j + "' title='Supprimer ce dossier.' onclick='onSupp(this);' ><i class='fa fa-times-circle' style='font-size:24px;color:red'></i></button>")
            currProcess.append("<button type='button' class='mr-2' id='btnTwo-" + j + "' title='Valider les Proprietés.' onclick ='onUpdate(this);'><i class='fa fa-check-circle' style='font-size:24px;color:green'></i></button>")
        }
        anomalies();
  
  
}

function onUpdate(btn) {
  var id = btn.id // recupere l'id de l'element courant (btnOne-i)
  var index = id.split('-')[1]
  console.log("globalResponse: "+id)
  document.getElementById("btn-"+index).style.borderColor = "green";

  charge = charge - 1;
  if (charge < 1) {
    $('#anomalie').hide();
  }
  else{
    $('#anomalie').show();
    $('#anomalie').text(charge > 50 ? '50+' : charge);
  }
  
}

function onChecked($event) {
  console.log(event.currentTarget.checked)
}

function onSuppDoc(btn){
  var id = btn.id
  console.log("globalResponse: "+id)
}

const ipc = require('electron').ipcRenderer

const asyncMsgBtn = document.getElementById('fileselect')

let currentChildren2 = $('#visual');

asyncMsgBtn.addEventListener('click', () => {
  
  // Remove element of visual
  const elements =  $("div.block");
  if(elements) elements.remove();
    
    if (globalResponse){
      for (let i = 0; i < globalResponse.length; i++) {
        $('#btn-'+i).remove();
        $('#btnOne-'+i).remove();
        $('#btnTwo-'+i).remove();
        map = new Map();
     }
    }

   
    

    ipc.once('actionReply', async function(event, response){
       //console.log("Response: ",JSON.stringify(response))
      
       if (response.length === 0) {
         // alert('Aucun document à numeriser.');
          return;
       }

       globalResponse = response;

       var nn = globalResponse.length;
       var lastFilesRetrieved = globalResponse[nn-1]
       var fileDisplayed = lastFilesRetrieved[lastFilesRetrieved.length-1]
       //console.log("fileDisplayed: ",fileDisplayed.enbase64)

        // Fill properties and display receipts
        fillProperties(lastFilesRetrieved);
        localStorage.setItem('CURRENT_FILE', fileDisplayed.filenom);

       let currentProcess = $('#process');
       for (let j = 0; j < globalResponse.length; j++) {
           var internData = globalResponse[j];
           currentProcess.append("<button type='button' id='btn-" + j + "' onclick='onLoadQRDoc(this);' class='bg-blueGray-200  border-blueGray-500 text-black text-xs btn_num rounded mr-2  m-1'>"+internData[internData.length-1].filenom+"</button>")
           currentProcess.append("<button type='button' class='mr-2' id='btnOne-" + j + "' title='Supprimer ce dossier.' onclick='onSupp(this);' ><i class='fa fa-times-circle' style='font-size:24px;color:red'></i></button>")
           currentProcess.append("<button type='button' class='mr-2' id='btnTwo-" + j + "' title='Valider les Proprietés.' onclick ='onUpdate(this);'><i class='fa fa-check-circle' style='font-size:24px;color:green'></i></button>")
           
           map.set(internData[internData.length-1].filenom, internData); // store all processing files in map for future utilisation
       }

       anomalies();
       
    })
    ipc.send('loadScanFile','Bonjour Electron depuis AFB');
});

function fillProperties(internData) {
  var ind = internData.length;
  //console.log('ind: '+ind)
  //console.log('ind: '+JSON.stringify(internData))
  // Fill properties
  if (internData[ind-1].data !== "") {
        $("#testlist").val(internData[ind-1].data.setType)
        $("#user").val(internData[ind-1].data.setUti);
        $("#ncp").val(internData[ind-1].data.setNcp + '-' + internData[ind-1].data.setCle);
        $("#amount").val(internData[ind-1].data.setMon);
        $("#ref").val(internData[ind-1].data.setEve);
        $("#age").val(internData[ind-1].data.setAge);
      //  console.log(internData[ind-1].data.setDco.substring(4) + '-' + internData[ind-1].data.setDco.substring(2,4)+ '-' + internData[ind-1].data.setDco.substring(0,2))
        document.getElementById("date").value = internData[ind-1].data.setDco.substring(4) + '-' + internData[ind-1].data.setDco.substring(2,4)+ '-' + internData[ind-1].data.setDco.substring(0,2)//"2022-11-10";
  }
  else{
      $("#testlist").val("")
      $("#user").val("");
      $("#ncp").val("");
      $("#amount").val(0);
      $("#ref").val("");
      $("#age").val("");
    //  console.log(internData[ind-1].data.setDco.substring(4) + '-' + internData[ind-1].data.setDco.substring(2,4)+ '-' + internData[ind-1].data.setDco.substring(0,2))
      document.getElementById("date").value = ""//"2022-11-10";
  }
  
  for (let i = 0; i < internData.length; i++) {
          
    var src = 'data:image/jpg;base64,'+ internData[i].enbase64;
    var divContents = "<div id='block-" + i + "' class='block pt-2 mt-2'>" + 
    "<span id='' class='text-white text-xs font-bold uppercase rounded p-2 m-2' href = '#' >"+internData[i].filenom+" &nbsp;&nbsp;" + 
    "<input class='splitAfb' type='checkbox' onchange='onChecked(event);' id='btnCheck-"+ i + "'></span><button type='button' class='mr-2' id='docx-" + i + "'title='Supprimer le document.' onclick='onSuppDoc(this);' ><i class='fa fa-times-circle' style='font-size:18px;color:red'></i></button>" + 
    "<img class='mb-2 responsive' src='"+src+"' alt='bordereau' width='500px' ></img>" + 
    "</div>";
    currentChildren2.append(divContents);
 }
    validData();
}

function anomalies() {
    charge = 0;
    for (let jj = 0; jj < globalResponse.length; jj++) {
      var internDatas = globalResponse[jj];
      if (internDatas.length > 3){
        internDatas[internDatas.length-1].state = false
        charge = charge + 1;
        document.getElementById("btn-"+jj).style.borderColor = "red";
      }
      else{
        if (internDatas[internDatas.length-1].state){
          document.getElementById("btn-"+jj).style.borderColor = "green";
          internDatas[internDatas.length-1].state = true
        }
        else{
          document.getElementById("btn-"+jj).style.borderColor = "red";
          charge = charge + 1;
        }
      }
  }
  
  if (charge < 1) {
    $('#anomalie').hide();
  }
  else{
    $('#anomalie').show();
    $('#anomalie').text(charge > 50 ? '50+' : charge);
  }
  

}

function onSplit() {
  const eleCheck =  $("input.splitAfb");
  const ls = $("input.splitAfb[type=checkbox]")
  var fileLive;
  var arrayLive;
  var arrayRemovedFiles = [];

  fileLive = localStorage.getItem('CURRENT_FILE');
  if (fileLive) {
    arrayLive = map.get(fileLive)
  }

  for (var i=0; i<ls.length; i++) {
    console.log(document.getElementById("btnCheck-"+ i).checked)
    if (document.getElementById("btnCheck-"+ i).checked) {
        arrayRemovedFiles.push(arrayLive[i])
    }
  }

  if (arrayRemovedFiles.length == 0) {
     return;
  }

  //console.log(JSON.stringify(arrayRemovedFiles))

  // Ajout dans globalResponse
  globalResponse.push(arrayRemovedFiles)

  // Ajouter dans MAP
  map.set(arrayRemovedFiles[arrayRemovedFiles.length - 1].filenom, arrayRemovedFiles);
  
  // Mettre current file (arrayLive) à jour dans MAP
  const jndex = globalResponse.findIndex(object => {
    return object === arrayLive;
  }); 
  
  arrayLive = arrayLive.filter(item => !arrayRemovedFiles.includes(item))

  if (jndex !== -1) {
    arrayLive[arrayLive.length - 1].state = true
    globalResponse[jndex] = arrayLive;
  }

  map.set(fileLive, arrayLive);
  var arrayLives = map.get(fileLive)
  localStorage.setItem('CURRENT_FILE', arrayLives[arrayLives.length - 1].filenom);

  /* Mise à jour de toutes les vues */

  // - Bloc visuel et propriétés
      // Remove element of visual
      const elets =  $("div.block");
      if(elets) elets.remove();

      fillProperties(arrayLives);

  // - Bloc documents traités (see, approve, delete)
        var currProcess = $('#process');
        for (let j = globalResponse.length - 1; j < globalResponse.length; j++) {
            var internData = globalResponse[j];
            currProcess.append("<button type='button' id='btn-" + j + "' onclick='onLoadQRDoc(this);' class='bg-blueGray-200  border-blueGray-500 text-black text-xs btn_num rounded mr-2  m-1'>"+internData[internData.length-1].filenom+"</button>")
            currProcess.append("<button type='button' class='mr-2' id='btnOne-" + j + "' title='Supprimer ce dossier.' onclick='onSupp(this);' ><i class='fa fa-times-circle' style='font-size:24px;color:red'></i></button>")
            currProcess.append("<button type='button' class='mr-2' id='btnTwo-" + j + "' title='Valider les Proprietés.' onclick ='onUpdate(this);'><i class='fa fa-check-circle' style='font-size:24px;color:green'></i></button>")
        }
        anomalies();

 
}

// Mise à jour manuelle des proprietes
function updateProperties() {
    var type = $("#testlist").val();
    var user = $("#user").val();
    var ncp = $("#ncp").val();
    var amount = $("#amount").val();
    var eve = $("#ref").val();
    var age = $("#age").val();
    var date = document.getElementById("date").value;
    var obj = {}
    obj.setType = type;
    obj.setUti = user;
    obj.setNcp = ncp.split('-')[0];
    obj.setMon = amount;
    obj.setEve = eve;
    obj.setAge = age;
    obj.setDco = date.split("-").reverse().join("");
    obj.setCle = ncp.split('-')[1];


    if(validData()){
      var fileLive = localStorage.getItem('CURRENT_FILE');
      var arrayCurrFile = map.get(fileLive);
  
      const xxx = globalResponse.findIndex(object => {
        return object === arrayCurrFile;
      }); 
  
      arrayCurrFile[arrayCurrFile.length - 1].data = obj
      map.set(fileLive, arrayCurrFile);
      //console.log(arrayCurrFile[arrayCurrFile.length - 1].data);
      // Mettre current file (arrayLive) à jour dans MAP
      if (xxx !== -1) {
        arrayCurrFile[arrayCurrFile.length - 1].state = true
        globalResponse[xxx] = arrayCurrFile;
        anomalies();
      }
      
    } 
    else{
      
      ipc.send('validData',validData());
      ipc.once('validDataReply', function(event, response){
          console.log(response)
      });

    }
}

function validData() {
    var fields = ['testlist', 'user', 'ncp', 'amount', 'ref', 'age', 'date'];
    var erroFields = [];
    var type = $("#testlist").val();
    var user = $("#user").val();
    var ncp = $("#ncp").val();
    var amount = $("#amount").val();
    var eve = $("#ref").val();
    var age = $("#age").val();
    var date = document.getElementById("date").value;

    // type valid
    if (typeof type !== "string" || type.trim().length == 0) {
        erroFields.push('testlist');
    }
    // user valid
    if  (typeof user !== "string" || user.trim().length != 4) {
        erroFields.push('user');
    }

 
    // NCP and CLE valid   
    var intNcp = ncp.split('-')[0];
    //console.log('NCP: '+intNcp)
    var intCle = ncp.split('-')[1];
    //console.log('CLE: '+intCle)
    if  (intNcp.length != 11 || !verifierInt(intNcp) || intCle.length != 2 || !verifierInt(intCle)) {
        erroFields.push('ncp');
    }

    // amount valid
    //console.log('Amount: '+amount)
    if  (!isNumeric(amount) || amount == 0) {
        erroFields.push('amount');
    }

    // eve valid
    //console.log('EVE: '+eve)
    if  (!verifierInt(eve) || eve.trim().length != 6) {
       erroFields.push('ref');
    } 

    //console.log('AGE: '+isNumerics(age))
    // age valid
    if  (!isNumerics(age) || age.trim().length != 5) {
        erroFields.push('age');
    } 

    // date valid
    var intDate = date.split("-").reverse().join("");
    //console.log('Date: '+intDate)
    if  (!verifierInt(intDate) || intDate.trim().length != 8) {
      erroFields.push('date');
    } 

    for (obj in fields) {
      var elem = 'sp_'+fields[obj]
      //console.log(elem)
      document.getElementById(elem).classList.remove('error');
    }


    if (erroFields.length != 0) {
        for (obj in erroFields) {
          var elem = 'sp_'+erroFields[obj]
          document.getElementById(elem).classList.add('error');
        }
        return false;
    }
    else{
        return true
    }
}

function isNumeric(str) {
  if (typeof str != "string") return false 
  return !isNaN(str) && 
         !isNaN(parseFloat(str))
}

function isNumerics(value) {
  return /^-?\d+$/.test(value);
}

function verifierInt(_echar){
	let v = false;
	try{
		parseInt(_echar);
		v = true;
	}
	catch(err){
		v = false;
	}
	return v;
	
}

function sendToFusion() {

   var dirIndexes = 'C:\\numarch\\indexes';
   var dirWorks = 'C:\\numarch\\works';
   var dirScans = 'C:\\numarch\\scans';
   
   


  if (globalResponse && globalResponse.length > 0) {
      
    let buff;   
    globalResponse.forEach(file => {
       var intermData = file[file.length - 1].filenom;
       var intermState = file[file.length - 1].state;
       const lastDot = intermData.lastIndexOf('.');
       var fileNom =   intermData.substring(0, lastDot);
       var intFolder = path.join(dirIndexes, fileNom);
       var intFolderWorks = path.join(dirWorks, fileNom);
       var jsonVariable = JSON.stringify(file[file.length-1].data);
       

       file.forEach(f => {
          if(intermState || f.state){
            if (!fs.existsSync(intFolder)){
              fs.mkdirSync(intFolder, { recursive: true });
              console.log('last data: ', jsonVariable);
              fs.writeFileSync(path.join(intFolder, 'data.json'), jsonVariable);
            }
            buff = Buffer.from(f.enbase64, 'base64');
            fs.writeFileSync(path.join(intFolder, f.filenom), buff);
           
          }
          else if(!intermState || !f.state) {
            if (!fs.existsSync(intFolderWorks)){
              fs.mkdirSync(intFolderWorks, { recursive: true });
            }
            buff = Buffer.from(f.enbase64, 'base64');
            fs.writeFileSync(path.join(intFolderWorks, f.filenom), buff);
           
          }
          
          deleteFile(path.join(dirScans, f.filenom))
       })
    })

      var fields = ['testlist', 'user', 'ncp', 'amount', 'ref', 'age', 'date'];
      for (obj in fields) {
        var elem = 'sp_'+fields[obj]
        document.getElementById(elem).classList.remove('error');
      }

   }
}

function deleteFile(directoryPAth) {
  fs.unlink(directoryPAth, (err) => {
    if (err) {
        throw err;
    }
    console.log("Delete File successfully.");
  });
}

<<<<<<< HEAD
function deleteFolder(dir) {
  try {
    fs.rmdirSync(dir, { recursive: true });
    console.log(`${dir} is deleted!`);
  } catch (err) {
      console.error(`Error while deleting ${dir}.`);
  }
}
=======
$('#anomalie').hide(); // hide span badge

>>>>>>> 069161abe09a6c1a3bfee03b5557ccf8dbcf2084


