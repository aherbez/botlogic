# Botlogic

Implements a game in the style of knights/knaves puzzles. Each playthrough starts with three robots, each one of which always tells the truth, or always lies. One of the robots is guilty of something, and it's the player's job to find out who did it.

Note that the status of a given robot as a liar/truth teller has nothing to do with their guilt or innocence. To determine that, one must read the clues carefully and reason it out.

## Controls

To get a new clue, either click on the "GET NEXT CLUE" box or hit the N key. Note that there is a delay between each clue to prevent the player from spamming the new clue button. This also provides an incentive to solve the puzzle using fewer clues.

If you have more clues than fit on the screen, use the UP and DOWN arrow keys to move between them.

Once you think you know who did it, eithe click on the robot, or select them via keys 1, 2, or 3. 

Once you've guessed, the correct (guilty) robot will be surrounded by a green circle and the two incorrect ones will be crossed out. Also, all of the clues will turn to either a green backgroud (indicating that it was true) or a red one (indicating that it was a lie).

## Live demo

To see it in action, head [here](http://adrianherbez.net/botlogic/)
