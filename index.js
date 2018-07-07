const canvas = $('#preview').get(0).getContext('2d');
let loadedImage = new Image();
let file;
let reader;
let date = "";
let px = 0,py = 0,pw = 0,ph = 0;

function isLoaded(){
    return loadedImage.src;
}



$('#save-button-wrapper').click(function(event){
    $('#output').attr('width',loadedImage.width);
    $('#output').attr('height',loadedImage.height);
    let ctx = $('#output').get(0).getContext('2d');
    ctx.drawImage(loadedImage,0,0,loadedImage.width,loadedImage.height);
    ctx.shadowColor = "rgb(40,40,40)";
    ctx.shadowOffsetX = loadedImage.height / 200;
    ctx.shadowOffsetY = loadedImage.height / 200;
    ctx.shadowBlur = loadedImage.height / 100;

    ctx.textAlign = "right";
    ctx.font = (loadedImage.height / 20) + "px 'Noto Sans CJK'";
    ctx.fillStyle = "rgb(225,225,225)";

    let d = loadedImage.height / 50;

    ctx.fillText(date,loadedImage.width - d,loadedImage.height - d);

    ctx.textAlign = "left";
    ctx.fillText($('#title-input').val(),d,loadedImage.height - d);



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
    let a2 = loadedImage.height / loadedImage.width;
   // console.log(a1,a2);

    canvas.shadowColor = "rgb(40,40,40)";
    canvas.shadowOffsetX = 3;
    canvas.shadowOffsetY = 3;

    if(a1 > a2){
        let h = loadedImage.height * (cwidth / loadedImage.width);
        px = 0;
        py = (cheight - h) / 2;
        pw = cwidth;
        ph = h;
    }
    else{
        let w = loadedImage.width * (cheight / loadedImage.height);
        px = (cwidth - w) / 2;
        py = 0;
        pw = w;
        ph = cheight;
    }



    canvas.shadowBlur = ph / 100;


    canvas.drawImage(loadedImage,px,py,pw,ph);
    canvas.textAlign = "right";
    canvas.font = (ph / 20) + "px 'Noto Sans CJK'";
    canvas.fillStyle = "rgb(225,225,225)";

    let d = ph / 50;

    canvas.fillText(date,px + pw - d,py + ph - d);

    canvas.textAlign = "left";
    canvas.fillText($('#title-input').val(),px + d,py + ph - d);

},33);
