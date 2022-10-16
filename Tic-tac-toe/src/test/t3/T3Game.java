package test.t3;

import java.util.*;
import java.util.stream.Stream;
import main.t3.*;

/**
 * Interactive game for T3 that provides UI, IO, and prompts both
 * player and agent for their action choices as the game progresses.
 * You can run this to test your agent, or play against it!
 */
public class T3Game {
    
    public static void main (String[] args) {
        Scanner input = new Scanner(System.in);
        
        // Game State & Agent Setup:
        T3Player ai = new T3Player();
        T3State state = new T3State(true);
        T3Action act;
        boolean playersTurn = true;
        
        System.out.println("================================");
        System.out.println("=              T3              =");
        System.out.println("================================");
        
        // Continue to pull stones as long as there are some remaining
        while (!(state.isTie() || state.isWin())) {
            System.out.println(state);
            
            // Player's turn
            if (playersTurn) {
                System.out.println("Enter three space-separated numbers in format: COL ROW NUMBER ");
                System.out.print("[Player's Turn: Move Options " + Arrays.toString(state.getMoves()) + "] > ");
                String playerAct = input.nextLine();
                int[] parsedAct  = Stream.of(playerAct.split(" ")).mapToInt(Integer::parseInt).toArray();
                act = new T3Action(parsedAct[0], parsedAct[1], parsedAct[2]);
                if (parsedAct.length != 3 || !state.isValidAction(act)) {
                    System.out.println("[X] Improper move, l2p. Try again.");
                    continue;
                }
            
            // Agent's turn
            } else {
                act = ai.choose(state);
                System.out.println("[Opponent's Turn] > " + act);
            }
            
            state = state.getNextState(act);
            playersTurn = !playersTurn;
        }
        
        System.out.println(state);
        System.out.println(state.isWin() ? (playersTurn ? "[L] You Lose!" : "[W] You Win!") : "[T] Tie Game!");
        input.close();
    }

}
