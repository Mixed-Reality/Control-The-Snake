const WIDTH = 800;
const HEIGHT = 500;

let MODEL_URL =
  "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe";

let pitch;
let mic;
let freq = 0;
let currentNote; // current note detected

//  Notes and frequency in Hz
let notes = [
  {
    note: "G", // Up
    freq: 560,
  },
  {
    note: "A", // Left
    freq: 630,
  },
  {
    note: "B", // right
    freq: 700,
  },
  {
    note: "C",
    freq: 790, // Down
  },
];

function setup() {
  const cnv = createCanvas(WIDTH, HEIGHT);
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(listening);

  cnv.id("mycanvas");
  cnv.parent("canvasContainer");
}

function draw() {
  background(0);
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(32);

  // Display current frequency
  text(freq.toFixed(2), width / 2, height - 150);

  let closestNote = -1; // detected note
  let recordDiff = Infinity; // difference between the freq detected and the closest note freq

  notes.forEach((note) => {
    const currentDiff = freq - note.freq; // difference between the current freq and note freq
    if (abs(currentDiff) < abs(recordDiff)) {
      closestNote = note;
      recordDiff = currentDiff;
      currentNote = closestNote.note;
    }
  });
  //   console.log("Current note: ", currentNote);

  textSize(64);
  text(closestNote.note, width / 2, height - 50);
}

function listening() {
  console.log("Mic Activated. Listening");
  pitch = ml5.pitchDetection(MODEL_URL, audioContext, mic.stream, modelLoaded);
}

function modelLoaded() {
  console.log("model loaded");
  pitch.getPitch(gotPitch);
}

function gotPitch(error, frequency) {
  if (error) {
    console.error(error);
  } else {
    //console.log(frequency);
    if (frequency) {
      freq = frequency;
    }
    pitch.getPitch(gotPitch);
  }
}
