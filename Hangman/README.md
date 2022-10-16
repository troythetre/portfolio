**CMSI 1010** Computer Programming & Laboratory, Fall 2021

# Problem Set 6
**Due 11:59pm PT 12/3**

## Reading
As before, the reading is from the [_Think Python_ textbook](http://greenteapress.com/thinkpython2/thinkpython2.pdf):
* Chapter 18

Optionally, take notes from these readings and submit them as part of this pset. If you opt to do this, you may submit them as a separate file `ps6_notes.txt`/`ps6_notes.md` or you may add them directly to this README file. (files that end in `.md` look best when written in [GitHub Markdown](https://guides.github.com/features/mastering-markdown/))

## Programming

0. **Understanding Inheritance**
    This is a paper and pencil exercise—please edit this file at the indicated locations with your answers.

    Consider the following code:

    ```python
    class Spell(object):
        def __init__(self, incantation, name):
            self.name = name
            self.incantation = incantation

        def __str__(self):
            return self.name + ' ' + self.incantation + '\n' + self.get_description()

        def get_description(self):
            return 'No description'

        def execute(self):
            print(self.incantation)

    class Accio(Spell):
        def __init__(self):
            Spell.__init__(self, 'Accio', 'Summoning Charm')

    class Confundo(Spell):
        def __init__(self):
            Spell.__init__(self, 'Confundo', 'Confundus Charm')

        def get_description(self):
            return 'Causes the victim to become confused and befuddled.'

    def study_spell(spell):
        print(spell)

    spell = Accio()
    spell.execute()
    study_spell(spell)
    study_spell(Confundo())
    ```

    1. What are the parent and child classes here?

        ```
        The parent class is Spell(object) while the children classes are Accio(Spell) and Confundo(Spell)
        ```

    2. What does the code print out? (Try figuring it out without running it in Python.) Please mention which lines of code are printing which lines of output.

        ```
        In line 49, "spell.execute()" will print out "Accio"
        In line 50, study_spell(spell) will print out "Summoning Charm Accio" then print out "No description" in the following line
        In line 51, study_spell(Confundo()) will print out "Confundus Charm Confundo" then print out "Causes the victim to become confused and befuddled." in the following line
        ```

    3. Which `get_description` method is called when `study_spell(Confundo())` is executed? Why?

        ```
        When called "study_spell(Confundo())", the "get_description" inside class Confundo(Spell) is called because it's inside the class of "Confundo(Spell)".
        ```

    4. What do we need to do so that `print Accio()` will print the appropriate description (`This charm summons an object to the caster, potentially over a significant distance`)?  Write down the code that we need to add and/or change.

        ```
        Inside the parent class of Spell(object), def__str__(self) will become "This " + "an object to the caster, potentially over a significant distance"
        ```

1. **Hangman Game**—`hangman.py`

    This is a challenging problem, so make full use of the time that has been allotted and try your best 😊

    1. **Overview of the hangman template:** Take a look at `hangman.py`. We’re going to start by storing the state of the game in variables. The state is a complete description of all the information about the game. For Hangman, we need to store three pieces of information:

        * `secret_word`: The word they are trying to guess (string).
        * `letters_guessed`: The letters that they have guessed so far (list).
        * `mistakes_made`: The number of incorrect guesses made so far (int).

        You can find the variables already in `hangman.py`, under the section `GAME VARIABLES`. For now, the `secret_word` is set as `'claptrap'`. Once we’ve finished our program and gotten it working, we’ll change `secret_word = 'claptrap'` to be `get_word()`, a function that pulls a random word from the file `words.txt`. This function is already defined for you. (This is called incremental programming—instead of trying to get everything right the first time, we’ll get the basic program working, then incrementally add small portions of code.) `'claptrap'` was selected because it’s reasonably long and has duplicate letters. Hopefully that will allow us to catch any bugs we might make.

        **Question**: Why can’t we use `len(letters_guessed)` for `mistakes_made`?

        Note the constant variable underneath the helper code: `MAX_GUESSES = 6`. Constant just means that we won’t change it. This isn’t enforced by Python, so be careful not to accidentally change the value of `MAX_GUESSES`. Good style is to put variables we don’t plan to change in all capital letters. We can decide what to do with this at the end. For example, should we have “easy,” “medium,” and “hard” modes with different numbers of max guesses? As the programmer, it’s up to you to decide!

    2. **Understanding the `HangmanBoard` class:** In the template, we have created a `HangmanBoard` class. The `HangmanBoard` class contains all the visual elements of the Hangman game, but none of the logic elements. When you first run `play_hangman()`, you'll see the starting board—try it now!

        Compare the starting board and the code to identify which variables correspond to which elements. Take a screenshot of the starting board, and then mark and label the different Graphics objects with their corresponding variable names in the code. Upload the annotated image to this repository as `hangman-starter.EXT` (with `EXT` depending on the image type, like `jpg` or `png`) then edit the line below to match your image’s file extension. If the edit is correct, the image will appear below (it appears broken for now):

        ![Annotated starter hangman board](./hangman-starter.EXT)

        Also note the methods in the `HangmanBoard` and what they do. _**Hint:** You will need to use them later!_ How do you get what the user guessed? How do you show the user the letters they have guessed? How do you show the user how many wrong guesses they have made?

    3. **Completing the `HangmanBoard` class:** Most of the class has been written for you, but you need to fill in the missing code to finish the `HangmanBoard` class! The template has a default of six (6) guesses and a suggestion of how to draw each failed attempt, but it is up to you to create the graphics.

        1. Fill in the `HangmanBoard` methods that ask for `YOUR CODE HERE`.

        2. You may notice there isn’t a way for us to give instructions or feedback to the user. What are all the situations in which you will want to show the user some text? (For example, you might want to give them feedback on their guess, or let them know when the game is over.) List them:

            ```
            Replace this section with your answer. For best results, preserve the
            indentation and stay between the ``` delimiters.
            ```

        3. Add an attribute (instance variable) to the `HangmanBoard` class that you can use to show the user feedback. You can display it wherever you want, but there is some room under the `guess` Text object.

        4. Add a method to the `HangmanBoard` class that allows you to update your feedback text.

    4. **Coding the `word_guessed()` function:** Now find the function `word_guessed()`. Fill in the code for `word_guessed()` using `secret_word` and `letters_guessed` so that it returns `True` if the player has successfully guessed the word, and `False` otherwise.

        Example: Assume our `secret_word` is `'claptrap'`. If the `letters_guessed` variable has the value

        ```python
        ['a', 'l', 'm', 'c', 'e', 't', 'r', 'p', 'n']
        ```

        …`word_guessed()` will return `True`. If `letters_guessed` has the value

        ```python
        ['e', 'l', 'q', 't', 'r', 'p', 'n']
        ```

        …`word_guessed()` will return `False`.

        **Hint:** You will want to use a loop. There are two things you could loop over—the letters in `secret_word`, or the letters in `letters_guessed`. Which one do you want to loop over? Don’t just guess here, think! One of them makes sense and will be a lot easier than the other.

    5. **String methods:** We’ll refresh our memory on two methods: `lower()` and `join()`. Test them out using the code below either in `python3` or in a Colab Jupyter notebook:

        ```python
        lst = ["a", "b", "c", "D"]
        joined_result = ' '.join(lst)
        # What is joined_result?
        joined_result.lower()
        # What is joined_result.lower()?
        ```

    6. **Coding the `get_guessed()` function:** Define the function `get_guessed()` that returns a string that contains the word with a dash `'-'` in place of letters not guessed yet.

        Examples:

        * If the `letters_guessed` variable has the value `[]`, then `get_guessed()` will return `'--------'`.
        * If `letters_guessed` has the value `['a', 'p']`, then `get_guessed()` will return `'--ap--ap'`.
        * If `letters_guessed` has the value `['a', 'l', 'm', 'c', 'e', 't', 'r', 'p', 'n']`, then `get_guessed()` will return `'claptrap'`.

        **Hint:** There are multiple ways to go about this. You may want to iterate through `secret_word` and check each letter one-by-one to see if it has been guessed. You can build a string or a list as you go.

    7. **Planning the `play_hangman()` function:** Write the main game code in `play_hangman()`. It helps to informally sketch out the code you want to write—this is called “pseudocode:” an outline of what you are going to code that helps to guide you when you begin writing code. Here’s a rough sketch of pseudocode, although _it is missing some important details and steps_:

        ```
        create a hangman board object
        continually loop:
            update guessed word so far
            update used letters

            get user's guess
            check: has letter already been guessed?
                if so, what should I do?
                if not, what should I do?

            check: is letter in word?
                if so, what should I do?
                if not, what should I do?
        ```

        Building on the above outline, write out detailed pseudocode as comments in your `play_hangman()` function that explains what you want your game to do at each step.

        **Hint:** What should you do if the guess is not legal? Should the guesses be case sensitive?

        **Hint:** When does the game end? You will probably need to use a `break` statement to quit out of the continual loop!

    8. **Coding the `play_hangman()` function:** Once you have your pseudocode, fill in the real code! When you have a working hangman game, you are done!

        **Congratulations—you’ve finished the game! Have fun playing** 😄

2. **(optional—extra credit) Hangman enhancements**

    When you are finished with the core game, consider the following optional enhancements for extra credit. You may choose to do any or all of them, and in any order.

    * _Optional—extra credit:_ Making your game even more awesome: Don't use the word `'claptrap'` every time! Use the `get_word()` function (and remove the line that sets `secret_word` as `'claptrap'`) so that your secret word will be a new, random word each time.

    * _Optional—extra credit:_ Make your game more user-friendly using the `graphics` module! Maybe you want to add text to make it clear where and how the user should guess. You could also add colors, better “hangman” drawings, or whatever you like!

    * _Optional—extra credit:_ Allow the user the option of guessing the full word early (perhaps by letting the user type the word “guess” to try and guess the full word). Then, allow the user a try to enter in the full word. You may want to take off 2 guesses if they enter an incorrect word…

## What to turn in
1. Submit the electronic copy of any files that you created/modified on your clone. In the Terminal (within your repository clone folder), type these commands. Note that you may repeat these add-commit-push sequences as frequently as you like, based on your progress:
    ```bash
    git add README.md            # For written/image answers to questions.
    git add hangman-starter.png  # Or .pdf or .jpg, depending on file format.
    git add ps6_notes.md         # If submitting reading notes as a separate file.
    git add hangman.py
    git commit -m "adding files for ps6" # Ideally, personalize this!
    git push
    # By all means, feel free to add/commit/push multiple times before the due date.
    ```

2. Edit this _README.md_ file to include your answers to the following questions:
    * **Number of hours spent** working on this pset:
    * (Optional) Feel free to let us know what you liked/disliked about this pset, what you learned, etc:

## Points breakdown
| Category | Points |
| -------- | -----: |
| Written answers | 2 points each, 10 points total |
| `hangman-starter` image | 4 points |
| `hangman.py` | 20 points |
| Notes (optional) | 5 points extra credit |
| `get_word()` (optional) | 3 points extra credit |
| Improved graphics (optional) | 5 points extra credit |
| Early guess (optional) | 3 points extra credit |
| **Total** | 34 points |
