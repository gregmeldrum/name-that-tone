var notes = [];
notes[0] = [0, 4, 7];  //major
notes[1] = [0, 3, 7];  //minor
notes[2] = [0, 4, 8];  //augmented
notes[3] = [0, 3, 6];  //diminished

var triadNames = ["major", "minor", "augmented", "diminished"];

var currentTriad;
var currentTonic;

var loading = true;
var attempts = 0;
var correctAnswers = 0;

window.onload = function () {
    MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano",
        onprogress: function(state, progress) {
            console.log("Progress ", state, progress);
        },
        onsuccess: function() {
            document.getElementById("loading").style.display = "none";
            document.getElementById("playTriadButton").style.display = "inline";
        }
    });
};

function playTriad() {
    hideElement("playTriadButton");
    hideElement("answer");
    
    // Choose a random triad and tonic note
    currentTriad = Math.floor((Math.random() * 4));
    currentTonic = Math.floor((Math.random() * 20) + 45);

    playNotes(currentTonic, notes[currentTriad]);
}

function replay() {
    playNotes(currentTonic, notes[currentTriad]);
    hideElement("replay");
}

function playNotes(baseNote, noteOffsets) {

    var delay = 0; // play one note every quarter second
    var velocity = 127; // how hard the note hits

    // play the note
    MIDI.setVolume(0, 127);
    
    // Start and end each note
    noteOffsets.forEach(function(note) {
        console.log("Playing note ", note);
        MIDI.noteOn(0, baseNote + note, velocity, delay);
        MIDI.noteOff(0, baseNote + note, delay + 0.75);
    });

    showElement("guess");
    showElement("replay");
}
 
function guessMajor() {
   checkAnswer(0);
}

function guessMinor() {
    checkAnswer(1);
}

function guessAugmented() {
    checkAnswer(2);
}

function guessDiminished() {
    checkAnswer(3);
}

function checkAnswer(guess) {
    hideElement("guess");
    showElement("answer");

    attempts += 1;

    if (guess === currentTriad) {
        document.getElementById("answer").innerHTML = "<p>Correct! " + triadNames[currentTriad] + "</p>";
        correctAnswers += 1;
    } else {
        document.getElementById("answer").innerHTML = "<p>Incorrect :(<br>Actual Triad: " + triadNames[currentTriad] + "</p>";
    }

    showElement("playTriadButton");
    updateScore();
}

function showElement(elementId) {
    updateDisplayCssForElement(elementId, "inline");
}

function hideElement(elementId) {
    updateDisplayCssForElement(elementId, "none");
}

function updateDisplayCssForElement(elementId, displayStyle) {
   document.getElementById(elementId).style.display = displayStyle;
}

function updateScore(){
    document.getElementById("score").innerHTML = "<p>" + correctAnswers + " / " + attempts + "</p>";
}