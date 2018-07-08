const canvas = $('#preview').get(0).getContext('2d');
let loadedImage = new Image();
let file;
let reader;
let date = "";
let px = 0,py = 0,pw = 0,ph = 0;
let orientation = 0;

function isLoaded(){
    return loadedImage.src;
}



$('#save-button-wrapper').click(function(event){
    let ctx = $('#output').get(0).getContext('2d');

    let imgw,imgh;

    if(orientation === 5||orientation === 6||orientation === 7||orientation === 8){
        imgw = loadedImage.height;
        imgh = loadedImage.width;
    }
    else{
        imgw = loadedImage.width;
        imgh = loadedImage.height;
    }

    $('#output').attr('width',imgw);
    $('#output').attr('height',imgh);

    ctx.translate(imgw / 2,imgh / 2);

    if(orientation === 2){
        ctx.scale(-1,1);
    }
    else if(orientation === 3){
        ctx.rotate(Math.PI);
    }
    else if(orientation === 4){
        ctx.rotate(Math.PI);
        ctx.scale(-1,1);
    }
    else if(orientation === 5){
        ctx.rotate(Math.PI / 2);
        ctx.scale(-1,1);
    }
    else if(orientation === 6){
        ctx.rotate(Math.PI / 2);
    }
    else if(orientation === 7){
        ctx.rotate(-Math.PI / 2);
        ctx.scale(-1,1);
    }
    else if(orientation === 8){
        ctx.rotate(-Math.PI / 2);
    }

    ctx.drawImage(loadedImage,-loadedImage.width / 2,-loadedImage.height / 2,loadedImage.width,loadedImage.height);

    ctx.setTransform(1,0,0,1,0,0);


    ctx.shadowColor = "rgb(40,40,40)";
    ctx.shadowOffsetX = imgw / 200;
    ctx.shadowOffsetY = imgw / 200;
    ctx.shadowBlur = imgw / 300;

    ctx.textAlign = "right";
    ctx.font = (imgw / 20) + "px 'Noto Sans CJK'";
    ctx.fillStyle = "rgb(225,225,225)";

    let d = imgw / 50;

    ctx.fillText(date,imgw - d,imgh - d);

    ctx.textAlign = "left";
    ctx.fillText($('#title-input').val(),d,imgh - d);



    $('#output').get(0).toBlob(function(blob){
        console.log(blob);
        $('<a>', {
            href: URL.createObjectURL(blob),
            download: $('#title-input').val() + ' - ' + date + '.png'
        })[0].click();
    });

    $('#output').attr('width',0);
    $('#output').attr('height',0);
});

$('#load-button').change(function(event){
    file = event.target.files[0];
    if(!file)return;
    loadedImage.src = URL.createObjectURL(file);
    EXIF.getData(file, function() {
        // EXIF.getTag(this, "[exifのタグ名]")で、値を取得
        date = EXIF.getTag(this, "DateTimeOriginal");
        date = date.split(" ")[0];
        date = date.replace(':','/');
        date = date.replace(':','/');
        orientation = EXIF.getTag(this,"Orientation");

    });
});

setInterval(function(){
    if(!isLoaded())return;
    let cwidth = $('#image-wrapper').width() * 2;
    let cheight = $('#image-wrapper').height() * 2;
    $('#preview').attr('width',cwidth);
    $('#preview').attr('height',cheight);
    $('#preview').attr('style','width:' + cwidth / 2 +';height:' + cheight / 2 + ";");
    let a1 = cheight / cwidth;
    let a2;
   // console.log(a1,a2);

    canvas.shadowColor = "rgb(40,40,40)";
    canvas.shadowOffsetX = 3;
    canvas.shadowOffsetY = 3;

    let imgw,imgh;

    if(orientation === 5||orientation === 6||orientation === 7||orientation === 8){
        imgw = loadedImage.height;
        imgh = loadedImage.width;
    }
    else{
        imgw = loadedImage.width;
        imgh = loadedImage.height;
    }
    a2  = imgh / imgw;

    if(a1 > a2){
        let h = imgh * (cwidth / imgw);
        px = 0;
        py = (cheight - h) / 2;
        pw = cwidth;
        ph = h;
    }
    else{
        let w = imgw * (cheight / imgh);
        px = (cwidth - w) / 2;
        py = 0;
        pw = w;
        ph = cheight;
    }
    canvas.translate(px + pw / 2,py + ph / 2);

    if(orientation === 2){
        canvas.scale(-1,1);
    }
    else if(orientation === 3){
        canvas.rotate(Math.PI);
    }
    else if(orientation === 4){
        canvas.rotate(Math.PI);
        canvas.scale(-1,1);
    }
    else if(orientation === 5){
        canvas.rotate(Math.PI / 2);
        canvas.scale(-1,1);
    }
    else if(orientation === 6){
        canvas.rotate(Math.PI / 2);
    }
    else if(orientation === 7){
        canvas.rotate(-Math.PI / 2);
        canvas.scale(-1,1);
    }
    else if(orientation === 8){
        canvas.rotate(-Math.PI / 2);
    }

    canvas.shadowBlur = pw / 300;

    if(orientation === 5||orientation === 6||orientation === 7||orientation === 8) {
        canvas.drawImage(loadedImage,-ph / 2,-pw / 2,ph,pw);
    }
    else{
        canvas.drawImage(loadedImage,-pw / 2,-ph / 2,pw,ph);
    }

    canvas.setTransform(1,0,0,1,0,0);


    canvas.textAlign = "right";
    canvas.font = (pw / 20) + "px 'Noto Sans CJK'";
    canvas.fillStyle = "rgb(225,225,225)";

    let d = pw / 50;

    canvas.fillText(date,px + pw - d,py + ph - d);

    canvas.textAlign = "left";
    canvas.fillText($('#title-input').val(),px + d,py + ph - d);

},33);
