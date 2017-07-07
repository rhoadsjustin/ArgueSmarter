import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import nbaConfig from '../../config/NBAapi';

// Constants
const INITIALIZE = 'INITIALIZE_TEAMS';


// Action Creators
const init = teams => ({ type: INITIALIZE, teams });

// Reducer
export default (teams = [], action) => {
  switch (action.type) {
    case INITIALIZE:
      return action.teams;
    default:
      return teams;
  }
}

var instance = axios.create({
  baseURL: 'https://api.fantasydata.net/v3/nba/scores/JSON/teams',
  headers: {'Ocp-Apim-Subscription-Key': ''}
});

// Alter defaults after instance has been created


// Dispatcher
export const loadTeams = () => dispatch => {
  return instance.get(baseURL)
    .then(res => res.data.objects)
    .then(console.log("YOU FOUND THIS MANY TEAMS: ", res))
    .then(dispatch(init(res)))
    .catch(err => console.error(`Could not load posts`, err));
};
