package main.t3;

import java.util.*;

/**
 * Artificial Intelligence responsible for playing the game of T3!
 * Implements the alpha-beta-pruning mini-max search algorithm
 */
public class T3Player {
    
    /**
     * Workhorse of an AI T3Player's choice mechanics that, given a game state,
     * makes the optimal choice from that state as defined by the mechanics of the
     * game of Tic-Tac-Total. Note: In the event that multiple moves have
     * equivalently maximal minimax scores, ties are broken by move col, then row,
     * then move number in ascending order (see spec and unit tests for more info).
     * The agent will also always take an immediately winning move over a delayed
     * one (e.g., 2 moves in the future).
     * 
     * @param state
     *            The state from which the T3Player is making a move decision.
     * @return The T3Player's optimal action.
     */
    public T3Action choose (T3State state) {
    	//arguments state, which is a two-dimensional array
    	//runs alpha-beta pruning until the terminal nodes to search for the optimum path
        T3Action theAnswer  = new T3Action(-1,-1,0);
        
        //Find out all the allowed <T3Action, T3State> for next
        Map<T3Action, T3State> firstNextActionStatePair = state.getTransitions();
        
        //check out possible <T3Action, T3State>, if value/T3State is winning or tied, return key/T3Action
        for (Map.Entry<T3Action, T3State> xEntry:firstNextActionStatePair.entrySet()) {
        	if (firstNextActionStatePair.get(xEntry.getKey()).isWin()) {
        		return xEntry.getKey();
        	}
        }
        
        //Since all the T3Action cannot make player win right away
        //We shall examine T3Action, according to its priority, one by one 
        //until we find one to result in a T3 State from which opponent cannot win by 1-depth T3Action
        
        //Building priority queue of all the allowed T3Actions
        PriorityQueue<T3Action> actionQueuePriorityQueue = new PriorityQueue<>();
        for (Map.Entry<T3Action, T3State> xEntry:firstNextActionStatePair.entrySet()) {
        	actionQueuePriorityQueue.offer(xEntry.getKey());
        }
        Boolean checkAlong = true;
        T3Action dueAction = new T3Action(-1,-1,0);
        T3State dueState = firstNextActionStatePair.get(dueAction);
        
        while (!actionQueuePriorityQueue.isEmpty() && checkAlong) {
        	checkAlong = false;
        	dueAction = actionQueuePriorityQueue.poll();
        	dueState = firstNextActionStatePair.get(dueAction);
        	
        	Map<T3Action, T3State> secondNextActionStatePair = dueState.getTransitions();
        	
        	//check out possible <T3Action, T3State> , if value/T3State is winning or tied, return key/T3Action
        	
        	for (Map.Entry<T3Action, T3State> xEntry : secondNextActionStatePair.entrySet()) {
        		if (secondNextActionStatePair.get(xEntry.getKey()).isWin()) {
        			checkAlong = true; 
        			//opponent wins with just one step after dueAction
        			// shall check other T3Action in queue
        			break;
        		}
        	}
        }
        theAnswer = dueAction;
        return theAnswer;
        
    }
    
    // TODO: Implement your alpha-beta pruning recursive helper here!
    
   
    
}

