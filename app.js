// DOM-related globals
const movementDisplay = document.getElementById("movement");
const game = document.getElementById("game");
const shipImage = document.getElementById("shipImage");
const spaceWraith = document.getElementById("spaceWraith");
const zap = document.getElementById("zap");
const ray = document.getElementById("ray");
const blasts = document.getElementById("blasts");
const score = document.getElementById("score");
const instructions = document.getElementById("instructions");
const row = 4;
const col = 5;
let points = 0;

// player globals
let player;
let pew;
let arrBlasts = [];

// wraith globals
let wraith;
let arrWraith = [];
let rayz;
let arrRay = [];

// canvas setup
const ctx = game.getContext("2d");

game.setAttribute("height", getComputedStyle(game)["height"]);
game.setAttribute("width", getComputedStyle(game)["width"]);

function clearCanvas() {
  ctx.clearRect(0, 0, game.width, game.height);
}

// *********** SHIP ************
// ship setup
class Ship {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.alive = true;
  }

  render() {
    ctx.drawImage(shipImage, this.x, this.y, this.width, this.height);
  }
}

// ship movement
function shipMove(e) {
  if (e.keyCode === 38 && player.y > 0) {
    player.y -= 10;
  } else if (e.keyCode === 40 && player.y < 370) {
    player.y += 10;
  }
}

// ship blast class
class Blasts {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 15;
  }

  render() {
    ctx.drawImage(zap, (this.x += this.speed), this.y, this.width, this.height);
  }
}

// ship blasts
function shipBlasts(e) {
  if (e.keyCode === 32) {
    blasts.textContent = "pewwwwww";
    // fire!
    pew = new Blasts(player.x + 30, player.y, 25, 25);
    arrBlasts.push(pew);

    // wait to reload
    setTimeout(function () {
      blasts.textContent = "";
    }, 500);
  }
}

// *********** WRAITHS ************
// wraiths setup
class Wraith {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 2;
    this.alive = true;
  }

  render() {
    ctx.drawImage(
      spaceWraith,
      this.x,
      (this.y += this.speed),
      this.width,
      this.height
    );
  }

  fire() {
    if (this.alive) {
      arrRay.push(new Ray(this.x - 30, this.y, 25, 25));
    }
  }
}

// wraith array
function moreWraiths() {
  for (let y = 0; y < col; y++) {
    for (let x = 0; x < row; x++) {
      wraith = new Wraith(x * 70 + 500, y * 70, 40, 40);
      arrWraith.push(wraith);
    }
  }
}

moreWraiths(); // why am i calling this here and why doesn't it work in the game loop?

// wraith movement
function wraithMovement() {
  arrWraith.forEach((wraith) => {
    if (wraith.y >= 340) {
      if (arrWraith.length <= 10) {
        arrWraith.forEach((wraith) => {
          wraith.speed = -10;
          wraith.y -= 1;
          wraith.x -= 5;
        });
      } else if (arrWraith.length <= 15) {
        arrWraith.forEach((wraith) => (wraith.speed = -5));
      } else arrWraith.forEach((wraith) => (wraith.speed = -2));
    } else if (wraith.y <= 10) {
      if (arrWraith.length <= 10) {
        arrWraith.forEach((wraith) => {
          wraith.speed = 10;
          wraith.y += 1;
          wraith.x -= 5;
        });
      } else if (arrWraith.length <= 15) {
        arrWraith.forEach((wraith) => (wraith.speed = 5));
      } else arrWraith.forEach((wraith) => (wraith.speed = 2));
    }
  });
}
// how do i avoid hardcoding this?

// wraith ray NOT WORKING
class Ray {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 15;
  }

  render() {
    ctx.drawImage(ray, (this.x -= this.speed), this.y, this.width, this.height);
  }
}

// **** TO DO ****

// function wraithRay(e) {
//   if (e.keyCode === 76) {
//     rayz = new Ray(wraith.x - 30, wraith.y, 25, 25); // randomize the y
//     arrRay.push(rayz);
//   }

//   // wait to reload
//   setTimeout(function () {}, 500);
// }

function wraithRay() {
  for (let y = 0; y < col; y++) {
    for (let x = 0; x < row; x++) {
      let randomY = Math.floor(Math.random() * col);
      let randomX = Math.floor(Math.random() * row);
      // if (wraith[randomY][randomX].alive) {
      //   wraith[randomY][randomX].fire();
      rayz = new Ray(wraith.x - 30, wraith.randomY, 25, 25);
      arrRay.push(rayz);
      // }
    }

    // wait to reload
    // setTimeout(function () {
    //   );
    // }, 500);
  }
}

// hit detection (hitting wraiths)
function hitWraith() {
  for (let i = 0; i < arrWraith.length; i++) {
    for (let j = 0; j < arrBlasts.length; j++) {
      if (
        arrBlasts[j].y + pew.height > arrWraith[i].y &&
        arrBlasts[j].y < arrWraith[i].y + wraith.height &&
        arrBlasts[j].x + pew.width > arrWraith[i].x &&
        arrBlasts[j].x < arrWraith[i].x + wraith.width
      ) {
        arrWraith.splice(i, 1);
        arrBlasts.splice(j, 1);
        points += 50;
        score.textContent = points;
      }
    }
  }
}

// game conditions
function winner() {
  if (arrWraith.length === 0) instructions.textContent = "You Won!";
}

// game loop
function gameLoop() {
  clearCanvas();
  movementDisplay.textContent = `X: ${player.x} 
  Y: ${player.y}`;
  player.render();
  arrBlasts.forEach((pew) => pew.render());
  arrWraith.forEach((wraith) => wraith.render());
  wraithMovement();
  wraithRay();
  arrRay.forEach((rayz) => rayz.render()); //  NOT WORKING
  hitWraith();
  winner();
}

// event listeners
document.addEventListener("DOMContentLoaded", function () {
  player = new Ship(10, 200, 30, 30);
  wraith = new Wraith(500, 100, 50, 50);
  document.addEventListener("keydown", shipMove);
  document.addEventListener("keydown", shipBlasts);
  // document.addEventListener("keydown", wraithRay);
  const runGame = setInterval(gameLoop, 60);
});

// restart
