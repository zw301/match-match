# Match-match

[Match Match Live](https://match-match.herokuapp.com/)

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
![eliminate_logic](http://res.cloudinary.com/chengzii/image/upload/v1523856497/1.png)


## Functionality & MVP
In Match-match, the player can:
- [ ] Click a piece and it will render to "selected" state.
- [ ] If two "selected" pieces do not have the same images, both will be "unselected".
- [ ] If two "selected" pieces are connected, a link between these two will be displayed for 1 second.
- [ ] Statistics display: number of pairs eliminated, game level, etc.
- [ ] Multiple difficulty levels: size of game board, number of images, etc.


## Wireframes
![wireframe](http://res.cloudinary.com/chengzii/image/upload/v1523859159/wireframe.png)

## Eliminate Logic
![eliminate_logic](http://res.cloudinary.com/chengzii/image/upload/v1523856497/2.png)
![eliminate_logic](http://res.cloudinary.com/chengzii/image/upload/v1523856497/3.png)
![eliminate_logic](http://res.cloudinary.com/chengzii/image/upload/v1523856497/4.png)
![eliminate_logic](http://res.cloudinary.com/chengzii/image/upload/v1523856497/5.png)


## Architecture and Technologies
This project will be implemented with:

- Vanilla JavaScript for overall structure and game logic
- HTML5 Canvas for DOM manipulation and rendering
- Webpack to bundle and serve up the various scripts.


## Implementation Timeline

### Over the weekend:
- [x] learn how Canvas works
- [x] design algorithm for the game

### Day 1:
Setup all necessary Node modules, including getting webpack up and running. Create webpack.config.js as well as package.json. Write a basic entry file and the bare bones of project.
- [x] Create basic visual frames
- [x] Build the structure of the game

### Day 2:
This day is dedicated to writing the
- [x] Complete the initialize of pieces
- [x] Write function to generate new game
- [x] Complete the pair validation function
- [x] Start on elimination logic

### Day 3:
This day is dedicated to writing the pair logic for two pieces.
- [x] Complete on elimination logic
- [x] Generate the connecting line during elimination
- [x] Game over function


### Day 4:
Deploy and test components
- [x] Create harder level when player completes the previous one
- [x] Style the project
- [x] Write introduction and illustrate how to play the game
- [x] Production README

## Bonus Features
- [x] Set the countdown time limit for each level
- [x] Add no time limit model for better user experience
- [ ] If the player stuck for a certain time, show a hint link
