package main.pathfinder.informed.trikey;

/**
 * Maze Pathfinding representation of a given state, i.e., an occupiable
 * position in the given maze.
 */
public class MazeState {

    private int col, row;
    private final String KEY_PIECE;

    /**
     * Constructs a new MazeState, which tracks the given row and column that it
     * represents in the Maze.<br>
     * <b>NOTE: Row 0, Column 0 is located at the upper-left-hand corner of the
     * maze!</b>
     * 
     * @param col      Integer column number of this state (X coord in a Cartesian
     *                 plane)
     * @param row      Integer row number of this state (Y coord in a Cartesian
     *                 plane)
     * @param keyPiece a String storing the key piece stored at this location, null
     *                 if no key stored here
     */
    public MazeState(int col, int row, String keyPiece) {
        this.col = col;
        this.row = row;
        this.KEY_PIECE = keyPiece;
    }

    /**
     * Getter for this maze state's column
     * 
     * @return The column index
     */
    public int col() {
        return this.col;
    }

    /**
     * Getter for this maze state's row
     * 
     * @return The row index
     */
    public int row() {
        return this.row;
    }

    /**
     * Getter for whether or not this state has a Key Piece in it, and if so,
     * returns the piece stored at this position
     * 
     * @return The key piece at this state's position, or null if no key
     */
    public String keyPiece() {
        return this.KEY_PIECE;
    }

    /**
     * Adds the coordinates of the given other MazeState to this one's and returns a
     * new MazeState that is the result
     * 
     * @param other The other MazeState to add to this one.
     * @return The new MazeState from adding the other's coords to this one.
     */
    public MazeState add(MazeState other) {
        MazeState result = new MazeState(this.col, this.row, this.KEY_PIECE);
        result.col += other.col;
        result.row += other.row;
        return result;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }

        return other.getClass() == this.getClass()
                ? this.row == ((MazeState) other).row && this.col == ((MazeState) other).col
                : false;
    }

    @Override
    public int hashCode() {
        return row * col;
    }

    @Override
    public String toString() {
        return "(" + col + ", " + row + ")" + ((this.KEY_PIECE != null) ? "[K" + this.KEY_PIECE + "]" : "");
    }

}
