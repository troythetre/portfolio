import random

class Dice():
    def __init__(self):
        self.name = 'two'

    def roll(self):
        die1 = random.randint(1, 6)
        die2 = random.randint(1, 6)
        return die1 + die2

class DiceGame():
    def __init__(self, players):
        self.dice = Dice()
        self.players = players
        self.scores = {}

        # Initialize scores of all players to 0.
        for player in self.players:
            self.scores[player] = 0

    def play(self):
        print('Playing game')

    def winners(self):
        if not self.scores:
            return None
        scores = list(self.scores.values())
        max_score = max(scores)
        winners = []
        for player in self.scores:
            if self.scores[player] == max_score:
                winners.append(player)
        return winners

class ChicagoDiceGame(DiceGame):
    def __init__(self, players):
        
        self.dice = Dice()
        self.players = players
        self.scores = {}
        self.valid = True

        if not len(self.players) > 2 and len(self.players) < 6:
            self.valid = False

    def play(self):
       
        for round in range(2,12):
            for player in range(len(self.players)):
                if self.dice.roll() == round:
                    self.scores[self.players[player]] = round
            
     
new_game = ChicagoDiceGame(['Jack', 'Jill'])
new_game.play()
print(new_game.scores)
print(new_game.players)
print(new_game.winners())














