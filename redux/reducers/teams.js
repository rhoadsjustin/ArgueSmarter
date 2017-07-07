import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import NBA from '../../config/cosmic';

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

const formatTeam = (response) => {
  console.log("THIS IS THE RESPONE: ", Object.entries(response[0]))
  const teams = response;
    teams => teams.map(team => {
      return {
        name: team.Name,
        city: team.City,
        key: team.Key,
        conference: team.Conference,
        division: team.Division,
        logo: team.WikipediaLogoUrl,
      }
    })
}

// Dispatcher
export const loadTeams = () => dispatch => {
  return fetch('https://api.fantasydata.net/v3/nba/scores/JSON/teams', {
  method: 'GET',
  headers: {
    'Ocp-Apim-Subscription-Key': '${NBA.bucket.api_key}',
  }
})
  .then((response) => {
    console.log("THE API KEY IS: ", `${NBA.bucket.api_key}`)
  })
  .then((response) => response.json())
  .then((responseJson) => formatTeam(responseJson))
  .then((formattedTeam) => dispatch(init(formattedTeam)))
  .catch((error) => {
    console.log("couldn't load the teams", error)
  });
};
