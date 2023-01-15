
import requests as rqst
import numpy as np
from bs4 import BeautifulSoup as bs
import json
from flask import Flask, redirect, url_for,request
import flask
from flask_cors import CORS
from download import Download

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
    url = request.form['url']
    type_d = request.form['type']
    dwn = Download()
    dwn.DownloadMp3(url,type_d)
    
    return 'OK'

if __name__ == "__main__":
    app.run("localhost", 6969)

