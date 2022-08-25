const express = require('express'); 
const puppeteer = require('puppeteer');
var cors = require('cors');
var opn = require('opn');
const app = express();
const port = process.env.PORT || 5000;

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6
app.use(cors({origin: 'http://localhost:3000'}));
// create a GET route
app.get('/express_backend', async (req, res) => { //Line 9
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    const artista = req.query.search_query;
  
    console.log("Lista musical de "+artista);
    const browser = await puppeteer.launch({handless:false});
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto("https://www.youtube.com/results?search_query="+artista+'+lyrics')
    await delay(7000);
    await page.screenshot({path:'prueba.png'})
    await page.waitForSelector('ytd-video-renderer');
    const elements = await page.$$('ytd-video-renderer');
    const data = [];

    for (let i = 0; i < elements.length; i++) {
    //await elements[i].hover();
    //await page.waitForSelector(elements[i])

    data.push(

        await page.evaluate(element => 

            
            ({
            
                img: element.querySelector("#thumbnail > yt-img-shadow > #img").getAttribute('src'),
                href: element.querySelector("#video-title").getAttribute('href'),
                title: element.querySelector("#video-title").getAttribute('title'),
                imgAnimate: element.querySelector("#mouseover-overlay").querySelector("#thumbnail") == null?'':element.querySelector("#mouseover-overlay").querySelector("#thumbnail").getAttribute('class') ,
                visitas: element.querySelector("#metadata-line").querySelectorAll("span")[0]== null?'1 Vista':element.querySelector("#metadata-line").querySelectorAll("span")[0].textContent,
                tiempo: element.querySelector("#metadata-line").querySelectorAll("span")[1]== null?'1 Mes':element.querySelector("#metadata-line").querySelectorAll("span")[1].textContent,
                duracion: element.querySelector("#overlays").querySelector("#text") == null?'0:00':element.querySelector("#overlays").querySelector("#text").textContent
                // textContent
            }) 
        
    , elements[i]));
    }


    await page.goto("https://images.google.com/")
    await delay(1000);

    await page.waitForSelector('input[name=q]');
    page.screenshot({path:"imagen.png"})
    //await page.$eval('input[name=q]', el => el.value = 'Julion Alvarez');
    await page.$eval('input[name=q]', (el, value) => el.value = value, artista);
    await page.click('button[type="submit"]');

    await page.waitForSelector('#islrg > div.islrc');

    // const imgAllEmpty = await page.evaluate(() => {
    //     //#islrg > div.islrc > div:nth-child(2) > a.wXeWr.islib.nfEiy > div.bRMDJf.islir > img
    //     const imgEle = document.querySelector('#islrg > div.islrc > div:nth-child(2) > a.wXeWr.islib.nfEiy > div.bRMDJf.islir > img')
    //     return imgEle.getAttribute("src");
    // });

    const imagenes = await page.$$('.rg_i.Q4LuWd');
    const imgAllRandomEmpty = [];

    for (let i = 0; i < imagenes.length; i++) {

        imgAllRandomEmpty.push(await page.evaluate(element => ( element.getAttribute('src') ) , imagenes[i]));
    }

    var filteredItems = imgAllRandomEmpty.filter( item  => item =! null);
    

    data.map((e) => {
        const rand = Math.floor(Math.random() * (filteredItems.length - 0) + 0);
        if(e.img == null){
            e.img = filteredItems[rand];   
        }
    })

    await browser.close();

    res.send(JSON.stringify(data)); //Line 10
}); //Line 11

// create a GET route
app.get('/downloadMp3', async (req, res) => { //Line 9
    const browser = await puppeteer.launch({handless:false});
    const page = await browser.newPage();
    const url = req.query.url;
    await page.goto("https://www.ytmp3.cc")
    await delay(2000);
    await page.type("#input","https://www.youtube.com/"+url);
   // await page.screenshot({path: "antes.png"});
    await page.click("#submit");
    await delay(2000);
    //await page.screenshot({path: "despues.png"});
    const urlDownload = await page.evaluate(() => {
        return document.querySelector("#download").getAttribute("href");
    })

    await browser.close();
    res.send(urlDownload); //Line 10
}); //Line 11

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }