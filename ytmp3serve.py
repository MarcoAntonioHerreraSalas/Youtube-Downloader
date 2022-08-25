
import requests as rqst
import numpy as np
from bs4 import BeautifulSoup as bs
import json
from flask import Flask, redirect, url_for,request
import flask
from flask_cors import CORS
from pytube import YouTube
import os
from firebase import firebase

def find_between( s, first, last ):
    try:
        start = s.index( first ) + len( first )
        end = s.index( last, start )
        return s[start:end]
    except ValueError:
        return ""

app = Flask(__name__)
CORS(app)

@app.route('/backendYT/<artista>')
def backendYT(artista):
    url = "https://www.youtube.com/results?search_query="+artista

    web = rqst.get(url)

    #soup = bs(web.text,"html.parser")
    jsonData = json.loads(find_between( web.text, 'var ytInitialData =', ';</script>' ))

    elements = jsonData["contents"]["twoColumnSearchResultsRenderer"]["primaryContents"]["sectionListRenderer"]["contents"][0]["itemSectionRenderer"]["contents"]
    response = []

    for element in elements:
        if('videoRenderer' in element.keys()):
            imagenMovimiento = None
            if('richThumbnail' in element['videoRenderer'].keys()):
                imagenMovimiento = element['videoRenderer']['richThumbnail']['movingThumbnailRenderer']['movingThumbnailDetails']['thumbnails'][0]
            
            publishedTimeText = None
            if('publishedTimeText' in element['videoRenderer'].keys()):
                publishedTimeText =element['videoRenderer']['publishedTimeText']["simpleText"]

            duracion = None
            if('lengthText' in element['videoRenderer'].keys()):
                duracion = element['videoRenderer']['lengthText']["simpleText"]

            visualizaciones = None
            if('simpleText' in element['videoRenderer']['viewCountText'].keys()):
                visualizaciones = element['videoRenderer']['viewCountText']["simpleText"]

            datos = {
                'url': element['videoRenderer']['navigationEndpoint']['commandMetadata']['webCommandMetadata']['url'],
                'imagen': element['videoRenderer']['thumbnail']['thumbnails'][0],
                'imagenMovimiento': imagenMovimiento,
                'titulo': element['videoRenderer']['title']['runs'][0]["text"],
                'tiempo': publishedTimeText,
                'duracion': duracion ,
                'visualizaciones': visualizaciones ,
                'nombreCanal': element['videoRenderer']['ownerText']['runs'][0],
                'imagenCanal': element['videoRenderer']['channelThumbnailSupportedRenderers']['channelThumbnailWithLinkRenderer']['thumbnail']['thumbnails'][0],
            }
            
            response.append(datos)

    
    return flask.jsonify(response)




dataDownload= {
    'id': None,
    'DownloadProgress': None,
    'TotalSize':None,
    'Downloaded': None,
    'Remaining': None,
    'idParent': None,
    'title': None,
}

def setDataDownloadNull():
    dataDownload["DownloadProgress"] = None
    dataDownload["TotalSize"] = None
    dataDownload["Downloaded"] = None
    dataDownload["Remaining"] = None
    dataDownload["id"] = None
    dataDownload["idParent"] = None
    dataDownload["title"] = None

dataArr = []
fire = firebase.FirebaseApplication("https://yt-mp3-2c155-default-rtdb.firebaseio.com/", None)

def on_progress(vid, chunk,bytes_remaining):
    total_size = vid.filesize
    bytes_downloaded = total_size - bytes_remaining
    percentage_of_completion = bytes_downloaded / total_size * 100
    totalsz = (total_size/1024)/1024
    totalsz = round(totalsz,1)
    remain = (bytes_remaining / 1024) / 1024
    remain = round(remain, 1)
    dwnd = (bytes_downloaded / 1024) / 1024
    dwnd = round(dwnd, 1)
    percentage_of_completion = round(percentage_of_completion,2)
    
    dataDownload["DownloadProgress"] = percentage_of_completion
    dataDownload["TotalSize"] = totalsz
    dataDownload["Downloaded"] = dwnd
    dataDownload["Remaining"] = remain

    if(dataDownload["idParent"] == None):
        res = fire.post('https://yt-mp3-2c155-default-rtdb.firebaseio.com/',dataDownload)
        dataDownload["idParent"] = res['name']
    else:
        upt = fire.put('https://yt-mp3-2c155-default-rtdb.firebaseio.com/'+dataDownload["idParent"],'DownloadProgress',percentage_of_completion)
        upt = fire.put('https://yt-mp3-2c155-default-rtdb.firebaseio.com/'+dataDownload["idParent"],'TotalSize',percentage_of_completion)
        upt = fire.put('https://yt-mp3-2c155-default-rtdb.firebaseio.com/'+dataDownload["idParent"],'Downloaded',percentage_of_completion)
        upt = fire.put('https://yt-mp3-2c155-default-rtdb.firebaseio.com/'+dataDownload["idParent"],'Remaining',percentage_of_completion)


@app.route('/backendDownloadMp3', methods = [ 'POST'])
def backendDownloadMp3():
    url = request.form['url']
    type_d = request.form['type']

    destination = 'C:\\Users\okero\Downloads'

    dataDownload["id"] = url

    yt = YouTube(str(url))
    yt.register_on_progress_callback(on_progress)
    dataDownload["title"] = yt.title

    if(type_d == "MP3"):
        video = yt.streams.filter(only_audio=True).first()
        out_file = video.download(output_path=destination)
        base, ext = os.path.splitext(out_file)
        new_file = base + '.mp3'
        os.rename(out_file, new_file)
    else:
        stream = yt.streams.get_by_itag(type_d)
        stream.download(output_path=destination)

    setDataDownloadNull()
    
    return 'OK'

if __name__ == "__main__":
    app.run("localhost", 6969)

