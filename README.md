# 2d_game

## Bacteria Blaster

Game made using web gl. 

To play download source code and run index.html


## How the game works

![alt text](https://github.com/Rileyccc/2d_game/blob/main/gamePlayImages/gameplay1.png)

This is an image of the start of the game. there is a disk centered in the origin, and bacteria growing on the edges. you begin with two health bars and a score of zero. and 20 bacteria left before you win. 
In order to when all bacteria must be destroyed by clicking on them with the mouse. If a bacteria is not clicked and its radius reaches a certain threshold the bacteria is destroyed and the player loses one health bar. the score is calculated by the (radius threshold - radius) * gamemultiplier, so the smaller the bacteria is when destroyed results in higher points. if a bacteria reaches this threshold there will be a deduction of 50 points.  

![alt text](https://github.com/Rileyccc/2d_game/blob/main/gamePlayImages/gameplay2.png)

here is an example of the particles which shoot out of a bacteria when it is destroyed.

![alt text](https://github.com/Rileyccc/2d_game/blob/main/gamePlayImages/gameplay3.png)

when two bacteria collid the larger one will consume the smaller one

![alt text](https://github.com/Rileyccc/2d_game/blob/main/gamePlayImages/gameplay4.png)

Here is the winning screen when all bacteria have been eliminated and the user still has atleast one live remaining.

![alt text](https://github.com/Rileyccc/2d_game/blob/main/gamePlayImages/gameplay5.png)

Here is the losing screen which oucurs when user loses both lives before removing all bacteria







