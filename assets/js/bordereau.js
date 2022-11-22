const fs = require('fs');
const path = require('path');
const { PDFDocument, PageSizes } = require('pdf-lib')

let globalResponse; // handle array of object's  (name and base64)
let map = new Map();
let charge = 0;
const loadingImageDate = "data:image/gif;base64,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";
  



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

  function manageVisibleBtn() {
    if (globalResponse === undefined || globalResponse.length === 0) {
        document.getElementById("btnAcs").style.visibility = "hidden"
        document.getElementById("btnFusion").style.visibility = "hidden"
        document.getElementById("btnSplit").style.visibility = "hidden"
    }
    else{
      document.getElementById("btnAcs").style.visibility = "visible"
      document.getElementById("btnFusion").style.visibility = "visible"
      document.getElementById("btnSplit").style.visibility = "visible"
    }
  }
  manageVisibleBtn();

  /* Format account */
  function formatAccount() {
    $('#ncp').keyup(function() {
        //this.value = this.value.length > 11 ? this.value.replace('-','h').substring(0,11) + '-' + this.value.substring(11) : this.value;
        if (this.value.length == 12) {
           var prefix = this.value.substring(0, 11);
           var suffix = this.value.substring(11);
           this.value = prefix + '-' + suffix
        }
    });
  }
  formatAccount();

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
    resetClassOnlive(index);
    //$('#btn-'+index).addClass('onlive');
    localStorage.setItem('CURRENT_FILE', internData[internData.length - 1].filenom);
 
}

function onSupp(btn) {
  var id = btn.id
  var index = id.replace("btnOne-","")
  console.log("index: "+index)
  var ele = globalResponse[index]
  //console.log("globalResponse: "+ele[ele.length - 1].filenom)
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
     
      //$('#btn-'+(nn-1)).addClass('onlive');

  // - Bloc documents traités (see, approve, delete)
        var currProcess = $('#process');
        for (let j = 0; j < globalResponse.length; j++) {
            var internData = globalResponse[j];
            currProcess.append("<button type='button' id='btn-" + j + "' onclick='onLoadQRDoc(this);' class='bg-blueGray-200  border-blueGray-500 text-black text-xs btn_num rounded mr-2  m-1'>"+internData[internData.length-1].filenom+"</button>")
            currProcess.append("<button type='button' class='mr-2' id='btnOne-" + j + "' title='Supprimer ce dossier.' onclick='onSupp(this);' ><i class='fa fa-times-circle' style='font-size:24px;color:red'></i></button>")
            currProcess.append("<button type='button' class='mr-2' id='btnTwo-" + j + "' title='Valider les Proprietés.' onclick ='onUpdate(this);'><i class='fa fa-check-circle' style='font-size:24px;color:green'></i></button>")
        }

        var dirWorks;
        var lastDot;
        var interFileN = ele[ele.length - 1].filenom;
        if (interFileN.startsWith('work')) {
          interFileN = interFileN.replace('work','tmp')
          console.log('delete here')
          dirWorks = 'C:\\numarch\\works';
          lastDot = interFileN.lastIndexOf('.');
          console.log(lastDot)
          deleteFolder(path.join(dirWorks, interFileN.substring(0, lastDot)))
        }
        
        resetClassOnlive(nn-1);
        anomalies();
       
}

