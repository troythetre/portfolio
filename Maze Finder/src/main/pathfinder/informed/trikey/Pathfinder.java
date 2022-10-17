package main.pathfinder.informed.trikey;

import java.util.*;

/**
 * Maze Pathfinding algorithm that implements a basic, uninformed, breadth-first
 * tree search.
 */
public class Pathfinder {

    /**
     * Given a MazeProblem, which specifies the actions and transitions available in
     * the search, returns a solution to the problem as a sequence of actions that
     * leads from the initial state to the collection of all three key pieces.
     * 
     * @param problem A MazeProblem that specifies the maze, actions, transitions.
     * @return A List of Strings representing actions that solve the problem of the
     *         format: ["R", "R", "L", ...]
     */
    public static List<String> solve(MazeProblem problem) {
        List<String> solution = new ArrayList<>();


        //Build priority queue - frontier
        PriorityQueue<SearchTreeNode> frontier = new PriorityQueue<>();
        //stores all the key states if could be visited
        Set<MazeState> collectedKeyState = new HashSet<>();
        //initial state
        SearchTreeNode head = new SearchTreeNode(problem.getInitial(),"", null,0,
                collectedKeyState,100); 
        head.parent = head;
        frontier.offer(head);

        // Use BFS to check whether each Key could be found
        for (MazeState scanKeyState: problem.getKeyStates()){
            int priorityNum = 0;
            Boolean keyFound = false; //true if key is found remains false if not, which implies no solution cannot be found
            Set<MazeState> visitedState = new HashSet<>();

            while (!frontier.isEmpty()){
                SearchTreeNode current = frontier.poll();
                visitedState.add(current.state);

                if (scanKeyState.equals(current.state)){
                    keyFound = true;
                    break;
                }

                Map<String,MazeState> expandingResult = problem.getTransitions(current.state);
                for (Map.Entry<String, MazeState> scanResult: expandingResult.entrySet()){
                    MazeState childState = scanResult.getValue();
                    String childAction = current.action + scanResult.getKey();
                    SearchTreeNode childParent = current;
                    int childGn =0;
                    Set<MazeState> childCollectedKeyState = new HashSet<>();
                    priorityNum += 1;
                    int childFn = priorityNum;

                    SearchTreeNode childNode = new SearchTreeNode(childState,childAction,childParent,
                            childGn,childCollectedKeyState,childFn);
                    if (!(visitedState.contains(childState))){
                          frontier.offer(childNode);
                    }
                }
            }
            if (! keyFound) {
                //solution.add("No Solution found");
                return null;
            }
        }


        frontier.clear();
        frontier.offer(head);

        while (!frontier.isEmpty()){
              SearchTreeNode current = frontier.poll();
              if ( problem.getKeyStates().equals(current.collectedKeyState) ){
                  //current.action: {DDUURRRDD}
                  // solution {D, D, U, U, R, R, R, D, D}
                  for (int j = 0; j<current.action.length(); j++){
                      solution.add(Character.toString (current.action.charAt(j)));
                  }
                  return solution;
              }
              // <"u",(6,2)> <"R",(7,1)> ....
              Map<String,MazeState> expandingResult = problem.getTransitions(current.state);

              //for (ElementClass variableName: {element1, element2,element3} )

              for (Map.Entry<String, MazeState> scanElement: expandingResult.entrySet()  )    {
                   MazeState childState = scanElement.getValue();
                   String childAction = current.action + scanElement.getKey();
                   SearchTreeNode childParent = current;
                   int childGn = current.gn + problem.getCost(current.state);

                   Set<MazeState> childCollectedKeyState = new HashSet<>();
                   childCollectedKeyState.addAll(current.collectedKeyState);
                   if (problem.getKeyStates().contains(childState)){
                       childCollectedKeyState.add(childState);
                   }

                   // int childHn is related to child state, childSetOgKeyState, problem
                   // the method is ManhattanDistance
                   int childHn = ManhattanDistance(childState, childCollectedKeyState, problem);
                   int childFn = childGn+childHn;

                  SearchTreeNode childNode = new SearchTreeNode(childState, childAction,childParent,childGn,childCollectedKeyState,childFn);
                  frontier.offer(childNode);
              }
        }
        return solution;
    }

    /**
     * SearchTreeNode private static nested class that is used in the Search
     * algorithm to construct the Search tree.
     * [!] You may do whatever you want with this class -- in fact, you'll need 
     * to add a lot for a successful and efficient solution!
     */
    private static class SearchTreeNode implements Comparable<SearchTreeNode> {

        MazeState state;
        String action;
        SearchTreeNode parent;
        int gn;
        Set<MazeState> collectedKeyState = new HashSet<>();
        int fn;

        /**
         * Constructs a new SearchTreeNode to be used in the Search Tree.
         * 
         * @param state  The MazeState (row, col) that this node represents.
         * @param action The action that *led to* this state / node.
         * @param parent Reference to parent SearchTreeNode in the Search Tree.
         */
        SearchTreeNode(MazeState state, String action, SearchTreeNode parent,
                       int gn, Set<MazeState> collectedKeyState, int fn) {
            this.state = state;
            this.action = action;
            this.parent = parent;
            this.gn=gn;
            this.collectedKeyState=collectedKeyState;
            this.fn=fn;
        }
        @Override
        public int compareTo(SearchTreeNode other){
            if (this.fn > other.fn)
                return 1;
            else if (this.fn < other.fn)
                return -1;
            else
                return  0;
        }
        // reference video for priority queue  https://www.youtube.com/watch?v=LDZc3Bph1vw&t=219s
    }

    public static int ManhattanDistance(MazeState childMazeState, Set<MazeState> childCollectedKeyState, MazeProblem problem){
                  int distanceM = 0;

                  for (MazeState scanState:  problem.getKeyStates()){
                      if (!childCollectedKeyState.contains((scanState))) {
                          distanceM += Math.abs(childMazeState.col() - scanState.col()) + Math.abs(childMazeState.row() - scanState.row());
                      }
                  }
                  return distanceM;
    }

}