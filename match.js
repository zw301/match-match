class Match {
  constructor() {
    this.$stag =  null;
    this.$time = null;
    this.imgs = [];

    //setting the level
    this.level = 1;

    //setting the game
    this.types = 10;
    this.rows = 6;
    this.cols = 8;

    this.width = 70;
    this.height = 70;
    this.gap = 10;
    this.matrix = [];
    this.pairs = null;
    this.selected = null;
    this.time = 90;
    this.score = 0;
    this.timeLeft = null;
    this.timer = null;

    // music
    this.clickEffect = null;
    this.linkEffect = null;

    // hint
    this.hintCount = 5;
    this.hintPair = [];
  }

  generateImg() {
    let imgs = new Array(30);
    for(let i = 0; i < 30; i++){
        imgs[i] = "img/" + i + '.png';
    }
    this.imgs = imgs;
  }

  showLevel(){
    let oLevel = document.getElementById("level");
    oLevel.innerHTML = this.level;
  }

  showScore(){
    let oScore = document.getElementById("score");
    oScore.innerHTML = this.score;
  }

  random_choose(min, max) {
    if(max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  }


  shuffle(array) {
    let length = array.length;
    let shuffled = Array(length);
    let rand;

    for (let i = 0; i < length; i++) {
      rand = this.random_choose(0, i);
      if( rand !== i) shuffled[i] = shuffled[rand];
      shuffled[rand] = array[i];
    }
    return shuffled;
  }

  getFormattedTime(seconds) {
      let minutes = Math.floor(seconds / 60);
      let sec = seconds % 60;
      return (minutes >= 10 ? minutes : "0" + minutes) + ":" + (sec >= 10 ? sec : "0" + sec);
  }

  init(element, options) {
    this.generateImg();

    clearInterval(this.timer);

    function transitionendHandler(event) {
      let target = event.target;
      if(target.classList.contains("killed") && target.parentNode) {
        target.parentNode.removeChild(target);
      }
    }

    this.$stage = document.querySelector(element);
    this.$stage.addEventListener("transitionend", transitionendHandler, false);

    if(options) {
      if(options.$time) this.$time = document.querySelector(options.$time);
      if(options.types) this.types = options.types;
      if(options.imgs) this.imgs = options.imgs;
      if(options.rows) this.rows = options.rows;
      if(options.cols) this.rows = options.cols;
      if(options.width) this.width = options.width;
      if(options.height) this.height = options.height;
      if(options.gap) this.gap = options.gap;
      if(options.pairs) this.pairs = options.pairs;
      if(options.time) this.time = options.time;
    }

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    canvas.width = (this.cols + 2) * (this.width + this.gap) - this.gap;
    canvas.height = (this.rows + 2) * (this.height + this.gap) - this.gap;

    canvas.style.top = -this.height - this.gap + 'px';
    canvas.style.left = -this.width - this.gap + "px";

    ctx.translate(this.width + this.gap, this.height + this.gap);
    this.$stage.appendChild(canvas);
    this.$canvas = canvas;
    this.$ctx = ctx;

    this.clickEffect = document.querySelector("#clickEffect");
    this.linkEffect = document.querySelector("#linkEffect");
  }

  build() {
    this.showLevel();

    if(!unlimited) {
      this.timeLeft = this.time;
      this.$time.innerHTML = this.getFormattedTime(this.timeLeft);
      clearTimeout(this.timer);
      this.timer = setTimeout(function() {
        self.countdown();
      }, 1000);
    }

    let self = this;
    let fragment = document.createDocumentFragment();
    let tiles = new Array(this.rows * this.cols);
    let index = this.types - 1;

    if(!this.pairs) this.pairs = this.rows * this.cols / 2;

    for (let i = 0; i < this.pairs * 2;) {
      tiles[i] = tiles[i + 1] = this.imgs.slice(0, this.types)[this.random_choose(index)];
      i += 2;
    }


    tiles = this.shuffle(tiles);

    for (let row = 0; row < this.rows; row++) {
      this.matrix[row] = [];
      for (let col = 0; col < this.cols; col++) {
        let type = tiles.shift();
        if(!type) {
          this.matrix[row][col] = null;
          continue;
        }

        let tile = document.createElement("div");
        tile.style.top = (row * (this.height + this.gap)) + "px";
        tile.style.left = (col * (this.width + this.gap)) + "px";
        tile.x = col;
        tile.y = row;
        tile.type = type;
        tile.className = "tile";
        tile.style.backgroundImage = "url(" + type + ")";
        tile.addEventListener("ontouchend" in window ? "touchend" : "click", function(event) {
          self.handleClick(event);
        }, false);
        fragment.appendChild(tile);
        this.matrix[row][col] = {
          type: type,
          el: tile
        };
      }
    }
    this.matrix[-1] = this.matrix[this.rows] = [];

    Array.prototype.forEach.call(this.$stage.querySelectorAll(".tile"), function(tile) {
      tile.parentNode.removeChild(tile);
    });

    this.$stage.appendChild(fragment);
  }


  handleClick(event) {
    // this.clearHint();
    let self = this;
    let curr = event.target;
    curr.classList.toggle("selected");
    curr.classList.remove("showhint");

    if (!bgmPlay) {
      clickEffect.pause();
      clickEffect.currentTime = 0;
      clickEffect.play();
    }

    if(curr.classList.contains("selected")) {
      if(this.selected) {
        let prev = this.selected;
        if(curr.type == prev.type) {
          let linkable = this.isLinkable(prev, curr);
          if(linkable) {
            this.bingo();
            this.selected = null;

            if(linkable === true) {
              this.killPath([prev, curr]);
            } else {
              linkable.unshift(prev);
              linkable.push(curr);
              this.killPath(linkable);
            }

            if(this. $stage.querySelectorAll(".tile").length === 0 || !this.findPair()) {
              this.level += 1;
              this.types = 10 + (this.level - 1) * 5;
              if(this.level === 4) {
                oFakeStage.style.display = "block";
                oFakeStage.innerHTML = "You Win! ! ! Click to play again! ! !";
                unlimited = false;
                clearTimeout(this.timer);
                this.level = 1;
                this.types = 10;
                this.score = 0;
                match = null;
                playing = false;
              }
              setTimeout(function() {
                if(match) {
                  self.build();
                }
              }, 600);
            }

          } else {
            prev.classList.remove("selected");
            this.selected = curr;
          }
        } else {
          prev.classList.remove("selected");
          this.selected = curr;
        }
      } else {
        this.selected = curr;
      }
    } else {
      this.selected = null;
    }
  }

  countdown() {
      var self = this;
      this.timeLeft--;
      this.$time.innerHTML = this.getFormattedTime(this.timeLeft);
      if (this.timeLeft > 0) {
          this.timer = setTimeout(function() {
            self.countdown();
          }, 1000);
      } else {
          setTimeout(function() {
            self.over();
          }, 1000);
      }
  }




  play() {
    var self = this;
    this.score = 0;
    this.showScore();

    this.build();
  }


  over() {
      oFakeStage.innerHTML = "Time's Up! ! ! Click to play again! ! !";
      oFakeStage.style.display = "block";
      playing = false;
      unlimited = false;
  }

  // score part
  bingo() {
    this.score++;
    this.showScore();
  }


  killTile(row, col) {
    let tile = this.matrix[row][col];
    if(tile) {
      let el = tile.el;
      if(el) el.classList.add("killed");
      this.matrix[row][col] = null;
    }
    this.clearHint();
  }

  //line between pair
  killPath(points) {
    this.$ctx.beginPath();
    this.$ctx.moveTo(
      points[0].x * (this.width + this.gap) + this.width / 2,
      points[0].y * (this.height + this.gap) + this.height / 2
    );

    for (let i = 0; i < points.length - 1; i++) {
      let a = points[i];
      let b = points[i + 1];

      this.$ctx.lineTo(
        b.x * (this.width + this.gap) + this.width / 2,
        b.y * (this.height + this.gap) + this.height / 2
      );

      if (a.x === b.x) {
          // col
          let min = Math.min(a.y, b.y);
          let max = Math.max(a.y, b.y);
          for (let j = min; j <= max; j++) {
              this.killTile(j, a.x);
          }
      } else {
          // row
          let min = Math.min(a.x, b.x);
          let max = Math.max(a.x, b.x);
          for (let j = min; j <= max; j++) {
              this.killTile(a.y, j);
          }
      }
    }

    this.$ctx.stroke();

    let self = this;
    setTimeout(function() {
      self.$ctx.save();
      self.$ctx.translate(
        -self.width + -self.gap,
        -self.height + -self.gap
      );
      self.$ctx.clearRect(0, 0, self.$canvas.width, self.$canvas.height);
      self.$ctx.restore();
    }, 200);

    if (this.hintCount === 0) {
      oHint.classList.add("grey");
      oHint.removeEventListener("click", getHint);
      return;
    } else {
      oHint.classList.remove("grey");
      oHint.addEventListener("click", getHint);
    }

  }


  isLinkable(pointA, pointB) {
    let linkable;

    // No turn
    linkable = this.isDirectLink(pointA, pointB);
    if(linkable) return linkable;

    // 1 turn
    linkable = this.isOneTurnLinked(pointA, pointB);
    if(linkable) return [linkable];

    // 2 turns
    linkable = this.isTwoTurnLinked(pointA, pointB);
    if(linkable) return linkable;

    return false;
  }

  isAdjacent(pointA, pointB) {
    return ((pointA.x === pointB.x) && Math.abs(pointA.y - pointB.y) === 1) ||
        ((pointA.y === pointB.y) && Math.abs(pointA.x - pointB.x) === 1);
  }

  isDirectLink(pointA, pointB) {
    if(!(pointA.x === pointB.x || pointA.y === pointB.y)) return false;
    if(this.isAdjacent(pointA, pointB)) return true;

    let linkable = true;

    if(pointA.y === pointB.y) {
      // Same row
      let min = Math.min(pointA.x, pointB.x);
      let max = Math.max(pointA.x, pointB.x);
      for (let i = min + 1; i < max; i++) {
        if(this.matrix[pointA.y][i]) {
          linkable = false;
          break;
        }
      }
    } else {
      // Same col
      let min = Math.min(pointA.y, pointB.y);
      let max = Math.max(pointA.y, pointB.y);
      for (let i = min + 1; i < max; i++) {
        if(this.matrix[i][pointA.x]) {
          linkable = false;
          break;
        }
      }
    }
    return linkable;
  }

  isOneTurnLinked(pointA, pointB) {
    let point1 = {
      x: pointB.x,
      y: pointA.y
    };

    let point2 = {
      x: pointA.x,
      y: pointB.y
    };

    if (!this.matrix[point1.y][point1.x] && this.isDirectLink(pointA, point1) && this.isDirectLink(pointB, point1)) return point1;
    if (!this.matrix[point2.y][point2.x] && this.isDirectLink(pointA, point2) && this.isDirectLink(pointB, point2)) return point2;
    return false;
  }

  isTwoTurnLinked(pointA, pointB) {
    let point1, point2;

    //up
    for (let i = pointA.y - 1; i >= -1; i--) {
        point1 = {
            x: pointA.x,
            y: i
        };
        if (this.matrix[point1.y][point1.x]) break;
        point2 = this.isOneTurnLinked(point1, pointB);
        if (point2) break;
    }
    if (point2) return [point1, point2];

    //down
    for (let i = pointA.y + 1; i <= this.rows; i++) {
        point1 = {
            x: pointA.x,
            y: i
        };
        if (this.matrix[point1.y][point1.x]) break;
        point2 = this.isOneTurnLinked(point1, pointB);
        if (point2) break;
    }
    if (point2) return [point1, point2];


    //left
    for (var i = pointA.x - 1; i >= -1; i--) {
        point1 = {
            x: i,
            y: pointA.y
        };
        if (this.matrix[point1.y][point1.x]) break;
        point2 = this.isOneTurnLinked(point1, pointB);
        if (point2) break;
    }
    if (point2) return [point1, point2];

    //right
    for (var i = pointA.x + 1; i <= this.cols; i++) {
        point1 = {
            x: i,
            y: pointA.y
        };
        if (this.matrix[point1.y][point1.x]) break;
        point2 = this.isOneTurnLinked(point1, pointB);
        if (point2) break;
    }
    if (point2) return [point1, point2];

    return false;
  }

  findPair() {
    let pair = false;
    let rows = this.rows;
    let cols = this.cols;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let pointA = {
          x: col,
          y: row
        };

        if(!this.matrix[row][col]) continue;
        let aType = this.matrix[row][col].type;
        for (let row2 = 0; row2 < rows; row2++) {
          for (let col2 = 0; col2 < cols; col2++) {
            let pointB = {
              x: col2,
              y: row2
            };
            if (!this.matrix[row2][col2]) continue;
            var bType = this.matrix[row2][col2].type;
            if ((aType != bType) || (row == row2 && col == col2)) continue;
            var linkable = this.isLinkable(pointA, pointB);
            if (linkable) {
                pair = [pointA, pointB];
                break;
            };
          }
          if (pair) break;
        }
        if (pair) break;
      }
      if (pair) break;
    }
    return pair;
  }

  showHint() {
    const pair = this.findPair();

    if (!pair) {
      return;
    }

    let tile1 = this.matrix[pair[0].y][pair[0].x];
    let tile2 = this.matrix[pair[1].y][pair[1].x];

    this.hintPair = [tile1, tile2]

    tile1.el.classList.add("showhint");
    tile2.el.classList.add("showhint");

    this.hintCount--;
    oHintCount.innerHTML = this.hintCount;
    if (this.hintCount === 0) {
      oHint.classList.add("grey");
      oHint.removeEventListener("click", getHint);
      return;
    }
    oHint.classList.add("grey");
    oHint.removeEventListener("click", getHint);
  }

  clearHint() {
    if (this.hintPair.length === 0) {
      return;
    }
    this.hintPair[0].el.classList.remove("showhint");
    this.hintPair[1].el.classList.remove("showhint");
  }
}

