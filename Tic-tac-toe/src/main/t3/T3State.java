package main.t3;

import java.util.*;
import java.util.stream.IntStream;

/**
 * Representation of the T3 grid board-state, which player's turn (odds / evens),
 * and ability to obtain the actions and transitions possible (among other state
 * utility methods).
 */
public class T3State {
    
    // Private Fields
    // -----------------------------------------------------------------------------
    private int[][] state;
    private boolean isOddsTurn;
    
    // Private Constants
    // -----------------------------------------------------------------------------
    private static final int MAX_MOVE = 6;
    private static final int WIN_TARGET = 13;
    
    // Constructors
    // -----------------------------------------------------------------------------
    
    /**
     * Creates a new empty T3 board (no moves played) with the specified player's
     * turn as the next to act.
     * 
     * @param isOddsTurn
     *            Whether or not the current player is the one playing the odd
     *            numbers.
     */
    public T3State (boolean isOddsTurn) {
        this.state = new int[3][3];
        this.isOddsTurn = isOddsTurn;
    }
    
    /**
     * Creates a new pre-specified T3 board with the specified player's turn as the
     * next to act.
     * 
     * @param isOddsTurn
     *            Whether or not the current player is the one playing the odd
     *            numbers.
     * @param state
     *            The pre-specified board state
     */
    public T3State (boolean isOddsTurn, int[][] state) {
        this.state = state;
        this.isOddsTurn = isOddsTurn;
    }
    
    // Methods
    // -----------------------------------------------------------------------------
    
    /**
     * Determines if the provided action is legal within this state, as decided by
     * whether or not the col and row are in range of the board, that spot is not
     * occupied, and whether the move number is within the set of allowable player
     * actions on the given turn.
     * 
     * @param act
     *            The action being judged for legality
     * @return true if act is legal from this state, false otherwise
     */
    public boolean isValidAction (T3Action act) {
        return act.col() >= 0 && act.col() < state.length && 
               act.row() >= 0 && act.col() < state[0].length &&
               act.move() >= 0 && act.move() <= MAX_MOVE &&
               ((this.isOddsTurn) ? act.move() % 2 == 1 : act.move() % 2 == 0) &&
               state[act.row()][act.col()] == 0;
    }
    
    /**
     * Returns the next state that would be generated from the calling one after
     * taking the provided action (assuming it is legal). Note: this returns a new
     * state and is not a mutator of the caller.
     * 
     * @param act
     *            The action to take from the given state.
     * @return The next board state having taken the given action.
     * @throws IllegalArgumentException
     *             if the given action is invalid
     */
    public T3State getNextState (T3Action act) {
        if (!isValidAction(act)) {
            throw new IllegalArgumentException("Chosen action " + act + " is invalid!");
        }
        
        T3State nextState = this.clone();
        nextState.state[act.row()][act.col()] = act.move();
        nextState.isOddsTurn = ! this.isOddsTurn;
        return nextState;
    }
    
    /**
     * Private helper that returns a list of (x, y) = (c, r) tuples indicating the
     * open tiles in the current board state.
     * 
     * @return The list of open board locations
     */
    private ArrayList<int[]> getOpenTiles () {
        ArrayList<int[]> results = new ArrayList<>();
        // Probably a better way to do this with streams but meh...
        for (int r = 0; r < this.state.length; r++) {
            for (int c = 0; c < this.state[0].length; c++) {
                if (this.state[r][c] == 0) {
                    int[] loc = {c, r};
                    results.add(loc); 
                }
            }
        }
        return results;
    }
    
    /**
     * Returns the set (in this case, just a small array) of allowable actions that
     * the current player can take from this given state.
     * 
     * @return An array of the possible numbers that can be placed, e.g. [1, 3, 5]
     *         for odds.
     */
    public int[] getMoves () {
        return IntStream.range(1, MAX_MOVE+1).filter(i -> (this.isOddsTurn) ? i % 2 == 1 : i % 2 == 0).toArray();
    }
    
    /**
     * Returns a Map of transitions from the current state in which the map's keys
     * are the legal actions from the calling state, and their values are the
     * next-states that would be reached from this one by taking that action. Note:
     * Returns a TreeMap such that iterating over its key-value pairs is done in
     * sorted order according to the keys (T3Actions).
     * 
     * @return The map of legal actions to the next states that they lead.
     */
    public Map<T3Action,T3State> getTransitions () {
        // [!] TODO
        Map<T3Action, T3State> transitionResult = new HashMap<>();
        ArrayList<int[]> openTile = getOpenTiles();
        int[] allowedMove = getMoves();
        for (int i=0; i<openTile.size();i++) {
        	for (int j=0; j<allowedMove.length;j++) {
	        	int[] openTileColRow = openTile.get(i);
	        	T3Action constructedT3Action = new T3Action(openTileColRow[0], openTileColRow[1], allowedMove[j]);
	        	T3State nextState;
	        	if (isValidAction(constructedT3Action)) {
	        		nextState = getNextState(constructedT3Action);
	        		transitionResult.put(constructedT3Action, nextState);
	        	}
        	}
        	
        }
        return transitionResult;
       
    }
    
    /**
     * Determines if any of the cols, rows, and diagonals in the given state sum to
     * the WIN_TARGET amount (default: 13), and if so, concludes that this is a
     * winning state for whomever made the move that generated it.
     * 
     * [!] NOTE: This returns whether or not the state is a win for ANY player. Users
     * must determine which agent was the winner in the context of minimax search.
     * 
     * @return true if the state is a winning terminal, false otherwise
     */
    public boolean isWin () {
        return Arrays.asList(
            IntStream.range(0, 3).map(i -> state[i][0]).sum(), // col 0
            IntStream.range(0, 3).map(i -> state[i][1]).sum(), // col 1
            IntStream.range(0, 3).map(i -> state[i][2]).sum(), // col 2
            IntStream.range(0, 3).map(i -> state[i][i]).sum(), // diag TL->BR
            IntStream.range(0, 3).map(i -> state[0+i][2-i]).sum(), // diag TR->BL
            IntStream.of(state[0]).sum(), // row0
            IntStream.of(state[1]).sum(), // row1
            IntStream.of(state[2]).sum()  // row2
        ).contains(WIN_TARGET);
    }
    
    /**
     * Determines if the board state represents a tie game, meaning that all spots
     * have been filled by moves and there is no winner.
     * 
     * @return true if a tie game, false otherwise
     */
    public boolean isTie () {
        return !(this.isWin()) && ! Arrays.stream(this.state).flatMapToInt(Arrays::stream).anyMatch(i -> i == 0);
    }
    
    /**
     * Returns a deep copy of this T3State
     * 
     * @return A deep copy of this T3State
     */
    @Override
    public T3State clone () {
        T3State copy = new T3State(this.isOddsTurn);
        for (int i = 0; i < state.length; i++) {
            copy.state[i] = state[i].clone();
        }
        return copy;
    }
    
    /**
     * Returns the grid-display of this state and its placed moves.
     * 
     * @return The grid display of the already placed moves
     */
    @Override
    public String toString () {
        String result = "";
        for (int[] r : this.state) {
            result += Arrays.toString(r) + "\n";
        }
        return result;
    }
    
    @Override
    public boolean equals (Object other) {
        if (other == this) { return true; }
        if (!(other instanceof T3State)) { return false; }
        T3State otherCast = (T3State) other;
        return this.isOddsTurn == otherCast.isOddsTurn && Arrays.deepEquals(this.state, otherCast.state);
    }
    
    @Override
    public int hashCode () {
        return Objects.hash(this.state, this.isOddsTurn);
    }
    
}
