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

export  {getVideosFirebase,removeVideo};