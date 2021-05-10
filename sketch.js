const WIDTH = 1000;
const HEIGHT = 450;
const FPS = 8;
const BOX = 32; // unit for snake measure

const PAUSED = 0;
const GAME_OVER = -1;
const PLAYING = 1;

let MODEL_URL =
  "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe";

let pitch;
let mic;
let freq = 0;
let currentNote = null; // current note detected

let gameState = PAUSED;
let score = 0;

let xpos, ypos; // starting point of the snake head
let snake = []; // this is our snake , , , yep !!

// initial snake
snake[0] = {
  x: 5 * BOX,
  y: 10 * BOX,
};

snake[1] = {
  x: 4 * BOX,
  y: 10 * BOX,
};

snake[2] = {
  x: 3 * BOX,
  y: 10 * BOX,
};

let food = {
  x: Math.floor(Math.random() * 17 + 1) * BOX,
  y: Math.floor(Math.random() * 15 + 3) * BOX,
};

let dir = "RIGHT"; // right

document.addEventListener("keydown", handleDirection);

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
  console.log("Setting up canvas. . Please wait ");
  const cnv = createCanvas(WIDTH, HEIGHT);
  frameRate(FPS);
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(listening);

  cnv.id("mycanvas");
  cnv.parent("canvasContainer");

  setConsole("Press start to begin");
}

function draw() {
  background(0);
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(32);

  // Display current frequency
  //   text(freq.toFixed(2), width / 2, height - 150);

  let closestNote = -1; // detected note
  let recordDiff = Infinity; // difference between the freq detected and the closest note freq

  notes.forEach((note) => {
    const currentDiff = freq - note.freq; // difference between the current freq and note freq
    if (abs(currentDiff) < abs(recordDiff)) {
      closestNote = note;
      recordDiff = currentDiff;

      //   currentNote = abs(recordDiff) <= 50 ? closestNote.note : null;
      if (abs(recordDiff) <= 50) currentNote = closestNote.note;
      //   currentNote = closestNote.note;
    }
  });

  setFreq(freq.toFixed(2));
  ///////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////Game Logic/////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  textSize(22);
  text(score, 20, 20);
  textSize(32);
  if (gameState === PAUSED) text("PAUSE", WIDTH / 2, HEIGHT / 2);
  if (gameState === GAME_OVER) gameOver();

  snake.forEach((s, index) => {
    if (index === 0) fill("red");
    else fill("white");
    rect(s.x, s.y, BOX, BOX);
  });

  ///////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////Game Start/////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  if (gameState === PLAYING) {
    handleDirectionWithNote();
    setConsole("Note: " + currentNote);

    fill("green");

    // draw food
    rect(food.x, food.y, 16, 16);

    // ellipse(food.x, food.y, 16, 16);
    // draw snake
    // Old snake head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Update Position
    if (dir == "RIGHT") snakeX += BOX;
    if (dir == "LEFT") snakeX -= BOX;
    if (dir == "UP") snakeY -= BOX;
    if (dir == "DOWN") snakeY += BOX;

    // snake.pop();

    let newHead = {
      x: snakeX,
      y: snakeY,
    };

    // Game over
    if (
      snakeX <= 0 ||
      snakeX >= width - BOX ||
      snakeY + BOX >= height ||
      snakeY <= 0 ||
      collison(newHead, snake)
      //   collison(newHead, snake) ||
    ) {
      gameOver();
    }

    snake.unshift(newHead);
    // If snake eats the food
    if (
      food.x >= snake[0].x &&
      food.x <= snake[0].x + BOX &&
      food.y >= snake[0].y &&
      food.y <= snake[0].y + BOX
    ) {
      console.log("whahaatt");
      score++;
      food = {
        x: floor(random(10, (width - 100) / 10)) * 10,
        y: floor(random(10, (height - 100) / 10)) * 10,
      };
    } else {
      snake.pop();
    }
    // erase();
    //   text(abs(recordDiff), width / 2, height - 100);
  }
}

// Function Changes the direction of the snake movement
function handleDirection(event) {
  console.log("handling direciton");
  if ((event.keyCode == 37 || currentNote === "B") && dir != "RIGHT") {
    console.log("Gooooo righttt");
    dir = "LEFT";
  } else if ((event.keyCode == 38 || currentNote === "C") && dir != "DOWN") {
    console.log("Gooooo Down");
    dir = "UP";
  } else if ((event.keyCode == 39 || currentNote === "A") && dir != "LEFT") {
    console.log("Gooooo down");
    dir = "RIGHT";
  } else if ((event.keyCode == 40 || currentNote === "G") && dir != "UP") {
    console.log("Gooooo up");
    dir = "DOWN";
  }
}

function handleDirectionWithNote() {
  if (currentNoteo === "B" && dir !== "RIGHT") dir = "RIGHT";
  else if (currentNoteo === "C" && dir !== "DOWN") dir = "DOWN";
  else if (currentNoteo === "G" && dir !== "UP") dir = "UP";
  else if (currentNoteo === "A" && dir !== "LEFT") dir = "LEFT";
}

function gameOver() {
  dir = "RIGHT";
  currentNote = null;
  setConsole(`GAME OVER !! FINAL SCORE: ${score}`);

  gameState = GAME_OVER;
}

function switchGameState() {
  console.log("switched");
  clear();
  score = 0;
  if (gameState === PAUSED) {
    gameState = PLAYING;
  } else if (gameState === GAME_OVER) {
    // initial snake
    snake = [];
    snake[0] = {
      x: 5 * BOX,
      y: 10 * BOX,
    };

    snake[1] = {
      x: 4 * BOX,
      y: 10 * BOX,
    };

    snake[2] = {
      x: 3 * BOX,
      y: 10 * BOX,
    };

    let dir = "RIGHT"; // right
    gameState = PLAYING;
  }
}

// Check collison with tail
function collison(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].x == head.x && array[i].y == head.y && array.length > 1)
      return true;
  }
  return false;
}

function setConsole(message) {
  const textArea = document.getElementById("note-value");
  textArea.innerHTML = message;
}

function setFreq(freq) {
  const textArea = document.getElementById("freq-value");
  textArea.innerHTML = freq;
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
