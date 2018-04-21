
# Welcome to Match Match <img src="http://res.cloudinary.com/chengzii/image/upload/v1524030787/match.png" width="25" />

[Click here to play](https://match-match.herokuapp.com/)

## Background and Overview <img src="http://res.cloudinary.com/chengzii/image/upload/v1524030787/match.png" width="25" />
`Match Match` is inspired by the game "A pair of cards", known as neurasthenia in Japan. It refers to a pattern matching puzzle game in various forms such as card games, electronic games, or online games.

Game Rules:
Player clicks a piece in the board, the piece is "selected". The player then clicks another piece. These two pieces will be eliminated if they have the same images and meet any of the following conditions:
  1. horizontal/vertical connectivity: two pieces can be connected horizontally or vertically without any other piece between them (see 1 in illustration)
  2. one turn connectivity: two pieces can be connected in one turn without any piece between them (see 2 in illustration)
  3. two-turn connectivity: two pieces can be connected in two turns without any piece between them (see 3 in illustration)
  4. out-of-grid connectivity: two pieces can be connected in two-turn with one link outside the grid (see 4 in illustration)
If the two selected pieces do not meet the above requirement, they will be "unselected" and player starts a new round.
The game ends when all pieces are eliminated.
<p align="center">
<img src="https://match-match.herokuapp.com/gif/3lines.gif" width="400" />
<img src="https://match-match.herokuapp.com/gif/2lines.gif" width="400" style="float: left; /></p>



## How to Eliminate <img src="http://res.cloudinary.com/chengzii/image/upload/v1524030787/match.png" width="25" />
## How to Eliminate <img src="http://res.cloudinary.com/chengzii/image/upload/v1524030787/match.png" width="25" />



<p align="center"><img src="https://res.cloudinary.com/chengzii/image/upload/v1523856497/1.png" width="800" /></p>
<p align="center"><img src="https://res.cloudinary.com/chengzii/image/upload/v1523856497/2.png" width="440" style="float: left;/></p>
<p align="center"><img src="https://res.cloudinary.com/chengzii/image/upload/v1523856497/3.png" width="440" style="float: left; /></p>
<p align="center"><img src="https://res.cloudinary.com/chengzii/image/upload/v1524245762/4.png" width="440" style="float: left;/></p>
<p align="center"><img src="https://res.cloudinary.com/chengzii/image/upload/v1523856497/5.png" width="440" style="float: left; /></p>


## Sample Link Logic <img src="http://res.cloudinary.com/chengzii/image/upload/v1524030787/match.png" width="25" />
## Sample Link Logic <img src="http://res.cloudinary.com/chengzii/image/upload/v1524030787/match.png" width="25" />

```JS
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

```

## Features <img src="http://res.cloudinary.com/chengzii/image/upload/v1524030787/match.png" width="25" />
- Player can selected two tiles. There is connecting lines between the matched pieces.
- The introduction can be hide.
- Five levels with different difficulty.
- Countdown time limit for each level
- Two play models, one is no time limit for better user experience

## Technologies <img src="http://res.cloudinary.com/chengzii/image/upload/v1524030787/match.png" width="25" />
- Vanilla JavaScript for overall structure and game logic
- HTML5 Canvas for DOM manipulation and rendering
- CSS3 Transform for eliminated effects


## Furture additions <img src="http://res.cloudinary.com/chengzii/image/upload/v1524030787/match.png" width="25" />
- Music during playing and mute button
- If the player stuck for a certain time, show a hint link
