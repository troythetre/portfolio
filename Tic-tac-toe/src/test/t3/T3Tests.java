package test.t3;

import static org.junit.Assert.*;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TestWatcher;
import org.junit.rules.Timeout;
import org.junit.runner.Description;

import main.t3.*;

/**
 * Unit tests for T3Player behavior.
 */
public class T3Tests {
    
    // =================================================
    // Test Configuration
    // =================================================
    
    // Global timeout to prevent infinite loops from
    // crashing the test suite + to test that your
    // alpha-beta pruning is working;
    // If they are, 10 seconds should be more than enough for
    // every test except the empty board as odds
    // [!] You might want to comment these lines out while
    // developing, just so you know whether or not you're
    // inefficient or bugged!
    @Rule
    public Timeout globalTimeout = Timeout.seconds(10);
    
    // Grade record-keeping
    static int possible = 0, passed = 0;
    
    // the @Before method is run before every @Test
    @Before
    public void init () {
        possible++;
    }
    
    // Each time you pass a test, you get a point! Yay!
    // [!] Requires JUnit 4+ to run
    @Rule
    public TestWatcher watchman = new TestWatcher() {
        @Override
        protected void succeeded(Description description) {
            passed++;
        }
    };
    
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
    
    
    /**
     * Basic test to make sure the AI knows the
     * base cases: how to win when presented with the
     * opportunity
     */
    
    @Test
    public void T3PlayerTest_t0() {
        T3Player t3p = new T3Player();
        int[][] state = {
            {2, 1, 0},
            {0, 0, 0},
            {0, 0, 6}
        };
        T3State s = new T3State(true, state);
        T3Action a = t3p.choose(s);
        assertEquals(new T3Action(1, 1, 5), a);
    }
    
    @Test
    public void T3PlayerTest_t1() {
        T3Player t3p = new T3Player();
        int[][] state = {
            {2, 1, 0},
            {0, 5, 0},
            {0, 0, 0}
        };
        T3State s = new T3State(false, state);
        T3Action a = t3p.choose(s);
        assertEquals(new T3Action(2, 2, 6), a);
    }
    
    @Test
    public void T3PlayerTest_t2() {
        T3Player t3p = new T3Player();
        int[][] state = {
            {0, 1, 0},
            {0, 5, 0},
            {0, 0, 6}
        };
        T3State s = new T3State(false, state);
        T3Action a = t3p.choose(s);
        assertEquals(new T3Action(0, 0, 2), a);
    }
    
    /**
     * Tests to make sure the move-quality-tiebreaking
     * is properly implemented, wherein multiple moves
     * may be available to the agent
     */
    
    @Test
    public void T3PlayerTest_t3() {
        T3Player t3p = new T3Player();
        int[][] state = {
            {0, 0, 0},
            {0, 5, 0},
            {0, 0, 0}
        };
        T3State s = new T3State(false, state);
        T3Action a = t3p.choose(s);
        assertEquals(new T3Action(0, 0, 2), a);
    }
    
    @Test
    public void T3PlayerTest_t4() {
        T3Player t3p = new T3Player();
        int[][] state = {
            {3, 0, 0},
            {0, 4, 0},
            {0, 0, 1}
        };
        T3State s = new T3State(false, state);
        T3Action a = t3p.choose(s);
        assertEquals(new T3Action(0, 1, 2), a);
    }
    
    // ... more for you to test!
    
}
