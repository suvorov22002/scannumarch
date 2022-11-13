
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

function uploadFileEvtQr1(input) {
  var url = input.value;
  var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();

  if (input.files) {
     console.log(JSON.stringify(input.files))
    /*  
     var reader = new FileReader();
      reader.onload = function (e) {
          $('#img').attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]);

*/
      Array.from(input.files).forEach((element) => {

        const reader = new FileReader();

        reader.onload = (e) => {
          
          var imgBase64Path;
          imgBase64Path = '';
          const lastDot = element.name.lastIndexOf('.');
          var fileNom = element.name.substring(0, lastDot);
          imgBase64Path = e.target.result;

          var idx = fileNom.split('-')[1];
         

        //  fileNom = 'image-'+this.formatFileNom(idx);
          console.log("fileNom: " + element.name);

          try {
            const data = fs.readFileSync(element, 'utf8');
            console.log(data);
          } catch (err) {
            console.error(err);
          }

        };
        reader.readAsDataURL(element);

       // this.fileInput.nativeElement.value = "";
       
      });
  }
}

const ipc = require('electron').ipcRenderer

const asyncMsgBtn = document.getElementById('fileselect')

asyncMsgBtn.addEventListener('click', () => {

    ipc.once('actionReply', function(event, response){
       console.log("Response: ",JSON.stringify(response))
    //   document.getElementById('image').src = 'data:image/jpg;base64,'+response[1];
       alert('Une erreur a été rencontrée. Consultez le terminal pour plus de détails.');
    })
    ipc.send('loadScanFile','Bonjour Electron depuis AFB');
});