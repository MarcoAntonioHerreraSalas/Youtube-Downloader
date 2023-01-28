import axios from "axios";
import Swal from 'sweetalert2'
import React from "react";
import { initializeApp } from "firebase/app";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dropdown from 'react-bootstrap/Dropdown';
import  './Video.css';

const notify = (message) => toast(message);

function download(element,handleClickDownload,type){
    var randomId = Math.floor(Math.random() * 99999999999);
    const data = {"id": randomId,"url":'https://www.youtube.com/'+element.url,"type_d":type,'title': element.titulo,
    "estatus" : {'DownloadProgress': 0,'TotalSize':0,'Downloaded': 0,'Remaining': 0}};

    handleClickDownload(data,"add")

    var config = {method: 'post',url: 'http://localhost:6969/backendDownloadMp3',data : data};
    // var el = document.getElementById(randomId);
    axios(config)
    .then((response) => {
        notify( 'Descarga Completa: '+ element.titulo);
    }, (error) => {
        notify( 'Error de Descarga con: '+element.titulo+'intenté con otro video');
        handleClickDownload(data,"remove")
        Swal.close()
      });
    
}

function Video(props){
   const e = props.element;
    return(
      
        <div className='row p-4 justify-content-md-center' key={e.title} >
          <ToastContainer  position="top-left" autoClose={1000} hideProgressBar={true}/>
          
          <div className='col-lg-4 col-md-4 col-sm-3 d-flex  justify-content-center'  >
            <div className="imagen-box">
              <img className='' src={e.imagen.url } width="360px"  alt={e.titulo}></img>
              <div className="duracion"  >{e.duracion}</div>

            </div>
          </div>
          <div className='col-md-6 downText'  >
            <h3 className='text-left titleYT' >{e.titulo}</h3>
            <div className='row'>
              <div className='col-10 left' >
                <img className="rounded-circle" height="20px" width="20px" src={e.imagenCanal.url} alt={e.nombreCanal.text}></img>
                <span   className="text-secondary canalText" >&nbsp;&nbsp;&nbsp;{e.nombreCanal.text}</span>
              </div>
            </div>
            <div className='row mt-3 text-secondary visTime'>
              <div className='col-6 left' ><span >{e.visualizaciones}</span> </div>
              <div className='col-4 right' ><span  >{e.tiempo}</span></div>
            </div>
            <div className='row mt-4'></div>
            <div className='row'>
              <div className="mt-5 btn-group botones">

                <button  className="btn btn-danger" type="button" onClick={event => 
                    download(e,props.handleClickDownload,"MP3")
                }>MP3</button>
                &nbsp;
                <Dropdown>
                  <Dropdown.Toggle variant="danger" id="dropdown-basic"> Video</Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item  onClick={event => download(e,props.handleClickDownload,18)}>
                      360P (.mp4)
                    </Dropdown.Item>
                    <Dropdown.Item onClick={event => download(e,props.handleClickDownload,22)}>
                      480p (.mp4)
                    </Dropdown.Item>
                    <Dropdown.Item onClick={event => download(e,props.handleClickDownload,137)}>
                      1080p (.mp4)
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            

          </div>
              
        </div>
    )
}

export default Video;