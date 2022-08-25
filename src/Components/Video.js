import axios from "axios";
import Swal from 'sweetalert2'
import React from "react";
import { initializeApp } from "firebase/app";
import { getDatabase,ref, onValue,remove } from "firebase/database";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import firebaseConfig from '../firebaseConf';
import Dropdown from 'react-bootstrap/Dropdown';
import  './Video.css';

const notify = (message) => toast(message);
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function download(url,handleClickDownload,type){
    handleClickDownload(url,"add")
    

    var FormData = require('form-data');
    var data = new FormData();
    data.append('url', 'https://www.youtube.com/'+url);
    data.append('type',type);

    var config = {
      method: 'post',
      url: 'http://localhost:6969/backendDownloadMp3',
      data : data
    };
    var el = document.getElementById(url);
    axios(config)
    .then((response) => {
        handleClickDownload(url,"remove")
        var el = document.getElementById(url);
        notify( 'Descarga Completa: '+ el.previousSibling.textContent);

    }, (error) => {
        
        var el = document.getElementById(url);
        notify( 'Error de Descarga intenté con otro video: '+ el.previousSibling.textContent);
        handleClickDownload(url,"remove")
        console.log(error);
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
                    download(e.url,props.handleClickDownload,"MP3")
                }>MP3</button>
                &nbsp;
                <Dropdown>
                  <Dropdown.Toggle variant="danger" id="dropdown-basic"> Video</Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item  onClick={event => download(e.url,props.handleClickDownload,18)}>
                      360P (.mp4)
                    </Dropdown.Item>
                    <Dropdown.Item onClick={event => download(e.url,props.handleClickDownload,22)}>
                      480p (.mp4)
                    </Dropdown.Item>
                    <Dropdown.Item onClick={event => download(e.url,props.handleClickDownload,137)}>
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