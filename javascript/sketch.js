var vw, wh, song, songs, newSong, loaded, nextButtonPressed, songName, songNames, displayN, fft, amplitude, peakDetect, spectrum, level, pTreble, treble, highmid, pMid, mid, lowmid, bass, centroid;
let playButton, nextButton;
var highX, highY, midX, midY, midW;
let blob;
let currentN, nextN, pauseSVG, playSVG;

function preload() {
    blob = loadImage('images/blob1.png');

    song1 = loadSound('music/Interpretation 1.mp3');
    song2 = loadSound('music/Interpretation 2.mp3');
    song3 = loadSound('music/Interpretation 3.mp3');
    songs = [song1, song2, song3];
    currentN = 0;
    song = songs[currentN]
}

function setup() {

    wv = windowWidth;
    vh = windowHeight;
    let cnv = createCanvas(windowWidth, windowHeight);
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

    setSongName()




    pTreble = 0;
    pMid = 0;
    highX = [];
    highY = [];
    midX = [];
    midY = [];
    midW = [];

    imageMode(CORNER);
    buttonPress();

    pauseSVG = select('.pause')
    playSVG = select('.play')

    pauseSVG.hide();


}


function togglePlaying() {
    if (!song.isPlaying()) {
        song.play();
        playSVG.hide();
        pauseSVG.show();

    } else {
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

        background(0);
        spectrum = fft.analyze();
        level = amplitude.getLevel();
        pTreble = treble;
        treble = fft.getEnergy('treble');
        highMid = fft.getEnergy('highMid');
        pMid = mid;
        mid = fft.getEnergy('mid');
        lowMid = fft.getEnergy('lowMid');
        peakDetect.update(fft);
        bass = fft.getEnergy(16);
        centroid = fft.getCentroid();
        // console.log(centroid);

        //mids

        if (mid > pMid + 30) {
            midX.push(random(width) - width / 2);
            midY.push(random(height) - height / 2);
            midW.push(random(height, width));
        } else if (mid < pMid - 6) {
            midX.pop();
            midY.pop();
            midW.pop();
        }
        for (let i = 0; i < midX.length; i++) {
            //fill(50)
            // if(bass > 100){
            //     fill(50,50,50, map(bass,100,200,255,0));
            // }
            //ellipse(midX[i], midY[i], midW[i],midW[i]);

            image(blob, midX[i], midY[i], midW[i], midW[i]);
        }

        // bass
        //    console.log(bass);
        if (bass > 160) {
            fill(0, 0, 0, map(bass, 180, 255, 255, 0))
        } else {
            fill(0, 0, 0, 0)
        }
        rect(0, 0, width, height)


        //highs
        //random X
        if (treble > pTreble + 8 && treble > 90) {
            highX.push(random(0, width));
            highY.push(random(0, height));
        } else if (treble < pTreble - 5) {
            highX.pop();
            highY.pop();
        }

        for (let i = 0; i < highX.length; i++) {
            fill(map(treble, 90, 170, 0, 255));
            rect(0, highY[i], width, 20);

        }
    }

}

function buttonPress() {

    nextButton.mousePressed(nextSong);
    previousButton.mousePressed(previousSong)
}

function nextSong() {
    clear();
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
    clear();
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


    console.log(song)

    song.play();
    playSVG.hide();
    pauseSVG.show();
}

function setSongName() {
    songName = select('.song')
    displayN = currentN + 1;
    songName.elt.innerText = "Interpretation " + displayN;
}