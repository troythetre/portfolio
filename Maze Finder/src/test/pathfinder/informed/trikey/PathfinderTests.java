package test.pathfinder.informed.trikey;

import static org.junit.Assert.*;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TestWatcher;
import org.junit.rules.Timeout;
import org.junit.runner.Description;

import java.util.*;
import main.pathfinder.informed.trikey.*;

/**
 * Unit tests for Maze Pathfinder. Tests include completeness and
 * optimality.
 */
public class PathfinderTests {
    
    // =================================================
    // Test Configurations
    // =================================================
    
    public static final String SOL_ERR = "Returned solution does not solve the maze",
                               OPT_ERR = "Returned solution is suboptimal",
                               NOS_ERR = "Returned a solution where there wasn't one";
    
    // Global timeout to prevent infinite loops from
    // crashing the test suite, plus, tests to make sure
    // you're not implementing anything too computationally
    // crazy
    // [!] WARNING: Comment out these next two lines to use
    //     the debugger! Otherwise, it'll stop after 1 sec.
    @Rule
    public Timeout globalTimeout = Timeout.seconds(1);
    
    // Each time you pass a test, you get a point! Yay!
    // [!] Requires JUnit 4+ to run
    @Rule
    public TestWatcher watchman = new TestWatcher() {
        @Override
        protected void succeeded(Description description) {
            passed++;
        }
    };
    
    // Grade record-keeping
    static int possible = 0, passed = 0;
    
    // the @Before method is run before every @Test
    @Before
    public void init () {
        possible++;
    }
    
    // Used for grading, reports the total number of tests
    // passed over the total possible
    @AfterClass
    public static void gradeReport () {
        System.out.println("============================");
        System.out.println("Tests Complete");
        System.out.println(passed + " / " + possible + " passed!");
        if ((1.0 * passed / possible) >= 0.9) {
            System.out.println("[!] Nice job!"); // Automated acclaim!
        }
        System.out.println("============================");
    }
    
    
    // =================================================
    // Unit Tests
    // =================================================
    
    @Test
    public void testPathfinder_t0() {
        String[] maze = {
        //   0123456
            "XXXXXXX", // 0
            "XI.1.2X", // 1
            "X.....X", // 2
            "X.X.X3X", // 3
            "XXXXXXX"  // 4
        };
        MazeProblem prob = new MazeProblem(maze);
        List<String> solution = Pathfinder.solve(prob);
        
        // result will be a 2-tuple (isSolution, cost) where
        // - isSolution = 0 if it is not, 1 if it is
        // - cost = numerical cost of proposed solution
        int[] result = prob.testSolution(solution);
        assertEquals(SOL_ERR, 1, result[0]); // Test that result is a solution
        assertEquals(OPT_ERR, 6, result[1]); // Ensure that the solution is optimal
    }
    
    @Test
    public void testPathfinder_t1() {
        // Doesn't matter what order you collect the key pieces as long as it's
        // the optimal path between the three pieces
        String[] maze = {
        //   0123456
            "XXXXXXX", // 0
            "XI.3.2X", // 1
            "X.....X", // 2
            "X.X.X1X", // 3
            "XXXXXXX"  // 4
        };
        MazeProblem prob = new MazeProblem(maze);
        List<String> solution = Pathfinder.solve(prob);
        
        int[] result = prob.testSolution(solution);
        assertEquals(SOL_ERR, 1, result[0]); // Test that result is a solution
        assertEquals(OPT_ERR, 6, result[1]); // Ensure that the solution is optimal
    }
    
    @Test
    public void testPathfinder_t2() {
        String[] maze = {
        //   0123456
            "XXXXXXX", // 0
            "XI....X", // 1
            "X.MMM2X", // 2
            "X.X1X3X", // 3
            "XXXXXXX"  // 4
        };
        MazeProblem prob = new MazeProblem(maze);
        List<String> solution = Pathfinder.solve(prob);
        
        int[] result = prob.testSolution(solution);
        assertEquals(SOL_ERR, 1, result[0]); // Test that result is a solution
        assertEquals(OPT_ERR, 14, result[1]); // Ensure that the solution is optimal
    }
    
    @Test
    public void testPathfinder_t3() {
        String[] maze = {
        //   0123456
            "XXXXXXX", // 0
            "XI.3..X", // 1
            "XMMMM.X", // 2
            "X2X1X.X", // 3
            "XXXXXXX"  // 4
        };
        MazeProblem prob = new MazeProblem(maze);
        List<String> solution = Pathfinder.solve(prob);
        
        int[] result = prob.testSolution(solution);
        assertEquals(SOL_ERR, 1, result[0]); // Test that result is a solution
        assertEquals(OPT_ERR, 14, result[1]); // Ensure that the solution is optimal
    }
    
    @Test
    public void testPathfinder_t4() {
        String[] maze = {
        //   0123456
            "XXXXXXX", // 0
            "XI.3..X", // 1
            "X.MMM.X", // 2
            "X2X.X1X", // 3
            "XXXXXXX"  // 4
        };
        MazeProblem prob = new MazeProblem(maze);
        List<String> solution = Pathfinder.solve(prob);
        
        int[] result = prob.testSolution(solution);
        assertEquals(SOL_ERR, 1, result[0]); // Test that result is a solution
        assertEquals(OPT_ERR, 10, result[1]); // Ensure that the solution is optimal
    }
    
    @Test
    public void testPathfinder_t5() {
        String[] maze = {
        //   0123456
            "XXXXXXX", // 0
            "XI.3..X", // 1
            "X.MXM.X", // 2
            "X2X1X.X", // 3
            "XXXXXXX"  // 4
        };
        MazeProblem prob = new MazeProblem(maze);
        List<String> solution = Pathfinder.solve(prob);
        
        assertNull(NOS_ERR, solution); // Ensure that Pathfinder knows when there's no solution
    }
    
}
