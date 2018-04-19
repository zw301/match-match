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
    //check if playing
    // this.playing = false;
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
    oLevel.innerHTML = "LEVEL: " + this.level;
  }

  showScore(){
    let oScore = document.getElementById("score");
    oScore.innerHTML = "SCORE: " + this.score;
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

    for (let index = 0; index < length; index++) {
      rand = this.random_choose(0, index);
      if( rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = array[index];
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
    // this.showLevel();
    clearInterval(this.timer);

    function transitionendHandler(event) {
      let target = event.target;
      if(target.classList.contains("killed") && target.parentNode) {
        // console.log(target)
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
  }

  build() {
    // console.log(`types: ${this.types}`);
    // console.log(`level: ${this.level}`);
    this.showLevel();

    if(!unlimited) {
      this.timeLeft = this.time;
      this.$time.innerHTML = "Time Left: " + this.getFormattedTime(this.timeLeft);
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

    ////for testing
    // function uniq(arr) {
    //   let result = [];
    //   for (var i = 0; i < arr.length; i++) {
    //     if(!result.includes(arr[i])) {
    //       result.push(arr[i]);
    //     }
    //   }
    //   return result;
    // }
    //
    // console.log(uniq(tiles));

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
    // console.log(this.matrix);

    Array.prototype.forEach.call(this.$stage.querySelectorAll(".tile"), function(tile) {
      tile.parentNode.removeChild(tile);
    });

    this.$stage.appendChild(fragment);
  }


  handleClick(event) {
    // if(!this.playing) return;
    let self = this;
    let curr = event.target;
    curr.classList.toggle("selected");

    if(curr.classList.contains("selected")) {
      if(this.selected) {
        let prev = this.selected;
        if(curr.type == prev.type) {
          let linkable = this.checkLinkable(prev, curr);
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
              if(this.level === 6) {
                // alert("YOU WIN!!!")
                oFakeStage.style.display = "block";
                oFakeStage.innerHTML = "You Win!!!";
                unlimited = false;
                clearTimeout(this.timer);
                // this.$time.innerHTML = "Time Left: " + this.getFormattedTime(this.timeLeft);
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
      this.$time.innerHTML = "Time Left: " + this.getFormattedTime(this.timeLeft);
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
    // this.timeLeft = this.time;
    // this.$time.innerHTML = "Time Left: " + this.getFormattedTime(this.timeLeft);
    // clearTimeout(this.timer);
    // this.timer = setTimeout(function() {
    //   self.countdown();
    // }, 1000);
    this.build();
    // this.playing = true;
  }


  over() {
      // this.playing = false;
      // alert("Time's Up! \nScore: " + this.score);
      oFakeStage.innerHTML = "Time's Up!";
      oFakeStage.style.display = "block";
      playing = false;
      unlimited = false;
      // this.build();
      // this.showLevel();
  }

  // parameter remove type
  bingo() {
    this.score++;
    // let oScore = document.getElementById("score");
    // oScore.innerHTML = "SCORE: " + this.score;
    this.showScore();
  }


  killTile(row, col) {
    let tile = this.matrix[row][col];
    if(tile) {
      let el = tile.el;
      if(el) el.classList.add("killed");
      this.matrix[row][col] = null;
    }
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

  }


  checkLinkable(a, b) {
    let linkable;

    // No turn
    linkable = this.checkOneLineLinkable(a, b);
    if(linkable) return linkable;

    // 1 turn
    linkable = this.checkTwoLineLinkable(a, b);
    if(linkable) return [linkable];

    // 2 turns
    linkable = this.checkThreeLineLinkable(a, b);
    if(linkable) return linkable;

    return false;
  }

  checkSiblingLinkable(a, b) {
    return ((a.x === b.x) && Math.abs(a.y - b.y) === 1) ||
        ((a.y === b.y) && Math.abs(a.x - b.x) === 1);
  }

  checkOneLineLinkable(a, b) {
    if(!(a.x === b.x || a.y === b.y)) return false;
    if(this.checkSiblingLinkable(a, b)) return true;

    let linkable = true;

    if(a.y === b.y) {
      // Same row
      let min = Math.min(a.x, b.x);
      let max = Math.max(a.x, b.x);
      for (let i = min + 1; i < max; i++) {
        if(this.matrix[a.y][i]) {
          linkable = false;
          break;
        }
      }
    } else {
      // Same col
      let min = Math.min(a.y, b.y);
      let max = Math.max(a.y, b.y);
      for (let i = min + 1; i < max; i++) {
        if(this.matrix[i][a.x]) {
          linkable = false;
          break;
        }
      }
    }
    return linkable;
  }

  checkTwoLineLinkable(a, b) {
    let point1 = {
      x: b.x,
      y: a.y
    };

    let point2 = {
      x: a.x,
      y: b.y
    };

    if (!this.matrix[point1.y][point1.x] && this.checkOneLineLinkable(a, point1) && this.checkOneLineLinkable(b, point1)) return point1;
    if (!this.matrix[point2.y][point2.x] && this.checkOneLineLinkable(a, point2) && this.checkOneLineLinkable(b, point2)) return point2;
    return false;
  }

  checkThreeLineLinkable(a, b) {
    let point1, point2;

    //up
    for (let i = a.y - 1; i >= -1; i--) {
        point1 = {
            x: a.x,
            y: i
        };
        if (this.matrix[point1.y][point1.x]) break;
        point2 = this.checkTwoLineLinkable(point1, b);
        if (point2) break;
    }
    if (point2) return [point1, point2];

    //down
    for (let i = a.y + 1; i <= this.rows; i++) {
        point1 = {
            x: a.x,
            y: i
        };
        if (this.matrix[point1.y][point1.x]) break;
        point2 = this.checkTwoLineLinkable(point1, b);
        if (point2) break;
    }
    if (point2) return [point1, point2];


    //left
    for (var i = a.x - 1; i >= -1; i--) {
        point1 = {
            x: i,
            y: a.y
        };
        if (this.matrix[point1.y][point1.x]) break;
        point2 = this.checkTwoLineLinkable(point1, b);
        if (point2) break;
    }
    if (point2) return [point1, point2];

    //right
    for (var i = a.x + 1; i <= this.cols; i++) {
        point1 = {
            x: i,
            y: a.y
        };
        if (this.matrix[point1.y][point1.x]) break;
        point2 = this.checkTwoLineLinkable(point1, b);
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
        let a = {
          x: col,
          y: row
        };

        if(!this.matrix[row][col]) continue;
        let aType = this.matrix[row][col].type;
        for (let row2 = 0; row2 < rows; row2++) {
          for (let col2 = 0; col2 < cols; col2++) {
            let b = {
              x: col2,
              y: row2
            };
            if (!this.matrix[row2][col2]) continue;
            var bType = this.matrix[row2][col2].type;
            if ((aType != bType) || (row == row2 && col == col2)) continue;
            var linkable = this.checkLinkable(a, b);
            if (linkable) {
                pair = [a, b];
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

}


let match;
let playing = false;
let unlimited = false;

let oFakeStage = document.getElementById("fakeStage");

let oStart = document.getElementById("start");
oStart.onclick = function() {
  oFakeStage.style.display = "none";
  if(!playing) {
    match = new Match();
    match.init("#stage", { $time: "#time" });
    match.play();
    playing = true;
  }
};

let oUnlimited = document.getElementById("unlimited");
let oTime = document.getElementById("time");
oUnlimited.onclick = function() {
  oFakeStage.style.display = "none";
  unlimited = true;
  if(!playing) {
    match = new Match();
    oTime.innerHTML = "";
    match.init("#stage", { $time: "#time" });
    match.play();
    playing = true;
  }
};
