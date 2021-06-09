var vw, wh, song, songs, blobs, newSong, loaded, nextButtonPressed, songName, songNames, displayN, fft, amplitude, peakDetect, spectrum, level, treble, highMid, mid, lowMid, bass, centroid, centroidH, volumeS, volumeB;
let playButton, nextButton, welcome, loading, welcomeButton, welcomeClick, header, content;
var pBass, pLowMid, pMid, pHighMid, pTreble;
var bassX, bassY, bassW, midX, lowMidX, lowMidY,lowMidW, midY, midW, highMidX, highMidY, highMidW, trebleX, trebleY, trebleW, highBarX, highBarY, highBarH,highBarW, highBarGlitch;
let blob, red, orange, yellow,lightGreen, green, lightBlue, blue, purple, pink, white;
let currentN, nextN, pauseSVG, playSVG;
let glitches, glitch1,glitch2,glitch3,glitch4,glitch5,glitch6,glitch7,glitch8;
let cnv;

function preload() {
    welcomeButton = select('.welcome_button')

    // blob = loadImage('images/ƒ.png');
    red = loadImage('images/blobs/red.png');
    orange = loadImage('images/blobs/orange.png');
    yellow = loadImage('images/blobs/yellow.png');
    lightGreen = loadImage('images/blobs/light green.png');
    green = loadImage('images/blobs/green.png');
    lightBlue = loadImage('images/blobs/light blue.png');
    blue = loadImage('images/blobs/blue.png');
    purple = loadImage('images/blobs/purple.png');
    pink = loadImage('images/blobs/pink.png');
    white = loadImage('images/blobs/white.png');

    glitch1 = loadImage('images/glitches/glitch01.png');
    glitch2 = loadImage('images/glitches/glitch02.png');
    glitch3 = loadImage('images/glitches/glitch03.png');
    glitch4 = loadImage('images/glitches/glitch04.png');
    glitch5 = loadImage('images/glitches/glitch05.png');
    glitch6 = loadImage('images/glitches/glitch06.png');
    glitch7 = loadImage('images/glitches/glitch07.png');
    glitch8 = loadImage('images/glitches/glitch08.png');


    glitches= [glitch1,glitch2,glitch3,glitch4,glitch5,glitch6];

    song1 = loadSound('music/Interpretation 1.wav');
    song2 = loadSound('music/Interpretation 2.wav');
    song3 = loadSound('music/Interpretation 3.wav');

    songs = [song1, song2, song3];
    currentN = 0;
    song = songs[currentN]

    welcomeButton = select('.welcome_button')
    welcomeClick = select('.welcome_click')
    welcomeButton.hide();
    welcomeClick.hide();

    header = select('.header')
    content = select('.bottom')


}

function setup() {

    wv = windowWidth;
    vh = windowHeight;
    console.log(windowHeight);
    cnv = createCanvas(windowWidth, windowHeight);
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    cnv.position(x, y);

    song.setVolume(0.5);
    // loaded = false;

    playButton = select('.play_button')
    playButton.mousePressed(togglePlaying)
    fft = new p5.FFT();
    amplitude = new p5.Amplitude();
    peakDetect = new p5.PeakDetect();

    nextButton = select('.next_button')
    previousButton = select('.previous_button')
    loading = select('.welcome_loading')
    welcome = select('.welcome')
   

    loading.hide();   
    welcomeButton.show();
 
    welcomeButton.addClass("fade-in")
    welcomeClick.show();

    welcome.mousePressed(startSong);

    setSongName();

    pBass = 0;
    pLowMid = 0;
    pMid = 0;
    pHighMid = 0;
    pTreble = 0;
 

    bassX=[];
    bassY = [];
    bassW=[];

    
    lowMidX = [];
    lowMidY = [];
    lowMidW = [];


    midX = [];
    midY = [];
    midW = [];

    trebleX = [];
    trebleY = [];
    trebleW = [];


    highMidX = [];
    highMidY = [];
    highMidW = [];

    highBarX = [];
    highBarY = [];
    highBarH = [];
    highBarW=[];
    highBarGlitch = [];

    buttonPress();

    pauseSVG = select('.pause')
    playSVG = select('.play')

    pauseSVG.hide();

    imageMode(CENTER);

}


