let globalResponse; // handle files's objects (name and base64)

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

function uploadFileEvtQr(input) {
    var url = input.value;
    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
    if (input.files && input.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#img').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }else{
         $('#img').attr('src', '/assets/no_preview.png');
    }
}

function onLoadQRDoc(btn) {
    var id = btn.id
    var index = id.split('-')[1]
    console.log("globalResponse: "+globalResponse[index].filenom)

    const elements =  $("div.block");
    if(elements) elements.remove();

    var src = 'data:image/jpg;base64,'+ globalResponse[index].enbase64;
    var divContents = "<div class='block pt-2 mt-2'>" + 
    "<span id='' class='text-white text-xs font-bold uppercase rounded p-2 m-2' href = '#' >"+globalResponse[index].filenom+" &nbsp;&nbsp;" + 
    "<input type='checkbox' onchange='onChecked(this)'></span>" + 
    "<img class='mb-2 responsive' src='"+src+"' alt='bordereau' width='500px' ></img>" + 
    "</div>";
    currentChildren2.append(divContents);

    // Fill properties
    $("#testlist").val("RETESP")
    $("#user").val("FOFO");
    $("#ncp").val("05957051051-68");
    $("#amount").val("25000000");
    $("#ref").val("334102");
    $("#age").val("00001");
  //  $("#date").val("11/10/2022");
    document.getElementById("date").value = "2022-11-10";
    
}

function onSupp(btn) {
  var id = btn.id
  var index = id.replace("btnOne-","")
  console.log("globalResponse: "+globalResponse[index].filenom)
  alert("onSupp: "+globalResponse[index].filenom);
  
}

function onUpdate(btn) {
  var id = btn.id // recupere l'id de l'element courant (btnOne-i)
  var index = id.split('-')[1]
  console.log("globalResponse: "+globalResponse[index].filenom)
  alert("onUpdate: "+globalResponse[index].filenom);
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
     }
    }

   
    

    ipc.once('actionReply', async function(event, response){
       console.log("Response: ",JSON.stringify(response))
      
       if (response.length === 0) {
          alert('Aucun document à numeriser.');
          return;
       }

       globalResponse = response;

       var nn = globalResponse.length;
       var lastFilesRetrieved = globalResponse[nn-1]
       var fileDisplayed = lastFilesRetrieved[lastFilesRetrieved.length-1]
/*       
       for (let i = 0; i < response.length; i++) {
          
          var src = 'data:image/jpg;base64,'+ response[i].enbase64;
          var divContents = "<div id='block-" + i + "' class='block pt-2 mt-2'>" + 
          "<span id='' class='text-white text-xs font-bold uppercase rounded p-2 m-2' href = '#' >"+response[i].filenom+" &nbsp;&nbsp;" + 
          "<input type='checkbox' onchange='onChecked(this)'></span>" + 
          "<img class='mb-2 responsive' src='"+src+"' alt='bordereau' width='500px' ></img>" + 
          "</div>";
          currentChildren2.append(divContents);
       }
*/
       if (response.length > 0) {
          var src = 'data:image/jpg;base64,'+ response[response.length-1].enbase64;
          var divContents = "<div class='block pt-2 mt-2'>" + 
          "<span id='' class='text-white text-xs font-bold uppercase rounded p-2 m-2' href = '#' >"+response[response.length-1].filenom+" &nbsp;&nbsp;" + 
          "<input type='checkbox' onchange='onChecked(this)'></span>" + 
          "<img class='mb-2 responsive' src='"+src+"' alt='bordereau' width='500px' ></img>" + 
          "</div>";
          currentChildren2.append(divContents);
       }

       let currentProcess = $('#process');
       for (let j = 0; j < globalResponse.length; j++) {
           var internData = globalResponse[j];
           currentProcess.append("<button type='button' id='btn-" + j + "' onclick='onLoadQRDoc(this);' class='bg-blueGray-200  border-blueGray-500 text-black text-xs btn_num rounded mr-2  m-1'>"+internData[internData.length-1].filenom+"</button>")
           currentProcess.append("<button type='button' class='mr-2' id='btnOne-" + j + "' title='Supprimer ce dossier.' onclick='onSupp(this);' ><i class='fa fa-times-circle' style='font-size:24px;color:red'></i></button>")
           currentProcess.append("<button type='button' class='mr-2' id='btnTwo-" + j + "' title='Valider les Proprietés.' onclick ='onUpdate(this);'><i class='fa fa-check-circle' style='font-size:24px;color:green'></i></button>")
       }
      // var blob = response[0];
    /*
      blob = response
      var convBlobBase64 = (blob) => new Promise((resolve, reject) => {
        const reader = new FileReader;
        reader.onerror = reject;
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      });
      const base64String = await convBlobBase64(blob);
      */
      //console.log("EXTRACT base64String: "+base64String);
  //     document.getElementById('img').src = 'data:image/jpg;base64,'+response;
       //alert('Une erreur a été rencontrée. Consultez le terminal pour plus de détails.');
    })
    ipc.send('loadScanFile','Bonjour Electron depuis AFB');
});