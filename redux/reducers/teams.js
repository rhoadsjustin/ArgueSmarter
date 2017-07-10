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

let formatTeam = (response) => {
  console.log("THIS IS THE RESPONSE: ", response)
  teams = response => response.map(team => {
      return {
        name: team.data.Name,
        city: team.data.City,
        key: team.data.Key,
        conference: team.data.Conference,
        division: team.data.Division,
        logo: team.data.WikipediaLogoUrl,
      }
      console.log("Team created: ", team)
    })
}

// Dispatcher
export const loadTeams = () => dispatch => {
  return fetch('https://api.fantasydata.net/v3/nba/scores/JSON/teams', {
  method: 'GET',
  headers: {
    'Ocp-Apim-Subscription-Key': '',
  }
})
  .then((response) => {
    let data = response._bodyInit;
    console.log("This is the teams: ", JSON.parse(data))
    return prettyData = JSON.parse(data)
  })
  .then((prettyData) => prettyData.map(team => {
    return teams = {
      name: team.Name,
      city: team.City,
      key: team.Key,
      conference: team.Conference,
      division: team.Division,
      logo: team.WikipediaLogoUrl,
    }
    console.log("team created", team)
  }))
  .then((teams) => dispatch(init(teams)))
  .catch((error) => {
    console.log("couldn't load the teams", error)
  });
};
