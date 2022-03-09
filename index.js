const port = 8080; //Порт
let username = "nick"; //Ник без @
var video = "C:\\example.mp4"; //Начальное видео



//Подключение модулей
const { WebcastPushConnection } = require('tiktok-livestream-chat-connector');

const express = require('express')

const app = express();

const fs = require('fs');


const comments = JSON.parse(fs.readFileSync("comments.json", "utf-8"));




app.get('/static', function(req, res) {
    let ph = atob(req.query.p);
    res.sendFile(ph)
});

app.post('/f', function(req, res) {
    res.send(video)
});


app.get('/', function(req, res) {
    res.send(``)
});


const tiktok = new WebcastPushConnection(username);



tiktok.connect().then(state => {}).catch(err => {

    console.error('Error ' + username, err);

    console.log('Press ctrl + c')
        

   
})




tiktok.on('chat', data => {
    if (comments[data.comment].vid) video = comments[data.comment].vid;

    console.log(`${data.uniqueId} написал: ${data.comment}`);

})



tiktok.on('streamEnd', () => {
    console.clear();
    console.log("Стрим закончен +_+");
    console.log('Press Ctrl + C');
    
})


app.listen(port, () => {
    console.log("Порт | Сервер запущен на порту " + port)
    console.log("Создатель | Fexell")
})
