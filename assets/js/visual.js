const moment = require('moment');
const fs = require('fs');
const path = require('path');
const simpleFormat = 'YYMMDDHHmmssSSSS'; 

function retrieveAlfrecoDocument() {
    var alfrescoPath = "C://numarch/alfresco"
    
    var indexedDir = fs.readdirSync(alfrescoPath);
   
    var file
    var content
    var loadData
/*
    fs.readdir(alfrescoPath, async function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 

        files.forEach( file => {
           
            var TR, TD1, TD2, TD3, TD4, txt1, txt2, txt3, txt4
            content = fs.readFileSync(path.join(alfrescoPath, file), {encoding:'utf8', flag:'r'});
            loadData = JSON.parse(content); //now it an object
            for(let i=0;i<loadData.length;i++){

                TR = document.createElement("tr");
                TD1= document.createElement("td");
                TD2= document.createElement("td");
                TD3= document.createElement("td");
                TD4= document.createElement("td");
                txt1 = document.createTextNode(loadData[i].filename.replace('tmp_', ''));
                txt2 = document.createTextNode("");
                var date = loadData[i].filename.split('_')
                if (date !== undefined) {
                    var myMomentObject = moment(date[1], simpleFormat)
                    console.log("Alfresco myMomentObject: ",myMomentObject.format('DD-MMM-YYYY'));
                    txt2 = document.createTextNode(myMomentObject.format('DD-MMM-YYYY'));
                
                }
                
        
                txt3 = document.createElement("SPAN");
                txt3.style.color = "green"
                var t = document.createTextNode("Success");
                txt3.appendChild(t);
            
                var a = document.createElement('a');
                a.target = '_blank';
                a.href = loadData[i].lien !== undefined ? loadData[i].lien : '#';
                a.innerText = 'Voir dans alfresco';
                txt4 = document.createTextNode(a);
        
        
                TD1.appendChild(txt1);
                TD2.appendChild(txt2);
                TD3.append(txt3);
                TD4.appendChild(txt4);
                
        
                TR.appendChild(TD1);
                TR.appendChild(TD2);
                TR.appendChild(TD3);
                TR.appendChild(TD4);
        
                document.getElementById('alfresco').appendChild(TR);
            }

        });
    });
   */
    indexedDir = indexedDir.filter(f => !fs.statSync(path.join(alfrescoPath,f)).isDirectory())
    for (var ii = 0; ii < indexedDir.length; ii++) {
        file = indexedDir[ii]
        console.log(alfrescoPath + " - " + file)
        
        content = fs.readFileSync(path.join(alfrescoPath, file), {encoding:'utf8', flag:'r'});

        loadData = JSON.parse(content); //now it an object
        for(let i=0;i<loadData.length;i++){

            let TR = document.createElement("tr");
            let TD1= document.createElement("td");
            let TD2= document.createElement("td");
            let TD3= document.createElement("td");
            let TD4= document.createElement("td");
            let txt1 = document.createTextNode(loadData[i].filename.replace('tmp_', ''));
            let txt2 = document.createTextNode("");
            var date = loadData[i].filename.split('_')
            if (date !== undefined) {
                var myMomentObject = moment(date[1], simpleFormat)
                console.log("Alfresco myMomentObject: ",myMomentObject.format('DD-MMM-YYYY'));
                txt2 = document.createTextNode(myMomentObject.format('DD-MMM-YYYY'));
            
            }
            
    
            let txt3 = document.createElement("SPAN");
            txt3.style.color = "green"
            var t = document.createTextNode("Success");
            txt3.appendChild(t);
           
            var el3 = "<span style='color: green;' >Test<i class='fa fa-check'></i></span>"
            var el4 = "<span  style='color: red;' ><i class='fa fa-times'></i></span>"
    
            var a = document.createElement('a');
            a.target = '_blank';
            a.href = loadData[i].lien !== undefined ? loadData[i].lien : '#';
            a.innerText = 'Voir dans alfresco';
     
       
            let txt4 = document.createTextNode(a);
    
    
            TD1.appendChild(txt1);
            TD2.appendChild(txt2);
            TD3.append(txt3);
        
           
          //  TD4.appendChild(a);
            TD4.appendChild(txt4);
            
    
            TR.appendChild(TD1);
            TR.appendChild(TD2);
            TR.appendChild(TD3);
            TR.appendChild(TD4);
    
            document.getElementById('alfresco').appendChild(TR);
    
        }
    }
    
}
retrieveAlfrecoDocument()

function addlinesTable_pari(value, multi){
	
	for(let i=0;i<loadData.length;i++){

        let TR = document.createElement("tr");
        let TD1= document.createElement("td");
        let TD2= document.createElement("td");
        let TD3= document.createElement("td");
        let TD4= document.createElement("td");
        let txt1 = document.createTextNode(loadData[i].filename);
        let txt2 = document.createTextNode("");
        var date = loadData[i].filename.split('_')
        if (date !== undefined) {
            var myMomentObject = moment(date[1], simpleFormat)
            console.log("Alfresco myMomentObject: ",myMomentObject.format('DD-MMM-YYYY'));
            txt2 = document.createTextNode(myMomentObject.format('DD-MMM-YYYY'));
        
        }
        
        let txt3 = document.createTextNode("");
        //let txt4 = '<tr><td class="col-xs-3"><a href="#"></a></td></tr>';
        let txt4 = loadData[i].lien


        TD1.appendChild(txt1);
        TD2.appendChild(txt2);
        TD3.appendChild(txt3);
        TD4.appendChild(txt4);
        

        TR.appendChild(TD1);
        TR.appendChild(TD2);
        TR.appendChild(TD3);
        TR.appendChild(TD4);

            document.getElementById('alfresco').appendChild(TR);
        //	$('.t_pari').find('tbody').append(txt4);
            //$('.prono').appendChild(TR);
        //	$(TD1).addClass('col-xs-3');
            //$(TD1).toggleClass('col-xs-3', true);
        //	$(TD2).toggleClass('col-xs-3', true);
        //	$(TD3).toggleClass('col-xs-3', true);
        //	$(TD4).toggleClass('col-xs-3', true);
    }
} 