function onUpdate(btn) {
  var id = btn.id // recupere l'id de l'element courant (btnOne-i)
  var index = id.split('-')[1]
  //console.log("globalResponse: "+id)

  var fileSelected = globalResponse[index]
  var etat = fileSelected[fileSelected.length-1].state
  //console.log("fileSelected: "+JSON.stringify(fileSelected[fileSelected.length-1].state))

  if (validDataUnique(fileSelected[fileSelected.length-1].data) && !state){
      //console.log('je modifie')
      document.getElementById("btn-"+index).style.borderColor = "green";
      charge = charge - 1;
      if (charge < 1) {
        $('#anomalie').hide();
      }
      else{
        $('#anomalie').show();
        $('#anomalie').text(charge > 50 ? '50+' : charge);
      }

      //map.set(fileLive, arrayCurrFile)
      fileSelected[fileSelected.length-1].state = true
      globalResponse[index] = fileSelected;
  
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
/*
    let setLoad = setInterval(
      () => {
          console.log('spinner')
          $('body').toggleClass('loading')
      }, 100
    )
*/
    $('body').addClass('loading')

    setTimeout(
      () => {
        ipc.send('loadScanFile','Bonjour Electron depuis AFB');
      }, 1000
   )
   
    

    ipc.once('actionReply', async function(event, response){
       
       //clearInterval(setLoad);
       $('body').removeClass('loading')
       globalResponse = []
       if (response.length === 0) {
         // alert('Aucun document à numeriser.');
          return;
       }

       globalResponse = response;
       manageVisibleBtn();

       var nn = globalResponse.length;
       var lastFilesRetrieved = globalResponse[nn-1]
       var fileDisplayed = lastFilesRetrieved[lastFilesRetrieved.length-1]
       //console.log("fileDisplayed: ",fileDisplayed.enbase64)
       // console.log("Response: ",nn)
       

       let currentProcess = $('#process');
       for (let j = 0; j < globalResponse.length; j++) {
           var internData = globalResponse[j];
           currentProcess.append("<button type='button' id='btn-" + j + "' onclick='onLoadQRDoc(this);' class='bg-blueGray-200  border-blueGray-500 text-black text-xs btn_num rounded mr-2  m-1'>"+internData[internData.length-1].filenom+"</button>")
           currentProcess.append("<button type='button' class='mr-2' id='btnOne-" + j + "' title='Supprimer ce dossier.' onclick='onSupp(this);' ><i class='fa fa-times-circle' style='font-size:24px;color:red'></i></button>")
           currentProcess.append("<button type='button' class='mr-2' id='btnTwo-" + j + "' title='Valider les Proprietés.' onclick ='onUpdate(this);'><i class='fa fa-check-circle' style='font-size:24px;color:green'></i></button>")
           
           map.set(internData[internData.length-1].filenom, internData); // store all processing files in map for future utilisation
       }

       anomalies();

      
        // Fill properties and display receipts
       fillProperties(lastFilesRetrieved);

       localStorage.setItem('CURRENT_FILE', fileDisplayed.filenom);
       resetClassOnlive(nn-1);
       //$('#btn-'+(nn-1)).addClass('onlive');
       
      // clearInterval(setLoad);
       
    })
   
});

