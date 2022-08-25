import axios from "axios";
import Swal from 'sweetalert2'
import React from "react";

function downloadMp3(url){

    Swal.fire('Please wait')
    Swal.showLoading()

    axios.get('http://localhost:5000/downloadMp3?url='+url.replace(/_/g,'+') )
    .then((response) => {
        console.log(response);
        if(response.data === '' || response.data === null){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Se presento un problema con la descarga'
            })
        }else{

            const el = document.getElementById('directDownload');
            el.setAttribute("href",response.data);
            setTimeout(() => {
                el.click();
                Swal.close();
            }, 1000);
        }


    }, (error) => {
        console.log(error);
        Swal.close()
      });
}

function Video(element){
    const e = element.element;
    const styles = {
        titleYT:{
          textAlign:'left'
        },
        right:{textAlign:'right'},
        left:{textAlign:'left'},
        duracion:{
          position: 'absolute',
          bottom: '8px',
          right: '30px',
          backgroundColor:'black',
          fontSize:'20px'
        },
        image:{
          position: 'relative',
          color:'white',}
    }

    return(
        <div className='row p-2' >
              <div className='col-md-4 ' style={styles.image} >
                <img className='' src={e.img == null?'https://definicion.de/wp-content/uploads/2010/05/youtube.png':e.img} width="400px" height="224.41" alt={e.title}></img>
                <div style={styles.duracion}>{e.duracion}</div>
              </div>
              <div className='col-md-6 ' >
                <h3 className='text-left' style={styles.titleYT}>{e.title}</h3>
                <div className='row'>
                  <div className='col-6' style={styles.left}><span >{e.visitas}</span> </div>
                  <div className='col-4' style={styles.right}><span  >{e.tiempo}</span></div>
                </div>
                <div className='row mt-4'></div>
                <div className='row'>
                    <button  className="btn btn-danger mt-5" type="button" onClick={event => 
                        downloadMp3(e.href)
                    }>Descargar</button>
                </div>
                

              </div>
              
            </div>
    )
}

export default Video;