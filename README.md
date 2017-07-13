## ARGUE SMARTER - REACT NATIVE APP 
# <img src="https://github.com/rhoadsjustin/ArgueSmarter/blob/master/assets/iTunesArtwork@3x.png?raw=true" height="300">

### What is argue smarter?

Sports can create some very heated arguments as people love their team or players which can blur them to the reality of who is actually the better player.

Sometimes you're in a heated argument and want the stats to back up your stance or compare side-by-side to show who's the better player.

This is where the need for the argue smarter app was born!

### Technologies Used

* React Native
* Cosmic JS 
* Expo


## How to run the app 

### First Clone & Install
```
npm install
```

I utilized Facebook's ```create-react-native-app``` to quickly structure and set up the app structure.
to install this for future React-Native projects you want to make just ```npm install -g create-react-native-app```

this will install all dependencies necessary to run the app. 
** you may also want to install Xcode if you want to run a simulator, without this you will only be able to utilize it through downloading the Expo app on your iphone. **
### You will need your own api keys to make use of the full features of the app. 
  * CosmicJS - <a href="https://cosmicjs.com/">Make your own FREE account here</a>
  * FantasyData - <a href="https://fantasydata.com/">Get a trial API key for FREE for up to 1,000 calls/month</a>
  * other sports data api's can be hit as well, this and <a href="https://www.stattleship.com/">Stattleship API</a> were the cheapest options for testing and getting the data I desired.
  
Next to run with just the expo app on your iphone just type the following when your in your project directory
```
npm run
```
if you have Xcode installed you can run the simulator on your laptop by typing the following when in your project directory
```
npm run ios
```
this will start the simulator that will auto refresh as you make changes.
---


## Entity Relationship Diagram
# <img src="https://github.com/rhoadsjustin/ArgueSmarter/blob/master/ERD.png?raw=true" height="600">

---


## Wireframes
### Homepage 
# <img src="https://github.com/rhoadsjustin/ArgueSmarter/blob/master/homePage.png?raw=true" height="600">
### Teampage 
# <img src="https://github.com/rhoadsjustin/ArgueSmarter/blob/master/teamPage.png?raw=true" height="600">
### Arguepage 
# <img src="https://github.com/rhoadsjustin/ArgueSmarter/blob/master/arguePage.png?raw=true" height="600">
### Playerpage 
# <img src="https://github.com/rhoadsjustin/ArgueSmarter/blob/master/favoritePlayerPage.png?raw=true" height="600">
### Signuppage 
# <img src="https://github.com/rhoadsjustin/ArgueSmarter/blob/master/signUpPage.png?raw=true" height="600">
### Loginpage  
# <img src="https://github.com/rhoadsjustin/ArgueSmarter/blob/master/loginPage.png?raw=true" height="600">

---

### Unsolved Problems && Future Features 
* **Unsolved Problems**:
  * search and selecting players is kinda slow
  * want to figure out how to better use redux, AsyncStorage
* **Future Features**:
  * Voting for players in the matchups 
  * Profile specific page that will show your specific favorite team news and team's players news/stats  
  * iMessage application to show stats/argue in group messages
  * a share to social media integration (tweet stat matchups to start conversations)
  * pulling Twitter feed for NBA/Team specific updates
  * finding historical data and being able to pick years for the stats for each player

 
 

