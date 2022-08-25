import axios from "axios";
import Swal from 'sweetalert2'
import randomArtist from './randomArtist';

function SearchYT({handleClick}){
    var searchInput = document.getElementById("searchInput").value;
    if(searchInput===""|| searchInput ===null){
        var rand = Math.floor(Math.random() * randomArtist.length);
        searchInput = randomArtist[rand];
    }

    // Swal.fire({
    //     position: 'top-center',
    //     icon: 'info',
    //     title: 'Cargando...',
    //     showConfirmButton: false,
    //     timer: 1500
    // })

    var randGifs = Math.floor(Math.random() * 11);
    Swal.fire({
        title: 'Cargando...',
        width: 400,
        color: '#F0150A',
        position:"bottom-end",
        showConfirmButton:false,
        backdrop: `
          rgba(240, 21, 10,0.2)
          url("/assets/gifs/`+randGifs+`.gif")
          left top
          no-repeat
        `
      })

    // Swal.fire('Please wait')
    // Swal.showLoading()

    //axios.get('http://localhost:5000/express_backend?search_query='+searchInput.replace(/_/g,'+') )
    axios.get('http://localhost:6969/backendYT/'+searchInput.replace(/_/g,'+') )
    .then((response) => {
        handleClick(response.data)

        Swal.close()
    }, (error) => {
        console.log(error);
        Swal.close()
      });

}

export default SearchYT;