// Turn off the double tap zoom
let lastTouchEnd = 0;
document.documentElement.addEventListener('touchend', function(event) {
  let now = Date.now();
  if(now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);


// init game
let match;
let playing = false;
let unlimited = false;

let oFakeStage = document.getElementById("fakeStage");
let oHint = document.querySelector("#hint");
let oHintCount = document.querySelector("#hintCount");

let oStart = document.getElementById("start");
oStart.onclick = function() {
  oFakeStage.style.display = "none";
  if(!playing) {
    match = new Match();
    match.init("#stage", { $time: "#time" });
    match.play();

    initHint();

    playing = true;
  }
};

let oUnlimited = document.getElementById("unlimited");
let oTime = document.getElementById("time");
oFakeStage.onclick = oUnlimited.onclick = function() {
  oFakeStage.style.display = "none";
  unlimited = true;
  if(!playing) {
    match = new Match();
    oTime.innerHTML = "No time limit";
    match.init("#stage", { $time: "#time" });
    match.play();

    initHint();

    playing = true;
  }
};

// Get hint
function getHint() {
  match.showHint();
}

function initHint() {
  // oHint.style.visibility = "visible";
  // oHint.style.display = "block";
  oHint.classList.remove("grey");
  oHintCount.innerHTML = match.hintCount;
  oHint.addEventListener("click", getHint);
}



// let oHowtoplay = document.getElementById("howtoplay");
// let oIntro = document.getElementById("intro");
// let introDisplaying = true;
//
// oHowtoplay.onclick = function() {
//   introDisplaying = !introDisplaying;
//   if(introDisplaying) {
//     oIntro.style.display = "flex";
//     oHowtoplay.innerHTML = "Hide the Guide";
//   } else {
//     oIntro.style.display = "none";
//     oHowtoplay.innerHTML = "How to Play";
//   }
// };


// Welcome Modal
const welcomeModal = document.querySelector('#welcome-modal');
const modalScreen = document.querySelector('.modal-screen');
const oSkip = document.querySelector('#model-skip');

const oPrev = document.querySelector("#model-prev");
const oNext = document.querySelector("#model-next");
const oTutorial = document.querySelector("#tutorial");

const oModelSteps = document.querySelectorAll(".model-step");
const oModelStart = document.querySelector("#model-start");

const oGuides = document.querySelectorAll(".guide");
let pageCount = 0;

//reset pageCount
function resetModal() {
  pageCount = 0;
  oGuides.forEach(guide => {
    guide.style.display="none";
  });
  oGuides[0].style.display="block";
  welcomeModal.classList.remove("is-open");
  if (pageCount > 0) {
    oPrev.style.display="block";
  } else {
    oPrev.style.display="none";
  }

  if (pageCount < 3) {
    oNext.style.display="block";
  } else {
    oNext.style.display="none";
  }

  resetSteps();
  oModelSteps[0].classList.add("color");
}

// reset model footer step color
function resetSteps() {
  oModelSteps.forEach(step => {
    step.classList.remove("color");
  })
}

// Open modal
oTutorial.addEventListener("click", function() {
  welcomeModal.classList.add("is-open");
});

// close modal
modalScreen.addEventListener("click", resetModal);
oSkip.addEventListener("click", resetModal);
oModelStart.addEventListener("click", resetModal);

// oModelSteps.forEach((step, idx) => {
//   step.addEventListener("click", function(){
//     resetSteps();
//     step.classList.add("color");
//     pageCount = idx;
//     oGuides.forEach(guide => {
//       guide.style.display="none";
//     });
//     oGuides[pageCount].style.display="block";
//   })
// })
// next button
oNext.addEventListener("click", function() {
  pageCount++;
  if (pageCount > 0) {
    oPrev.style.display="block";
  } else {
    oPrev.style.display="none";
  }
  resetSteps();
  oModelSteps[pageCount].classList.add("color");

  oGuides.forEach(guide => {
    guide.style.display="none";
  });
  oGuides[pageCount].style.display="block";
  if (pageCount >= 3) {
    oNext.style.display="none";
    pageCount = 3;
  }
});

// prev button
oPrev.addEventListener("click", function() {
  pageCount--;

  console.log(pageCount)

  resetSteps();
  oModelSteps[pageCount].classList.add("color");

  if (pageCount < 4) {
    oNext.style.display="block";
  } else {
    oNext.style.display="none";
  }


  oGuides.forEach(guide => {
    guide.style.display="none";
  })

  oGuides[pageCount].style.display="block";

  if (pageCount <= 0) {
    oPrev.style.display="none";
    pageCount = 0;
  }
});

// music
const oBgm = document.getElementById('bgm');
const oClickEffect = document.getElementById('clickEffect');
const oMusicBtn = document.querySelector("#music");
const oMusicOnOff = document.querySelector("#musicOnOff");



oBgm.loop = true;
oBgm.volume = 0.5;
oClickEffect.volume = 0.6;
let bgmPlay = true;

oMusicBtn.addEventListener("click", function() {
  if(bgmPlay) {
    bgm.play();
    bgmPlay = false;
    oMusicOnOff.classList.remove("fa-play");
    oMusicOnOff.classList.add("fa-pause");
  } else {
    bgm.pause();
    bgmPlay = true;
    // oMusicOnOff.innerHTML="ON";
    oMusicOnOff.classList.remove("fa-pause");
    oMusicOnOff.classList.add("fa-play");
  }
});
