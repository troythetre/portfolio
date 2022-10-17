package main.pathfinder.informed.trikey;

import java.util.*;

/**
 * Specifies the Maze Grid pathfinding problem including the actions,
 * transitions, goal test, and solution test. Can be fed as an input to a Search
 * algorithm to find and then test a solution.
 */
public class MazeProblem {

    // Fields
    // -----------------------------------------------------------------------------
    private String[] maze;
    private int rows, cols;
    private final MazeState INITIAL_STATE;
    private final Set<MazeState> KEY_PIECES;
    private static final Map<String, MazeState> TRANS_MAP = createTransitions();
    private static final Set<String> KEY_TILES = new HashSet<>(Arrays.asList("1", "2", "3"));

    /**
     * @return Creates the transition map that maps String actions to MazeState
     *         offsets, of the format: { "U": (0, -1), "D": (0, +1), "L": (-1, 0),
     *         "R": (+1, 0) }
     */
    private static final Map<String, MazeState> createTransitions() {
        Map<String, MazeState> result = new HashMap<>();
        result.put("U", new MazeState(0, -1, null));
        result.put("D", new MazeState(0, 1, null));
        result.put("L", new MazeState(-1, 0, null));
        result.put("R", new MazeState(1, 0, null));
        return result;
    }

    // Constructor
    // -----------------------------------------------------------------------------

    /**
     * Constructs a new MazeProblem from the given maze; responsible for finding the
     * initial state, mud tiles, and key pieces, storing these in the MazeProblem
     * state.
     * 
     * @param maze An array of Strings in which characters represent the legal maze
     *             entities, including:<br>
     *             'X': A wall, 'I': The initial state, '.': an open spot, 'M': A
     *             mud tile, '1', '2', '3': The three key pieces For example, a
     *             valid maze might look like:
     * 
     *             <pre>
     *             String[] maze = { "XXXXXXX", "X..M..X", "XIX1X.X", "XX2X..X", "X3....X", "XXXXXXX" };
     *             </pre>
     */
    public MazeProblem(String[] maze) {
        this.maze = maze;
        this.rows = maze.length;
        this.cols = (rows == 0) ? 0 : maze[0].length();
        MazeState foundInitial = null;
        Set<MazeState> keys = new HashSet<>();

        // Find the initial and goal state in the given maze, and then
        // store in fields once found
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                char cell = maze[row].charAt(col);
                switch (cell) {
                case 'I':
                    foundInitial = new MazeState(col, row, null);
                    break;
                case '1':
                case '2':
                case '3':
                    keys.add(new MazeState(col, row, "" + cell));
                    break;
                case '.':
                case 'X':
                case 'M':
                    break;
                default:
                    throw new IllegalArgumentException("Maze formatted invalidly");
                }
            }
        }
        INITIAL_STATE = foundInitial;
        KEY_PIECES = keys;
    }

    // Methods
    // -----------------------------------------------------------------------------

    /**
     * Returns the MazeState containing the initial state (the starting position of
     * the pathfinder)
     * 
     * @return The MazeState containing the initial state.
     */
    public MazeState getInitial() {
        return this.INITIAL_STATE;
    }

    /**
     * Returns the Set of MazeStates containing the keys in the maze.
     * 
     * @return Set of MazeStates containing Keys.
     */
    public Set<MazeState> getKeyStates() {
        return this.KEY_PIECES;
    }

    /**
     * Returns the Set of String tiles representing the different key pieces. i.e.,
     * <code>{"1", "2", "3"}</code>
     * 
     * @return The set of String key tiles as they appear in the maze.
     */
    public Set<String> getKeyTiles() {
        return KEY_TILES;
    }

    /**
     * Returns the cost associated with entering the given state. Actions that move
     * into this state incur that cost.
     * 
     * @param state A MazeState in the maze.
     * @return The cost associated with moving into the given state.
     */
    public int getCost(MazeState state) {
        switch (maze[state.row()].charAt(state.col())) {
        case 'M':
            return 3;
        default:
            return 1;
        }
    }

    /**
     * Returns a map of the states that can be reached from the given input state
     * using any of the available actions.
     * 
     * @param state A MazeState (col, row) representing the current state from which
     *              actions can be taken
     * @return Map A map of actions to the states that they lead to, of the format,
     *         for current MazeState (c, r):<br>
     *         { "U": (c, r-1), "D": (c, r+1), "L": (c-1, r), "R": (c+1, r) }
     */
    public Map<String, MazeState> getTransitions(MazeState state) {
        // Store transitions as a Map between actions ("U", "D", ...) and
        // the MazeStates that they result in from state
        Map<String, MazeState> result = new HashMap<>();

        // For each of the possible directions (stored in TRANS_MAP), test
        // to see if it is a valid transition
        for (Map.Entry<String, MazeState> action : TRANS_MAP.entrySet()) {
            MazeState actionMod = action.getValue(), newState = new MazeState(state.col(), state.row(), null);
            newState = newState.add(actionMod);
            String tile = "" + this.maze[newState.row()].charAt(newState.col());
            String keyState = (KEY_TILES.contains(tile)) ? tile : null;

            // If the given state *is* a valid transition (i.e., within
            // map bounds and no wall at the position)...
            if (newState.row() >= 0 && newState.row() < rows && newState.col() >= 0 && newState.col() < cols
                    && maze[newState.row()].charAt(newState.col()) != 'X') {
                // ...then add it to the result!
                result.put(action.getKey(), new MazeState(newState.col(), newState.row(), keyState));
            }
        }
        return result;
    }

    /**
     * Given a possibleSoln, tests to ensure that it is indeed a solution to this
     * MazeProblem, as well as returning the cost.
     * 
     * @param possibleSoln A possible solution to test, which is a list of actions
     *                     of the format: ["U", "D", "D", "L", ...]
     * @return A 2-element array of ints of the format [isSoln, cost] where:<br>
     *         isSoln will be 0 if it is not a solution, and 1 if it is<br>
     *         cost will be an integer denoting the cost of the given solution to
     *         test optimality
     */
    public int[] testSolution(List<String> possibleSoln) {
        if (possibleSoln == null) {
            throw new IllegalArgumentException(
                    "Tried to test a solution but the solution was null (you said there was no solution)");
        }

        // Update the "moving state" that begins at the start and is modified by the
        // transitions
        MazeState movingState = new MazeState(INITIAL_STATE.col(), INITIAL_STATE.row(), null);
        Set<String> collectedKeys = new HashSet<>();
        int cost = 0;
        int[] result = { 0, -1 };

        // For each action, modify the movingState, and then check that we have landed
        // in
        // a legal position in this maze
        for (String action : possibleSoln) {
            MazeState actionMod = TRANS_MAP.get(action);
            movingState = movingState.add(actionMod);
            String tile = "" + maze[movingState.row()].charAt(movingState.col());
            if (tile.equals("X")) {
                return result;
            }
            if (KEY_TILES.contains(tile)) {
                collectedKeys.add(tile);
            }
            cost += getCost(movingState);
        }
        result[0] = collectedKeys.equals(KEY_TILES) ? 1 : 0;
        result[1] = cost;
        return result;
    }

}
