
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

function onLoadQRDoc(title, index) {
  
}

function onSupp(title) {

}

function onUpdate(title) {
  console.log("update ",title);
}

const ipc = require('electron').ipcRenderer

const asyncMsgBtn = document.getElementById('fileselect')

asyncMsgBtn.addEventListener('click', () => {

    ipc.once('actionReply', async function(event, response){
       //console.log("Response: ",JSON.stringify(response))
       let currentChildren2 = $('#visual');
       for (let i = 0; i < response.length; i++) {
          //console.log("Response: ",response[i].filenom)
          var src = 'data:image/jpg;base64,'+ response[i].enbase64;
          currentChildren2.append("<span id='anchor' class='text-white text-xs font-bold uppercase rounded p-2 m-2' href = '#' >"+response[i].filenom+" &nbsp;&nbsp;")
          currentChildren2.append("<input type='checkbox' onchange='onChecked(dataimage, $event)'></span>")
          currentChildren2.append("<img class='mb-2' src='"+src+"' width='500px' ></img>");
       }

       let currentProcess = $('#process');
       for (let j = 0; j < response.length; j++) {
           currentProcess.append("<button type='button' onclick='onLoadQRDoc(qrImage.title, index);' class='bg-blueGray-200  border-blueGray-500 text-black text-xs btn_num rounded mr-2  m-1'>"+response[j].filenom+"</button>")
           currentProcess.append("<button type='button' class='mr-2' id='btnOne' title='Supprimer ce dossier.' onclick='onSupp(qrImage.title);' ><i class='fa fa-times-circle' style='font-size:24px;color:red'></i></button>")
           currentProcess.append("<button type='button' class='mr-2' id='btnTwo' title='Valider les Proprietés.' onclick ='"+onUpdate(response[j].filenom)+";'><i class='fa fa-check-circle' style='font-size:24px;color:green'></i></button>")
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