import './App.css';
import Search from './Components/Search';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState,useEffect} from 'react';
import Video from './Components/Video'
import React from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import updateBarProgress from  './Components/progress';
import SearchYT from './searchRequest.js'

const Bars = (data) => {
  return <ProgressBar id={data.data} variant="success" key={2}  now={0} label={`${0}%`} />;

};

function App() {
  const [searchValue, setSearchValue] = useState([]);
  const [dataDownload, setdataDownload] = useState([]);


  useEffect(() => {

      const serverBaseURL = "http://localhost:6969/downloadProgress";
      const sse = new EventSource(serverBaseURL);
      function handleStream(e){
        const data = JSON.parse(e.data);
        dataDownload.map((dw) => {dw.estatus = data.find(d => d.id == dw.id).estatus;})
        updateBarProgress(dataDownload);
        
        if(dataDownload.length > 0){
          var newData = dataDownload.filter((x) => x.estatus.DownloadProgress !== 100);
          setdataDownload(newData);
        }
        
      }
      sse.onmessage = e => {handleStream(e);}
      sse.onerror = e => {sse.close();}
      return () => {
        sse.close();
      };
  })


  const handleClick = val => {
    setSearchValue(val);
  };


  const handleClickDownload = (element,type) => {
    if(type === "remove"){
      const newData = dataDownload.filter((x) => x.id !== element.id );
      setdataDownload(newData);
    }else{
      setdataDownload([...dataDownload, element]);
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
              <div key={"div"+e.id} id={"div"+e.id}>
                <span key={"span"+e.id} className='small titleFileDwn'>{
                  e.title
                }</span>
                <Bars id={"idbar"+e.id} key={"bar"+e.id}  data={e.DownloadProgress}></Bars>
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

