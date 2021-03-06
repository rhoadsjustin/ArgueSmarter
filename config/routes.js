import React from 'react';
import { Scene, Router, Actions, ActionConst } from 'react-native-router-flux';
import Welcome from '../layouts/Welcome'
import Login from '../layouts/login'
import Signup from '../layouts/signup'
import Feed from '../layouts/feed'
import Argue from '../layouts/Argue'
import Navbar from '../components/FeedNavbar'
import ArguePlayers from '../layouts/ArguePlayers'
import Gallery from '../layouts/Gallery'
import Scoreboard from '../layouts/Scoreboard'
import Profile from '../layouts/Profile'
import FeedNavbar from '../components/FeedNavbar/FeedNavbar';
import BoxScore from '../layouts/BoxScore'
const scenes = Actions.create(
  <Scene key="root">
    <Scene key="welcome" component={Welcome} title="Welcome" initial={true} />
    <Scene key="login" component={Login} title="Login" type={ActionConst.REPLACE} />
    <Scene key="signup" component={Signup} title="Create New Account" type={ActionConst.REPLACE} />
    <Scene key="feed" component={Feed} title="Your Feed" type={ActionConst.REPLACE} navBar={FeedNavbar}/>
    <Scene key="argue" component={Argue} type={ActionConst.REPLACE} navBar={FeedNavbar}/>
    <Scene key="scoreboard" component={Scoreboard} type={ActionConst.REPLACE} navBar={FeedNavbar} />
    <Scene key="arguePlayers" component={ArguePlayers} type={ActionConst.REPLACE} navBar={FeedNavbar}/>
    <Scene key="gallery" component={Gallery} type={ActionConst.REPLACE} navBar={FeedNavbar}/>
    <Scene key="profile" component={Profile} type={ActionConst.REPLACE} navBar={FeedNavbar}/>
    <Scene key="boxscore" component={BoxScore} />
  </Scene>
);

export default () => (
    <Router scenes={scenes} />
);
