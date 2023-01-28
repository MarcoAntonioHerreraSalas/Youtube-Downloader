export default function updateBarProgress(json){
    if(json.length > 0){

        json.forEach(element => {
            var progress = element.estatus.DownloadProgress;
            if(progress <= 100){
                var el = document.getElementById("div"+element.id);
                if(el !== null){
                    el.lastChild.firstChild.setAttribute('aria-valuenow',progress);
                    el.lastChild.firstChild.style.width = progress+"%";
                    el.lastChild.firstChild.innerHTML = progress+"%";
                }
            }
        });
    }


}