function togglePlaying() {
    if (!song.isPlaying()) {
        song.play();
        playSVG.hide();
        pauseSVG.show();

    } else if (song.isPlaying()){
        song.pause();
        pauseSVG.hide();
        playSVG.show();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}



function draw() {

    if (song.isPlaying()) {
        // background(100)
        // if(bass>100){
        //     background(map(bass, 0, 255,100,0));
        // }
        smooth();

       // background(0);
        spectrum = fft.analyze();
        level = amplitude.getLevel();

        pTreble = treble;
        treble = fft.getEnergy('treble');
        pHighMid = highMid;
        highMid = fft.getEnergy('highMid');
        pMid = mid;
        mid = fft.getEnergy('mid');
        pLowMid=lowMid
        lowMid = fft.getEnergy('lowMid');
        pBass = bass;
        bass = fft.getEnergy(16);

        peakDetect.update(fft);
        centroid = fft.getCentroid();
        colorMode(HSB, 360);
        centroidH = map(centroid, 900,10000,0,300);

        if(level< 0.25){
            volumeB = map(level, 0, 0.25, 5, 40);
        }else{
            console.log(level)

            volumeB = map(level, 0.25, 0.5, 40, 60);
        }
      
        volumeS = map(level, 0, 0.4, 300, 240);

        volumeB = map(level, 0, 0.4, 0, 80);

        background(centroidH,300,40);
        //mids
        generateBlobs(bass, pBass, 20, 4, bassX,bassY,bassW, red);
        generateBlobs(lowMid, pLowMid, 19, 4, lowMidX,lowMidY,lowMidW, orange);

        generateBlobs(mid, pMid, 20, 4, midX,midY,midW, green);

        generateBlobs(highMid, pHighMid, 20, 4, highMidX,highMidY,highMidW, blue);

        generateBlobs(treble, pTreble, 20, 4, trebleX,trebleY,trebleW, purple);



        // bass
        if(bass > 120){
            fill(centroidH,65,20, map(bass, 120, 220, 190, 120))
        }
        else if (bass > 220) {
            fill(centroidH,65,20, map(bass, 180, 255, 120, 50))
        } else {
            fill(centroidH,65,20,map(bass, 0, 150, 230, 190))
        }
        rect(0, 0, width, height)


        //highs
        //random X
        if (treble > pTreble + 8 && treble > 90) {
            highBarX.push(random(0, width-width/3));
            highBarY.push(random(0, height));
            highBarH.push(random(5,60));
            highBarW.push(random(width/3, width));
            highBarGlitch.push(glitches[Math.floor(Math.random() * glitches.length)]);
        } else if (treble < pTreble - 2) {
            highBarX.pop();
            highBarY.pop();
            highBarH.pop();
            highBarW.pop();
            highBarGlitch.pop();
        }

        for (let i = 0; i < highBarX.length; i++) {
            fill(map(treble, 90, 170, 0, 255));

            push();
            blendMode(SCREEN);
            image(highBarGlitch[i], highBarX[i], highBarY[i], highBarW, highBarH[i]);
            pop();

        }
    }

}

function generateBlobs(f, pf, addDiff, decreaseDiff, xs,ys,ws, color){
    if (f > pf + addDiff) {
        // if(height < width){
        //     xs.push(random((width/2*-1),width));
        //     ys.push(random((height*-1),height));
        //     ws.push(random(height, width*2));
        // }else{
        //     xs.push(random((width*-1),width));
        //     ys.push(random((width*-1),height));
        //     ws.push(random(height, width*2));
        // }
        if(height < width){
        xs.push(random((width/3*-1),width));
        ys.push(random((width/3*-1),height));
        ws.push(random(height, width*2));
        }else {
            xs.push(random((height/3*-1),width));
            ys.push(random((height/3*-1),height));
            ws.push(random(height, height*2));
        }
       
    } else if (f < pf - decreaseDiff) {
        xs.pop();
        ys.pop();
        ws.pop();
    }

    for (let i = 0; i < xs.length; i++) {

        if(width>height){
            image(color, xs[i], ys[i], width*0.8 + map(f, 0,255, 0,width), width*0.8+ map(f, 0,255, 0,width));

        }else{
            image(color, xs[i], ys[i], height*0.8 + map(f, 0,255, 0,height), height*0.8+ map(f, 0,255, 0,height));
        }
        
    }
}

function startSong(){
    welcome.addClass('disappear');
    welcomeButton.addClass('disappear');
    welcome.id('remove');
    welcomeButton.id('remove');
    welcomeClick.id('remove');

    welcomeClick.addClass('disappear');

    header.addClass('delay');
    content.addClass('delay');

    setSongName();
    song.play();
    playSVG.hide();
    pauseSVG.show();
}

function buttonPress() {
    nextButton.mousePressed(nextSong);
    previousButton.mousePressed(previousSong)
}

function nextSong() {
    cnv.clear();
    if (song.isPlaying()) {
        song.pause();
    }
    if (currentN + 1 >= songs.length) {
        currentN = 0;
    } else {
        currentN++;
    }
    song = songs[currentN];
    setSongName();
    song.play();
    playSVG.hide();
    pauseSVG.show();
}

function previousSong() {
    cnv.clear();
    if (song.isPlaying()) {
        song.pause();
    }
    if (currentN - 1 < 0) {
        currentN = songs.length - 1;
    } else {
        currentN--;
    }
    song = songs[currentN];
    setSongName();
    song.play();
    playSVG.hide();
    pauseSVG.show();
}

function setSongName() {
    songName = select('.song')
    displayN = currentN + 1;
    songName.elt.innerText = "Interpretation " + displayN;
}