from pytube import YouTube
from firebase import firebase
import os

#create a class to trow multiple files and new instances
class Download:

    #data download
    dataDownload= {
        'id': None,
        'DownloadProgress': None,
        'TotalSize':None,
        'Downloaded': None,
        'Remaining': None,
        'idParent': None,
        'title': None,
    }

    #setAll data downloaded
    def setDataDownloadNull(self):
        self.dataDownload["DownloadProgress"] = None
        self.dataDownload["TotalSize"] = None
        self.dataDownload["Downloaded"] = None
        self.dataDownload["Remaining"] = None
        self.dataDownload["id"] = None
        self.dataDownload["idParent"] = None
        self.dataDownload["title"] = None

    dataArr = []
    fire = firebase.FirebaseApplication("https://yt-mp3-2c155-default-rtdb.firebaseio.com/", None)


    #here is the update bar progress with firebase
    def on_progress(self,vid, chunk,bytes_remaining):
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

        self.dataDownload["DownloadProgress"] = percentage_of_completion
        self.dataDownload["TotalSize"] = totalsz
        self.dataDownload["Downloaded"] = dwnd
        self.dataDownload["Remaining"] = remain

        if(self.dataDownload["idParent"] == None):
            res = self.fire.post('https://yt-mp3-2c155-default-rtdb.firebaseio.com/',self.dataDownload)
            self.dataDownload["idParent"] = res['name']
        else:
            upt = self.fire.put('https://yt-mp3-2c155-default-rtdb.firebaseio.com/'+self.dataDownload["idParent"],'DownloadProgress',percentage_of_completion)
            upt = self.fire.put('https://yt-mp3-2c155-default-rtdb.firebaseio.com/'+self.dataDownload["idParent"],'TotalSize',percentage_of_completion)
            upt = self.fire.put('https://yt-mp3-2c155-default-rtdb.firebaseio.com/'+self.dataDownload["idParent"],'Downloaded',percentage_of_completion)
            upt = self.fire.put('https://yt-mp3-2c155-default-rtdb.firebaseio.com/'+self.dataDownload["idParent"],'Remaining',percentage_of_completion)

    #save this file on destination
    def DownloadMp3(self,url,type_d):
        url = url
        type_d = type_d

        destination = 'C:\\Users\okero\Downloads'

        self.dataDownload["id"] = url

        yt = YouTube(str(url))
        yt.register_on_progress_callback(self.on_progress)
        self.dataDownload["title"] = yt.title

        if(type_d == "MP3"):
            video = yt.streams.filter(only_audio=True).first()
            out_file = video.download(output_path=destination)
            base, ext = os.path.splitext(out_file)
            new_file = base + '.mp3'
            os.rename(out_file, new_file)
        else:
            stream = yt.streams.get_by_itag(type_d)
            stream.download(output_path=destination)

        self.setDataDownloadNull()

        return 'OK'