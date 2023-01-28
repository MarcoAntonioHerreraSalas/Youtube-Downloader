
import time
from itsdangerous import Serializer
import requests as rqst
import numpy as np
from bs4 import BeautifulSoup as bs
import json
from flask import Flask, Response, redirect, url_for,request, jsonify
import flask
from flask_cors import CORS
from pytube import YouTube
import os

music_list = []

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


@app.route('/backendDownloadMp3', methods = [ 'POST'])
def backendDownloadMp3():
    data = request.get_json()
    music_list.append(data)
    DownloadMp3(data["url"], data["type_d"])

    time.sleep(1)
    music_list.remove(data)
    return 'OK'



def on_progress(stream,chunk,bytes_remaining):
    total_size = stream.filesize
    bytes_downloaded = total_size - bytes_remaining
    percentage_of_completion = bytes_downloaded / total_size * 100
    totalsz = (total_size/1024)/1024
    totalsz = round(totalsz,1)
    remain = (bytes_remaining / 1024) / 1024
    remain = round(remain, 1)
    dwnd = (bytes_downloaded / 1024) / 1024
    dwnd = round(dwnd, 1)
    percentage_of_completion = round(percentage_of_completion,2)
    for i in music_list:
        if i['title'] == stream.title:
            i['estatus']["DownloadProgress"] = percentage_of_completion
            i['estatus']["TotalSize"] = totalsz
            i['estatus']["Downloaded"] = dwnd
            i['estatus']["Remaining"] = remain
            break

def on_complete(stream,file_path):
    total_size = stream.filesize
    for i in music_list:
        if i['title'] == stream.title:
            i['estatus']["DownloadProgress"] = 100
            i['estatus']["TotalSize"] = total_size
            i['estatus']["Downloaded"] = total_size
            i['estatus']["Remaining"] = 0
            break
    

def DownloadMp3(url,type_d):
    url = url
    type_d = type_d

    destination = 'C:\\Users\okero\Downloads'

    yt = YouTube(str(url))

    if(type_d == "MP3"):
        stream = yt.streams.filter(only_audio=True).first()
    else:
        stream = yt.streams.get_by_itag(type_d)

    for i in music_list:
        if i['url'] == url:
            i["title"] = stream.title
            break

    yt.register_on_progress_callback(on_progress)
    yt.register_on_complete_callback(on_complete)

    out_file = stream.download(output_path=destination)

    if(type_d == "MP3"):
        base, ext = os.path.splitext(out_file)
        new_file = base + '.mp3'
        os.rename(out_file, new_file)


@app.route('/downloadProgress')
def downloadProgress():
    def getData():
        while True:
            time.sleep(0.5)
            yield f'data: {json.dumps(music_list)} \n\n'
    return Response(getData(), mimetype="text/event-stream")


if __name__ == "__main__":
    app.run("localhost", 6969)

