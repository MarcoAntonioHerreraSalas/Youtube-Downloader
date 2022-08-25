import { getDatabase,ref, onValue,remove } from "firebase/database";


function getVideosFirebase(database){
    const starCountRef = ref(database, `/`);
    const arrayData = []
    onValue(starCountRef, (snapshot) => {
        var json = snapshot.val();
        
        for (var field in json) {
            arrayData.push({"key":field,"data":json[field]});
        }
       
    });

    return arrayData;
}

function updateBarProgress(json){
    if(json.length === 0){return false;}

    json.forEach(element => {
        var url = element.data.id;
        url = url.replace('https://www.youtube.com/','');
        var progress = element.data.DownloadProgress;
        if(progress <= 100){
            var el = document.getElementById(url,'');
            if(el !== null){
              el.firstChild.setAttribute('aria-valuenow',progress)
              el.firstChild.style.width = progress+"%";
              el.firstChild.innerHTML = progress+"%"
            }
        }
    });
    // for (var field in json) {
    //     var key = field;
    //     var url = json[key]["id"];

    //     if(url !== undefined){
    //       url = url.replace('https://www.youtube.com/','');

    //       var progress =  json[key]["DownloadProgress"];
    //       if(progress <= 100){
    //         var el = document.getElementById(url,'');
    //         if(el !== null){
    //           el.firstChild.setAttribute('aria-valuenow',progress)
    //           el.firstChild.style.width = progress+"%";
    //           el.firstChild.innerHTML = progress+"%"
    //         }


    //       }
          

    //     }

    // }
}

function removeVideo(json,item,database){
    if(json.length === 0){return false;}
    json.forEach(element => {
        var url = element.data.id;
        url = url.replace('https://www.youtube.com/','');
        if(url === item){
            remove(ref(database, `/${element.key}`));
        }
    });
    
}

export  {getVideosFirebase,updateBarProgress,removeVideo};