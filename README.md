# Welcome to Match-match

[Match Match Live](https://match-match.herokuapp.com/)

![index](https://res.cloudinary.com/chengzii/image/upload/c_scale,w_400/v1524243125/match_index.jpg)


## Background and Overview
Match-match is inspired by the game "A pair of cards", known as neurasthenia in Japan. It refers to a pattern matching puzzle game in various forms such as card games, electronic games, or online games.

Game rules:
Player clicks a piece in the board, the piece is "selected". The player then clicks another piece. These two pieces will be eliminated if they have the same images and meet any of the following conditions:
  1. horizontal/vertical connectivity: two pieces can be connected horizontally or vertically without any other piece between them (see 1 in illustration)
  2. one turn connectivity: two pieces can be connected in one turn without any piece between them (see 2 in illustration)
  3. two-turn connectivity: two pieces can be connected in two turns without any piece between them (see 3 in illustration)
  4. out-of-grid connectivity: two pieces can be connected in two-turn with one link outside the grid (see 4 in illustration)
If the two selected pieces do not meet the above requirement, they will be "unselected" and player starts a new round.
The game ends when all pieces are eliminated.
![eliminate_logic](https://res.cloudinary.com/chengzii/image/upload/v1523856497/1.png)
![eliminate_logic](https://match-match.herokuapp.com/gif/3lines.gif)
![eliminate_logic](https://match-match.herokuapp.com/gif/2lines.gif)



## Eliminate Logic
![eliminate_logic](https://res.cloudinary.com/chengzii/image/upload/v1523856497/2.png)
![eliminate_logic](https://res.cloudinary.com/chengzii/image/upload/v1523856497/3.png)
![eliminate_logic](https://res.cloudinary.com/chengzii/image/upload/v1523856497/4.png)
![eliminate_logic](https://res.cloudinary.com/chengzii/image/upload/v1523856497/5.png)

## Features
- Player can selected two tiles. There is connecting lines between the matched pieces.
- The introduction can be hide.
- Five levels with different difficulty.
- Countdown time limit for each level
- Two play models, one is no time limit for better user experience

## Technologies
- Vanilla JavaScript for overall structure and game logic
- HTML5 Canvas for DOM manipulation and rendering
- CSS3 Transform for eliminated effects

## Furture additions
- Music during playing and mute button
- If the player stuck for a certain time, show a hint link
