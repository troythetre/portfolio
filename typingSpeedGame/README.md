**CMSI 1010** Computer Programming & Laboratory, Fall 2021

# End-of-Semester Project
We wrap up the course with a longer-form program (just slightly so), long enough to be called a “project.” Project options are listed in greater detail below. Independent of the option, each project will consist of the following:
* Choice of solo or teams of up to three (3) classmates
* Project presentation, to be delivered on the last day of class
* Project deliverables, to be committed to this repository
* Project reflection, to be submitted individually in Brightspace under _Assessment > Assignments > Project Reflection_

## Timetable
* Week after Thanksgiving: State individual/team preference, determine project option, and for custom projects _submit a proposal and have it approved by the instructor_
* Week before finals:
    * In-class work session on first class day (but don’t let this be the _only_ time you work!)
    * Presentations on second class day (last day of class)
* Finals week: continue working, finish up by Wednesday, December 15, 11:59:59.999pm

## Individual/Team Preference
Determine and submit how you plan to work on the project to [this Google form](https://forms.gle/k5upfSi3fFxdX3tz5). Even if you plan to work in teams, _each student_ must submit an entry. If you plan to work in a pre-arranged team, make sure that your individual responses are consistent with each other. For example, if Neda, Amir, and Sam decide to form a pre-arranged team of three, then Neda should list Amir and Sam as teammates; Amir should list Neda and Sam as teammates; and Sam should list Neda and Amir as teammates. Failure to do this will result in delays with finalizing your teams and thus will decrease the time that you have for doing the actual project work.

Students who want to work in a team but would like the instructor to assign their teammate(s) will be informed by the instructor when the teams have been formed.

## Presentations
You will have 4–8 minutes to present and possibly preview your chosen project to the class (final time will depend on the breakdown of individuals vs. teams). You should describe what your project does and give a preview if available.

**If working in a team, make sure that everyone in the team presents something.** You should all have a shared understanding of the work that your chosen project will entail or has entailed. If something is a mystery, you ask your teammate(s) to explain it to you! See what you can do to make the presentations fun and engaging.

Some ideas for things to talk about:
* Reasoning/motivation/inspiration for your chosen project option.
* The classes and objects you designed.
* A preview of the work done so far.
* (for teams) Your team dynamics: What is the division of labor? How are you communicating with each other? How did you resolve (or not resolve) differences in coding style, conceptual design ideas, or personal issues?
* What is left for you to do before the due date?
* Do you have any stretch goals? (things you would like to do with the project if you had additional time)

## Deliverables
This repository is _shared_ by members of your team. Make sure to coordinate who submits what, and when. Be prepared to resolve any conflicts in case multiple team members try to update the same file (or better yet, coordinate sufficiently so that there _aren’t_ any conflicts). The state of this repository as of Wednesday, December 15, 11:59:59.999pm, will comprise your submission.

Specific deliverables vary based on the project option, but in general they should consist of:
* **Well-documented code:** Make sure that your code, whether in a notebook or in standalone Python files, includes appropriate comments that explain the intent of what you wrote. At a minimum, every class, method, and function should have a docstring. If doing a project that involves standalone Python files, make sure to include an overall comment atop every file.
* **Instructions:** Provide clear instructions on how to use/run your project. Notebook-based projects should have sufficient text to guide the person reading/running the notebook. Standalone Python projects should supply a _manual.md_ file with instructions on how to run and use the Python program.
* **Acknowledgements:** You are likely to refer to resources on the web for help in completing your project. Make sure to acknowledge these resources; anything that wasn’t explicitly written by a member of your team should be acknowledged.

## Reflection
Reflections are to be submitted individually, directly to Brightspace. This can be found in _Assessment > Assignments > Project Reflection_. Answer the given questions. If you were in a team, you are asked to also describe the division of labor among team members.

## Project Options
You may choose among the following projects. Pick something that you and/or your team will find fun, engaging, and challenging without being frustrating!

### Data Science: [World Progress](https://colab.research.google.com/github/lmu-cmsi1010-fall2021/lab-notebook-originals/blob/main/project-support/WorldProgress.ipynb)
This project walks you through some analysis and computations of world population data and trends based on [Gapminder.org](http://gapminder.org/) and the [Systema Globalis](https://github.com/open-numbers/ddf--gapminder--systema_globalis) project. Its [starter notebook](https://colab.research.google.com/github/lmu-cmsi1010-fall2021/lab-notebook-originals/blob/main/project-support/WorldProgress.ipynb) contains detailed instructions on what to do. Work consists of typical data science tasks including but not limited to data download, querying, filtering, analysis, and plotting.

If you choose this option, the deliverable consists of your final, fully-coded _WorldProgress.ipynb_ notebook, committed to this repository.

### Game: [Zombie Dice](https://colab.research.google.com/github/lmu-cmsi1010-fall2021/lab-notebook-originals/blob/main/project-support/ZombieDice.ipynb)
This project leads to a Jupyter notebook-based implementation of the [Zombie Dice game](http://www.sjgames.com/dice/zombiedice/). Its [starter notebook](https://colab.research.google.com/github/lmu-cmsi1010-fall2021/lab-notebook-originals/blob/main/project-support/ZombieDice.ipynb) provides additional details and links about the game, as well as some guidance on how to approach implementation. Work is similar to past game-like lab assignments, but at a larger, deeper scale.

Teams are asked to also implement an extension to the base game. The extensions are documented and linked to in the starter notebook.

If you choose this option, the deliverables consist of the following, committed to this repository:
* Your final, fully-coded _ZombieDice.ipynb_ notebook
* Class diagrams and flowcharts for your implementation

### Teaching/Learning: Our Own Class Companion and Lab
This project asks you to create a Jupyter notebook that seeks to teach a Python concept of your choice to future students. There is no starter notebook for this one—this gives you the opportunity to envision teaching this completely in your own way. Your notebook should supply the following:
* Information about what the student should already know before they tackle this notebook
* An introductory explanation (text and/or images and/or video) of your chosen concept
* A description of how this concept translates to code
* Ready-to-run code examples that demonstrate the concept
* At least one sample ready-to-run program that _uses_ or _applies_ the concept (e.g., a simple self-contained game; a function that performs a useful real-world computation; etc.)
* A lab exercise that gives the student an opportunity to apply what you have taught them

For the last item, you should also supply a solution to the exercise, in a separate notebook.

If you choose this option, the deliverables consist of the following, committed to this repository:
* The student _.ipynb_ notebook containing your class content and ready-to-run examples
* An instructor _.ipynb_ notebook containing a solution to the lab exercise

### Custom Option
This project is…anything you’d like it to be. You can envision any project you would like and implement it.

Standalone games are a popular choice for this option—in support of this, we have prepared a [Python Game Demos](https://github.com/lmu-cmsi1010-fall2021/python-game-demos) repository with some examples and documentation for developing Python-based games. In particular, information and links are available there for using [PyGame](https://www.pygame.org), a popular third-party library created exactly for this reason.

If you choose this option, you must first get the approval of the instructor:
* Submit a _proposal.md_ document to this repository ASAP and notify your instructor when it is done. Describe what you plan to do: state your _minimum viable product (MVP)_ which represents the baseline functionality for your project. Include a few _stretch goals_ that you would consider adding if there is sufficient time. The instructor will provide feedback and formal approval. **This must happen by the end of the week after Thanksgiving.**
* Remaining deliverables will depend on your specific project, but at a minimum it must include _complete code and resources_ for running the project and a _manual.md_ file with complete instructions for how to use your program/game

## Point Allocations
Independent of the chosen option, all projects are worth the same number of points. The basis for core project points will depend on the chosen option; please refer to the option descriptions above to see what these are.

| Project Part | Points |
|----|----:|
| Individual/team form submission | 5 points |
| Presentation | 10 points |
| Core project | 60 points |
| Reflection (individual) | 10 points |
| **Total** | **85 points** |