function fillProperties(internData) {
  var ind = internData.length;
  //console.log('ind: '+ind)
  //console.log('ind: '+JSON.stringify(internData))
  // Fill properties
  if (typeof internData[ind-1].data === 'object') {
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
    var trackError;
    for (let jj = 0; jj < globalResponse.length; jj++) {
      var internDatas = globalResponse[jj];
      if (internDatas.length > 3){
        internDatas[internDatas.length-1].state = false
        charge = charge + 1;
        document.getElementById("btn-"+jj).style.borderColor = "red";
      }
      else{
        if (internDatas[internDatas.length-1].state){
          internDatas[internDatas.length-1].state = true
          trackError = validDataUnique(internDatas[internDatas.length-1].data);
          //console.log('trackError ', trackError) 
          if(!trackError) {
            charge = charge + 1;
            document.getElementById("btn-"+jj).style.borderColor = "red";
            internDatas[internDatas.length-1].state = false
            globalResponse[jj] = internDatas;
          }
          else {
            document.getElementById("btn-"+jj).style.borderColor = "green";
          }
          
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
  var ls = $("input.splitAfb[type=checkbox]")
  var fileLive;
  var arrayLive;
  var arrayRemovedFiles = [];

  fileLive = localStorage.getItem('CURRENT_FILE');
  console.log('CURRENT_FILE: '+fileLive)
  if (fileLive) {
    arrayLive = map.get(fileLive)
  }
 console.log('ls: '+ls.length+' arrayLive: '+arrayLive.length)
  for (var i=0; i<ls.length-1; i++) {
    //console.log(document.getElementById("btnCheck-"+ i).checked)
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
  console.log('map: '+arrayRemovedFiles[arrayRemovedFiles.length - 1].filenom)
  map.set(arrayRemovedFiles[arrayRemovedFiles.length - 1].filenom, arrayRemovedFiles);
  
  // Mettre current file (arrayLive) à jour dans MAP
  const jndex = globalResponse.findIndex(object => {
    return object === arrayLive;
  }); 
  console.log(arrayLive.length)
  arrayLive = arrayLive.filter(item => !arrayRemovedFiles.includes(item))
  console.log(arrayLive.length)
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
        console.log('update properties: '+JSON.stringify(arrayCurrFile[arrayCurrFile.length - 1].data))
        arrayCurrFile[arrayCurrFile.length - 1].state = true
        globalResponse[xxx] = arrayCurrFile;
        anomalies();
      }
    } 
    else{
      
      ipc.send('validData',(validData() || validDataUnique()));
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
    if  (intNcp.length != 11 || !isNumerics(intNcp) || intCle.length != 2 || !isNumerics(intCle)) {
        erroFields.push('ncp');
    }

    // amount valid
    //console.log('Amount: '+amount)
    if  (!isNumeric(amount) || amount == 0) {
        erroFields.push('amount');
    }

    // eve valid
    //console.log('EVE: '+eve)
    if  (!isNumerics(eve) || eve.trim().length != 6) {
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
    if  (!isNumerics(intDate) || intDate.trim().length != 8) {
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

function validDataUnique(data){
  var erroFields = [];
  if (data && data !== "") {
    
  
   // type valid
    if (typeof data.setType !== "string" || data.setType.trim().length == 0) {
       erroFields.push('testlist');
    }
    // user valid
    if  (typeof data.setUti !== "string" || data.setUti.trim().length != 4) {
        erroFields.push('user');
    }
    // NCP and CLE valid   
    var intNcp = data.setNcp;
    //console.log('NCP: '+intNcp)
    var intCle = data.setCle;
    //console.log('CLE: '+intCle)
    if  (intNcp.length != 11 || !isNumerics(intNcp) || intCle.length != 2 || !isNumerics(intCle)) {
        erroFields.push('ncp');
    }
    // amount valid
    if  (!isNumerics(data.setMon) || data.setMon == 0) {
        erroFields.push('amount');
    }
    //console.log('EVE: '+eve)
    if  (!isNumerics(data.setEve) || data.setEve.trim().length != 6) {
      erroFields.push('ref');
   } 
   // age valid
   if  (!isNumerics(data.setAge) || data.setAge.trim().length != 5) {
       erroFields.push('age');
   } 
   // date valid
   var intDate = data.setDco //.split("-").reverse().join("");
   //console.log('Date: '+intDate)
   if  (intDate === undefined || !isNumerics(intDate) || intDate.trim().length != 8) {
     erroFields.push('date');
   } 

  
     return (erroFields.length == 0);
   if (erroFields.length != 0) {
   // console.log(JSON.stringify(data)) 
      //console.log('erroFields ',JSON.stringify(erroFields))
    //  for (obj in erroFields) {
    //    var elem = 'sp_'+erroFields[obj]
    //    document.getElementById(elem).classList.add('error');
    //  }
      return false;
   }
   else{
      return true
   }
  }
  return false;
}

function isNumeric(str) {
  if (typeof str != "string") return false 
  return !isNaN(str) && 
         !isNaN(parseFloat(str))
}

function isNumerics(value) {
  
 return  /^-?\d+$/.test(value);
 
}

function verifierInt(_str){
  var _echar = [..._str];
 
  //console.log(_str + ' ' +JSON.stringify(_echar))

	let v = false;

//  for (var i=0; i < _echar.length; i++) {
    try{
      parseInt(_str);
      v = true;
    }
    catch(err){
      return false;
    }
    
//  }
	return v;
}

function sendToFusion() {

   var dirIndexes = 'C:\\numarch\\indexes';
   var dirWorks = 'C:\\numarch\\works';
   var dirScans = 'C:\\numarch\\scans';
   var dirAlfresco = 'C:\\numarch\\alfresco';
   if (globalResponse === null) return;
   var fusionSize = globalResponse.length;
   var controlSize = 0;

//   console.log('Fusion size: ',globalResponse.length)
   
  if (globalResponse && globalResponse.length > 0) {
    $('body').addClass('loading')
    let buff;   
    globalResponse.forEach(file => {
       var intermData = file[file.length - 1].filenom;
       var intermState = file[file.length - 1].state;
       
       const lastDot = intermData.lastIndexOf('.');
       var fileNom =   intermData.substring(0, lastDot);
  //     console.log(fileNom + ' -**- ' + intermState)
       var intFolder;  
       var intFolderWorks; 
       var intFolderAlfreco;
       var realFoder;
       var jsonVariable = JSON.stringify(file[file.length-1].data);
       controlSize++;
       realFoder = fileNom.startsWith('work') ? fileNom.replace('work', 'tmp') : (fileNom.startsWith('index') ? fileNom.replace('index', 'tmp') : fileNom)
       intFolder = path.join(dirIndexes, realFoder); 
       intFolderWorks = path.join(dirWorks, realFoder); 
       intFolderAlfreco = path.join(dirAlfresco, realFoder); 
       
     //  console.log('jsonVariable: ',jsonVariable)
       var controlTypeObject = (typeof file[file.length-1].data == 'object' && file[file.length-1].data !== null);

    //   console.log(typeof file[file.length-1].data + ' - ' + controlTypeObject)
       
       if (intermState) sendRToAcs(file, intFolderAlfreco);

       file.forEach(f => {
          
          if((intermState || f.state) && (fileNom.startsWith('tmp') || fileNom.startsWith('work'))){
            if (!fs.existsSync(intFolder)){
              fs.mkdirSync(intFolder, { recursive: true });
              if(controlTypeObject) fs.writeFileSync(path.join(intFolder, 'data.json'), jsonVariable);
            }
            buff = Buffer.from(f.enbase64, 'base64');
            if (fileNom.startsWith('work')) {
               fs.writeFileSync(path.join(intFolder, f.filenom.replace('work', 'index')), buff);
               //deleteFile(path.join(intFolderWorks, f.filenom))
               deleteFolder(intFolderWorks)
              // console.log('write file work: '+f.filenom.replace('tmp', 'index'))
            }
            else{
              fs.writeFileSync(path.join(intFolder, f.filenom.replace('tmp', 'index')), buff);
              //console.log('write file tmp: '+f.filenom.replace('tmp', 'index'))
            }
          }
          else if((!intermState || !f.state) && (fileNom.startsWith('tmp'))) {
            if (!fs.existsSync(intFolderWorks)){
              fs.mkdirSync(intFolderWorks, { recursive: true });
              if(controlTypeObject) fs.writeFileSync(path.join(intFolderWorks, 'data.json'), jsonVariable);
            }
            buff = Buffer.from(f.enbase64, 'base64');
            if (f.filenom.indexOf('index') !== -1){
              fs.writeFileSync(path.join(intFolderWorks, f.filenom.replace('index', 'work')), buff);
              //deleteFile(path.join(intFolder, f.filenom))
              deleteFolder(intFolder)
            }
            else{
              fs.writeFileSync(path.join(intFolderWorks, f.filenom.replace('tmp', 'work')), buff);
            }
          }
          var way = path.join(dirScans, f.foldernom, f.filenom.split('_')[2])
          deleteFile(path.join(dirScans, f.foldernom, f.filenom.split('_')[2]))
         
       })

       if (controlSize == fusionSize) {
          const elets =  $("div.block");
          if(elets) elets.remove();

          if (globalResponse){
            for (let i = 0; i < globalResponse.length; i++) {
              $('#btn-'+i).remove();
              $('#btnOne-'+i).remove();
              $('#btnTwo-'+i).remove();
              map = new Map();
           }
           globalResponse = [];
           map = new Map();
          }
          charge = 0;
          $('#anomalie').hide(); // hide span badge
      //    console.log('Fusion end size: ',globalResponse.length)
          $("#testlist").val("");
          $("#user").val("");
          $("#ncp").val("");
          $("#amount").val(0);
          $("#ref").val("");
          $("#age").val("");
          document.getElementById("date").value = "";
          $('body').removeClass('loading')

          var fol;
          indexedDirs = fs.readdirSync(dirScans);
          for (obj in indexedDirs) {
            fol = path.join(dirScans, indexedDirs[obj])
            deleteFolder(fol)
          }
       }
    });

      var fields = ['testlist', 'user', 'ncp', 'amount', 'ref', 'age', 'date'];
      for (obj in fields) {
        var elem = 'sp_'+fields[obj]
        document.getElementById(elem).classList.remove('error');
      }

      manageVisibleBtn();
   }
}

function deleteFile(directoryPAth) {
  if (fs.existsSync(directoryPAth)) { 
    fs.unlink(directoryPAth, (err) => {
      if (err) {
          throw err;
      }
      console.log("Delete File successfully.");
    });
  }
}

function deleteFolder(dir) {
  if (fs.existsSync(dir)) { 
    try {
      fs.rmdirSync(dir, { recursive: true });
      console.log(`${dir} is deleted!`);
    } catch (err) {
        console.error(`Error while deleting ${dir}.`);
    }
  }
}

function resetClassOnlive(index) {
  if (globalResponse){
    for(btn in globalResponse) {
      $('#btn-'+btn).removeClass('onlive');
    }
    $('#btn-'+index).addClass('onlive');
  }
}

$('#anomalie').hide(); // hide span badge

//var today = new Date();
//today = today.toISOString();//.substring(0, 10);
//console.log("today ",today)

//$(function() {
//  setInterval("$('body').toggleClass('loading')", 4000);
//});

function loadingFiles() {
  var interval = setInterval("$('body').toggleClass('loading')", 4000);
  let setLoad = setInterval(
    () => {
        "$('body').toggleClass('loading')"
        if (i == arrayJackpot.length) {
            clearInterval(setNumberInJackpotId);
        }
    }, 100
  )
}

async function sendRToAlfresco() {
  

}

async function sendRToAcs(indexedDir, intFolderAlfreco) {
  var jpgUrl;
  var orig64;
  var dirAlfresco = 'C:\\numarch\\alfresco';
  var jsonVariable;
  //this.afbcore.loading(true);
  var indexedPath = path.join(dirAlfresco)
  var newName = indexedDir[indexedDir.length - 1].filenom
  var lastDot = newName.lastIndexOf('.');
  var composeName =  newName.substring(0, lastDot).split('_')
  console.log(JSON.stringify(composeName))
  newName = composeName[1] + '_' + composeName[2]
  var controlTypeObject = (typeof indexedDir[indexedDir.length - 1].data == 'object' && indexedDir[indexedDir.length - 1].data !== null);
  
  //Creation du dossier
  if (!fs.existsSync(intFolderAlfreco) && controlTypeObject){
    jsonVariable = JSON.stringify(indexedDir[indexedDir.length - 1].data);
    fs.mkdirSync(intFolderAlfreco, { recursive: true });
    fs.writeFileSync(path.join(intFolderAlfreco, 'data.json'), jsonVariable);
  }
  
 
  const pdfDoc = await PDFDocument.create();
  for (var i = 0; i < indexedDir.length; i++) {
      var infiles = indexedDir[i] 
      //Create pdf
      

   //   for(var ii = 0; ii < infiles.length; ii++){
        orig64 = infiles.enbase64
        jpgUrl = 'data:image/jpg;base64,' +orig64;

        //console.log(orig64)
        const jpgImageBytes = Buffer.from(orig64, 'base64');

        //Embed images bytes
        const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);

        // Get the dimension of the image scaled down do 35% of its original size
        const jpgDims = jpgImage.scale(0.35);

        // Add a blank page to the document
        var page = pdfDoc.addPage(PageSizes.A4);

        // Draw the JPG image in the center of the page
        page.drawImage(jpgImage, {
          x: page.getWidth() / 2 - jpgDims.width /2,
          y: page.getHeight() /2 - jpgDims.height /2,
          width: jpgDims.width,  //575
          height: jpgDims.height, //815
        })

  }

    
      // Serialize the PDFDocument to bytes 
      const pdfBytes = await pdfDoc.save();
      
      var callback = (err) => {
        if (err) throw err;
        console.log('It\'s saved!');
      }
        // Uint8Array
        const data = new Uint8Array(Buffer.from(pdfBytes));
        fs.writeFile(path.join(intFolderAlfreco, newName + '.pdf'), data, callback);

}

