generateHTML();

var
    quote,
    imgs,
    countLoadImgs,
    countDrawImgs,
    canv;

quote = null;
imgs = new Array();
countLoadImgs = 0;
countDrawImgs = 0;
canv = document.getElementById('canvas');
canv.width = 600;
canv.height = 600;
getImgs();
drawImgs();
getQuote();
drawQuote();

function getQuote() {
    var http = new XMLHttpRequest;
    http.open("GET", "https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=json&lang=ru", true);
    http.send();
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            quote = JSON.parse(http.responseText)['quoteText'];
        }
    }
}

function cutQuote(context, text, x, y, maxWidth, lineHeight) {
    var
        words = text.split(" "),
        countWords = words.length,
        line = "",
        countRaws = Math.floor(context.measureText(text).width / 550);

    y -= (countRaws / 2) * lineHeight;
    for (var n = 0; n < countWords; n++) {
        var
            testLine = line + words[n] + " ",
            testWidth = context.measureText(testLine).width;

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

function drawQuote() {
    if (quote != null && countDrawImgs == 4) {
        var context = canvas.getContext('2d');

        context.fillStyle = 'white';
        context.font = "italic 22pt Arial";
        context.textAlign = "center";
        cutQuote(context, quote, canvas.width / 2, (canvas.height / 2 + 11), 550, 40);
    }
    else {
        setTimeout(drawQuote, 1);
    }
}

function getImgs() {
    for (var i = 0; i < 4; i++) {
        imgs[i] = new Image();
        imgs[i].crossOrigin = "anonymous";
        r = (i + 4) * 100
        imgs[i].src = 'https://source.unsplash.com/' + r + 'x' + r + '/?dog';
        imgs[i].onload = function () {
            countLoadImgs++;
        }
    }
}

function drawImg(img, sx, sy, swidth, sheight, x, y, width, height) {
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
    countDrawImgs++;
}

function drawImgs() {
    if (countLoadImgs == 4) {
        drawImg(imgs[0], 0, 0, imgs[0].naturalWidth, imgs[0].naturalHeight, 0, 0, 300, 300);
        drawImg(imgs[1], 0, 0, imgs[1].naturalWidth, imgs[1].naturalHeight, 300, 0, 300, 300);
        drawImg(imgs[2], 0, 0, imgs[2].naturalWidth, imgs[2].naturalHeight, 0, 300, 300, 300);
        drawImg(imgs[3], 0, 0, imgs[3].naturalWidth, imgs[3].naturalHeight, 300, 300, 300, 300);
        //Blackout
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(0, 0, 600, 600);
    } else {
        setTimeout(drawImgs, 1);
    }
}

function generateHTML() {
    var
        canvas = document.createElement('canvas'),
        save = document.createElement('button'),
        body = document.getElementById('body'),
        div = document.createElement('div');

    canvas.id = 'canvas';

    div.style.width = '100%';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.alignItems = 'center';

    save.id = 'save';
    save.innerHTML = 'Save image';
    save.style.backgroundColor = 'red';
    save.style.border = 'none';
    save.style.color = 'white';
    save.style.padding = '10px 25px';
    save.style.fontSize = '20px';
    save.onclick =
        function () {
            if (countDrawImgs == 4) {
                var canv = document.getElementById('canvas'),
                    dataURL = canv.toDataURL("image/jpg"),
                    link = document.createElement("a");
                link.href = dataURL;
                link.download = "quote.jpg";
                link.click();
            }
        };

    div.appendChild(canvas);
    div.appendChild(save);
    body.appendChild(div);
}