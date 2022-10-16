package main.t3;

import java.util.Objects;

/**
 * T3Actions are agent-specified manipulations on the game board such that they
 * indicate which column, row, (both 0 indexed), and number / move they would
 * like to make. T3Actions implement Comparable and are ordered in ascending
 * column, row, then move number.
 * 
 * [!] Note: Implements the Comparable interface such that T3Actions are ordered
 * according to the tiebreaking criteria specified in the spec!
 */
public class T3Action implements Comparable<T3Action> {
    
    private int col, row, move;
    
    /**
     * Constructs a new T3Action with the given column,
     * row, and move number, though this may be an invalid
     * action in the current state (checked by the T3State class)
     * @param col 0-index column to place a number within
     * @param row 0-index row to place a number within
     * @param move Number to place in the desired coordinates
     */
    public T3Action(int col, int row, int move) {
        this.col = col;
        this.row = row;
        this.move = move;
    }
    
    /**
     * Returns the column of this action.
     * 
     * @return The column this action occupies.
     */
    public int col () {
        return this.col;
    }
    
    /**
     * Returns the row of this action.
     * 
     * @return The row this action occupies.
     */
    public int row () {
        return this.row;
    }
    
    /**
     * Returns the number that was placed in the given row/col.
     * 
     * @return The number placed by this move.
     */
    public int move () {
        return this.move;
    }
    
    /**
     * Implements the tiebreaking ordering as specified in the spec.
     * 
     * @param other
     *            The other T3Action compared.
     * @return Whether this T3Action is greater, less than, or equal to other in
     *         ranked priority.
     */
    @Override
    public int compareTo(T3Action other) {
        int colDiff = this.col - other.col,
                rowDiff = this.row - other.row,
                movDiff = this.move - other.move;
        if (colDiff != 0) { return colDiff; }
        if (rowDiff != 0) { return rowDiff; }
        else { return movDiff; }
    }

    @Override
    public String toString () {
        return "(" + col + "," + row + ") = " + move;
    }
    
    @Override
    public boolean equals (Object other) {
        if (other == this) { return true; }
        if (!(other instanceof T3Action)) { return false; }
        T3Action otherCast = (T3Action) other;
        return this.col == otherCast.col && this.row == otherCast.row && this.move == otherCast.move;
    }
    
    @Override
    public int hashCode () {
        return Objects.hash(this.col, this.row, this.move);
    }
    
}
