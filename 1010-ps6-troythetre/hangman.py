"""
Name: Yuchung Wu
Date: Nov 30
Description:
"""

from random import randrange
from graphics import *


# -----------------------------------
# Helper code: import hangman words

def load_words():
    """
    Returns a list of valid words. Words are strings of lowercase letters.

    Depending on the size of the word list, this function may
    take a while to finish.
    """
    # in_file: file
    in_file = open('words.txt')
    # line: string
    line = in_file.readline()
    # wordlist: list of strings
    wordlist = line.split()
    return wordlist


# load the dictionary of words and point to it with
# the words_dict variable so that it can be accessed from anywhere
# in the program
words_dict = load_words()


# Run get_word() within your program to generate a random secret word
# by using a line like this within your program:
# secret_word = get_word()
def get_word():
    """
    Returns a random word from the word list
    """
    word = words_dict[randrange(0, len(words_dict))]
    return word

# end of helper code
# -----------------------------------


# CONSTANTS
MAX_GUESSES = 6


# GLOBAL VARIABLES
win = GraphWin('Hangman', 500, 500)


####### HangmanBoard Class: ######
# You will mostly not change this class, but you should understand how it works!
# You will need to use this class and its methods in play_hangman().
# The only functions you will change/add are at the bottom of the class and
# have comments that say # YOUR CODE HERE
class HangmanBoard(object):
    def __init__(self):
        self.entryBox = Entry(Point(300, 300), 10)
        self.usedLetters = Text(Point(350, 230), '')
        self.guess = Text(Point(200, 400), '')

        self.draw_post()
        self.draw_input()

    # create hangman post
    def draw_post(self):
        post = Line(Point(25, 100), Point(25, 300))
        post.setWidth(5)
        post.draw(win)

        overhang = Line(Point(25, 100), Point(125, 100))
        overhang.setWidth(2)
        overhang.draw(win)

        rope = Line(Point(100, 100), Point(100, 150))
        rope.draw(win)

    # create graphics for rest of the game input/output
    def draw_input(self):
        self.entryBox.draw(win)
        self.usedLetters.draw(win)
        self.guess.setSize(20)
        self.guess.draw(win)

        self.usedLettersText = Text(Point(350, 200), 'Used Letters:')
        self.usedLettersText.draw(win)

        # create the guess box and button
        self.guessBox = Rectangle(Point(350, 290), Point(490, 310))
        self.guessBox.setFill('white')
        self.guessBox.draw(win)
        self.guessButton = Text(Point(420, 300) , 'CLICK TO GUESS')
        self.guessButton.draw(win)

    # update the used letters text with a new set of used letters
    # letters should be a string
    def update_letters_guessed(self, letters):
        self.usedLetters.setText(letters)

    # clear the entry box
    def clear_entry(self):
        self.entryBox.setText('')

    # update the guess text
    # text should be a string
    def update_guess(self, text):
        self.guess.setText(text)

    # returns the text of the entry box after the user clicks enter
    def get_guess_entry(self):
        word = ""
        while True:
            p = win.getMouse()
            x = p.getX()
            y = p.getY()
            if x < 450 and x > 350:
                if y < 310 and y > 290:
                    word = self.entryBox.getText()
                    break
        return word

    # draw the first part of the hangman, i.e., the head
    def draw_first_invalid_guess(self):
        #YOUR CODE HERE will replace the pass call
        head = Circle(Point(100,170),20)
        head.draw(win)
        

    # draw the second part of the hangman, i.e., the body
    def draw_second_invalid_guess(self):
        #YOUR CODE HERE will replace the pass call
        line = Line(Point(100,190),Point(100,250))
        line.draw(win)

    # draw the third part of the hangman, i.e., arm 1
    def draw_third_invalid_guess(self):
        #YOUR CODE HERE will replace the pass call
        line = Line(Point(100,220),Point(70,190))
        line.draw(win)

    # draw the fourth part of the hangman, i.e., arm 2
    def draw_fourth_invalid_guess(self):
        #YOUR CODE HERE will replace the pass call
        line = Line(Point(100,220),Point(130,190))
        line.draw(win)

    # draw the fifth part of the hangman, i.e., leg 1
    def draw_fifth_invalid_guess(self):
        #YOUR CODE HERE will replace the pass call
        line = Line(Point(100,250),Point(130,290))
        line.draw(win)

    # draw the sixth part of the hangman, i.e., leg 2
    def draw_sixth_invalid_guess(self):
        #YOUR CODE HERE will replace the pass call
        line = Line(Point(100,250),Point(80,290))
        line.draw(win)

    # given the number of mistakes at the invalid guess, draw the correct
    # hangman part
    def invalid_guess(self, mistakes):
        #YOUR CODE HERE will replace the pass call
        if mistakes == 1:
            self.draw_first_invalid_guess()
        if mistakes == 2:
            self.draw_second_invalid_guess()
        if mistakes == 3:
            self.draw_third_invalid_guess()
        if mistakes == 4:
            self.draw_fourth_invalid_guess()
        if mistakes == 5:
            self.draw_fifth_invalid_guess()
        if mistakes == 6:
            self.draw_sixth_invalid_guess()



def word_guessed(secret_word, letters_guessed):
    """
    Returns True if the player has successfully guessed the word,
    and False otherwise.
    """

    ####### YOUR CODE HERE ######
    a = []
    b = 0
    d = []
    for index in letters_guessed:
        for c in secret_word:
            if index == c:
                a.append(index)
  
    print(a)

    for index in secret_word:
        if index not in a:
            d.append(0)
        else:
            d.append(1)
    
    print(d)
    for index in d:
        if index == 0:
            return False
            break
    

    
    
 

result = ''
def get_guessed(secret_word, letters_guessed):
    """
    Returns the characters you have guessed in the secret word so far,
    with dashes (-) for characters that haven't been guessed.
    For example, if the word is claptrap and you have guessed only 'a',
    it should return --a---a-
    """
    result = ''
    ####### YOUR CODE HERE ######
    for index in secret_word:
        if index in letters_guessed:
            result += index
        else:
            result += '-'
    return result



def play_hangman():
    # Actually play the hangman game

    # GAME VARIABLES
    secret_word = 'claptrap'
    letters_guessed = []
    mistakes_made = 0

    # create an instance of the hangman board
    h = HangmanBoard()


   
    while True:
        guess = h.get_guess_entry()
        print(guess)
        if not guess in letters_guessed:
            letters_guessed.append(guess)  
            if guess in secret_word:
                get_guessed(secret_word,letters_guessed)
            else:
                mistakes_made += 1
                h.invalid_guess(mistakes_made)
        get_guessed(secret_word,letters_guessed)
        h.update_letters_guessed(letters_guessed)
        h.update_guess(get_guessed(secret_word,letters_guessed))
        if word_guessed(secret_word,letters_guessed) == None:
            h.usedLetters.setText('Congratulations!')
        if mistakes_made == 6:
            h.usedLetters.setText('Game Over!')
        




    ####### YOUR CODE HERE ######
  
# main calls
play_hangman()
win.mainloop()
