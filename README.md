# Quizzical
An interesting minigame I made to practice my React skills. The idea comes from [freeCodeCamp's React Course](https://www.youtube.com/watch?v=bMknfKXIFA8&t), where is featured as the final project of the course. The application idea is the same, i just made it in my own taste.Later a lot features were added to improve the UX. The project is a competitor in a national competition.

## Dependencies
- React 
- React Router
- NanoID
- React Confetti

## Releases
### 19.02.2023 (Initial Release)
- Deployed the app with different design that the example in the course.
- Added a form to set up the quiz with personalized settings.
### 27.02.2023
- Implemented a system for registering an account. Users can now create their account and log themselves in.
- New page: Profile - users will be able to see each others profile, played games, ranks, statistics and so on (in development).
- Also featuring a system that forbids changing the local storage of the browser.
### 04.03.2023
- Now an account is required for playing the quiz.
- The question type selection has been removed from the setup.
- All games finished are saved to players profile.
- Created a recent games section on the My Profle page.
- New Page: All Games - all user's games are visible to everybody (with account).
- Time taken to finish the quiz is measured and will be used later in the user stats.
- The image background is shown in the quiz, and a minor design change.
- Fixed the redirection to the error page and improved error handling.
- API changes, bugfixes and alogorithm changes for optimization.
### 22.03.2023
- New section on the profile page: Statistics
- The new section features various stats like: efficiency, average time, favorite category and many more.
- Change in the format of time played for each game.
- Merged three navigation links (About, How to Play, OTDB) into one: About.
- Glitch visual effect on the homepage.
- Changed fallback layout for the recent games section.
- Implemented a 3D loading animation.
- Bugfixes, improved performance.
### 29.03.2023
- Introduced an Experience Leveling system. The progress is displayed in the user's profile.
- Pop-up notification for leveling up.
- Quizzes award experience based on the difficulty (and a secret time bonus).
- Statistics are locked until level 2.
- Hard and Mixed difficulty is locked until level 3.
- Random setup selections are locked until level 4.
- Maximum amount of questions defaults to 10. Increased to 15 when level 6 reached.
- Added a daily quiz challenge. Unlocks with level 5.
- When a quiz is finished, the check answers button turns into 'Back to Home'.
- Users can share profiles on Facebook and Twitter from the profile page.
- Better responsivness for the setup page.
- Fixed the design bug in the quiz.
- Minor bugfixes.
### 03.04.2023
- Password input fields are now censored.
- Username and password length are limited to 20 characters.
- Fixed the error message for character limit in the register form.
- Removed the useless Anti-Cheat note.
- Doubled the efficiency color steps (smoother coloring for the stats).
- Glitch effect colors and animation changed.
- 15 questions per quiz available from level 7.
- Introduced trophy ranking system. Unlocks with level 6.
- Non-daily quizzes award or reduce the balance of trophies, depending on the performance.
- Rank titles (determined by trophies) prefix the username.
- The Time Played stat is now changed to Highest Rank.
- Added a scoreboard that features the players with most trophies.
- Removed the About link.
### 04.04.2023
- Fixed the negative trophies bug.
- Balanced the time influence on the trophy reward.
- Got the routing ready for deployment.