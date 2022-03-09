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
    res.send(`
    <meta name="viewport" content="width=device-width, initial-scale=1">
<script src="https://code.jquery.com/jquery-latest.js"></script>

<script>
obr()
function isValidUrl(string) {
    if(string.includes("file")) {
        return true;
    } else {
        return false;
    }
};
function obr() {
    $.ajax({
        type: "POST",
        url: "/f",
        data: {
            a:1
        }
    }).done(function(r) {
        setTimeout(obr, 1000);
        if(r.includes(".mp4")) {
            if($('#info').html().includes(r) || $('#info').html().includes(encodeURIComponent(btoa(r)))) return;
            if(isValidUrl(r)) {
                $('#info').html(\`
                <video id="vid" width="100%" controls="none">
                 <source src="\`+r+\`" type='video/mp4'>
                </video>\`);
            } else {
                $('#info').html(\`
                <video id="vid"  width="100%" controls="none">
                 <source src="/static?p=\`+encodeURIComponent(btoa(r))+\`" type='video/mp4'>
                </video>\`);
            }
            document.getElementById("vid").play();
            document.getElementById("vid").addEventListener('ended', (event) => {
                document.getElementById("vid").play();
            })
        } else {
            if(isValidUrl(r)) {
                $('#info').html("<img style=\\"max-width:100%\\" src='"+r+"'>");
            } else {
                $('#info').html("<img style=\\"max-width:100%\\" src='/static?p="+encodeURIComponent(btoa(r))+"'>");
            }
        }
    });
}
</script>
<div id="info"></div>`)
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
