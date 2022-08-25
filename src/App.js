import './App.css';
import Search from './Components/Search';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState,useEffect} from 'react';
import Video from './Components/Video'
import React from "react";
import { initializeApp } from "firebase/app";
import { getDatabase,ref, onValue,remove } from "firebase/database";
import ProgressBar from 'react-bootstrap/ProgressBar';
import firebaseConfig from './firebaseConf';
import {getVideosFirebase,updateBarProgress,removeVideo} from './firebaseModel';
import SearchYT from './searchRequest.js'


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const Bars = (data) => {
  return <ProgressBar id={data.data} variant="success" key={2}  now={0} label={`${0}%`} />;

};

function App() {
  const [searchValue, setSearchValue] = useState([]);
  const [dataDownload, setdataDownload] = useState([]);

  const interval = setInterval(() => {

    if(dataDownload.length > 0){

      const json = getVideosFirebase(database);
      updateBarProgress(json);
    }
  
  }, 500);

  const handleClick = val => {
    setSearchValue(val);
  };


  const handleClickDownload = (val,type) => {
    if(type === "remove"){
      const newData = dataDownload.filter((x) => x !== val );
      setdataDownload(newData);
      const getVideos = getVideosFirebase(database);
      removeVideo(getVideos,val,database);
    }else{
      setdataDownload([...dataDownload, val]);
    }
  };


  useEffect(() => {
    SearchYT({handleClick})
  }, []);
  


  return (
    
    <div className="App" >
      

      {dataDownload.length > 0 ?
      <div id="flotante" className='shadow-lg p-3 mb-5 rounded' >
        <span className='text-success'>Files Downloaded</span>
        {

          dataDownload.map(function(e, i){
            return (
              <div>
                <span className='small titleFileDwn'>{
                  searchValue.filter((x) => e === x.url)[0].titulo
    
                }</span>
                <Bars key={i} data={e}></Bars>
              </div>
              )
          })
        }
      </div>
      :''}


      <Search handleClick={handleClick}/>

      <div  className='row justify-content-md-center'>
        <div className='col-lg-11 col-md-9' >
          {
              searchValue.map(function(e, i){
                return <Video element={e}  key={i} handleClickDownload={handleClickDownload}/>
	            })

          }
          
        </div>
      </div>
      

    </div>
  );
}

export default App;

