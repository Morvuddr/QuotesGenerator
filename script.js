generateHTML();

function generateHTML() {
    var    canvas = document.createElement('canvas');
    var    save = document.createElement('button');
    var    body = document.getElementById('body');

    canvas.id = 'canvas';
    canvas.width = 600;
    canvas.height = 600;

    body.style.width = '100%';
    body.style.display = 'flex';
    body.style.flexDirection = 'column';
    body.style.alignItems = 'center';

    save.id = 'save';
    save.innerHTML = 'Save image';
    save.style.backgroundColor = 'red';
    save.style.border = 'none';
    save.style.color = 'white';
    save.style.padding = '10px 25px';
    save.style.fontSize = '20px';
    save.style.visibility = 'hidden';
    save.onclick =
        function () {
            var canv = document.getElementById('canvas');
            var dataURL = canv.toDataURL("image/jpg");
            var link = document.createElement("a");
            link.href = dataURL;
            link.download = "quote.jpg";
            link.click();
        };

    body.appendChild(canvas);
    body.appendChild(save);
}

var quote;
var imgs;
var countLoadImgs;

quote = null;
imgs = new Array();
countLoadImgs = 0;
getImgs();

function getImgs() {
    for (var i = 0; i < 4; i++) {
        imgs[i] = new Image();
        imgs[i].crossOrigin = "anonymous";
        r = (i + 4) * 100
        imgs[i].src = 'https://source.unsplash.com/' + r + 'x' + r + '/?dog';
        imgs[i].onload = function () {
            countLoadImgs++;
            // When all the pictures are loaded, the method is called to draw them
            if (countLoadImgs == 4) {
                drawImgs();
              }
        }
    }
}

function drawImgs() {
        drawImg(imgs[0], 0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight, 0, 0, 300, 300);
        drawImg(imgs[1], 0, 0, imgs[1].naturalWidth, imgs[1].naturalHeight, 300, 0, 300, 300);
        drawImg(imgs[2], 0, 0, imgs[2].naturalWidth, imgs[2].naturalHeight, 0, 300, 300, 300);
        drawImg(imgs[3], 0, 0, imgs[3].naturalWidth, imgs[3].naturalHeight, 300, 300, 300, 300);
        //Blackout
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(0, 0, 600, 600);
        // After drawing all the pictures, the method of getting a quote is called
        getQuote();
}

function drawImg(img, sx, sy, swidth, sheight, x, y, width, height) {
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
}

async function getQuote() {
    var http = new XMLHttpRequest;
    http.open("GET", "https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=json&lang=ru", true);
    http.send();
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            quote = JSON.parse(http.responseText)['quoteText'];
            drawQuote();
        }
    }
}

function drawQuote() {
    var context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.font = "italic 22pt Arial";
    context.textAlign = "center";
    cutQuote(context, quote, canvas.width / 2, (canvas.height / 2 + 11), 550, 40);
    save.style.visibility = 'visible';
}

function cutQuote(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(" ");
    var countWords = words.length;
    var line = "";
    var countRaws = Math.floor(context.measureText(text).width / 550);

    y -= (countRaws / 2) * lineHeight;
    for (var n = 0; n < countWords; n++) {
        var testLine = line + words[n] + " ";
        var testWidth = context.measureText(testLine).width;

        if (testWidth > maxWidth) {
            context.fillText(line, x, y);
            line = words[n] + " ";
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}