
import axios from 'axios';
import FormData from 'form-data';
import { Actions } from 'react-native-router-flux';
import { COSMIC_SLUG, NBA_API_KEY } from 'react-native-dotenv';

// Constants
const CREATE_USER = 'CREATE_USER';
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const CURRENT_USER = 'CURRENT_USER';

// Action Creators
const createUser = user => ({ type: CREATE_USER, user });
const login = user => ({ type: LOGIN, user });
const logout = () => ({ type: LOGOUT });
const currentUser = user => ({ type: CURRENT_USER, user });

//Initial state 
const initialState = {
  user: ''
}
// Reducer
export default (user = {}, action) => {
  switch (action.type) {
    case CREATE_USER:
      return action.user;
    case LOGIN:
      return action.user;
    case LOGOUT:
      return {};
    default:
      return user;
  }
}

// Helper Function
const formatUser = data => ({
  name: data.object.metadata.name,
  username: data.object.metadata.username,
  profilePicture: data.object.metadata.profile_picture,
  favTeam: data.object.metadata.favTeam,
  id: data.object._id,
  slug: data.object.slug,
})

// Dispatcher
export const addUser = user => dispatch => {
  let data = new FormData();
  data.append('media', {
        uri: user.image,
        type: 'image/jpeg',
        name: 'image'
      });

  return axios.post(`https://api.cosmicjs.com/v1/${COSMIC_SLUG}/media`, data)
  .then(res => res.data.media)
  .then(media => {
    return axios.post(`https://api.cosmicjs.com/v1/${COSMIC_SLUG}/add-object`, {
      title: user.firstName + ' ' + user.lastName,
      type_slug: 'users',
      metafields: [
        {
          key: 'name',
          type: 'text',
          value: user.firstName + ' ' + user.lastName,
        },
        {
          key: 'username',
          type: 'text',
          value: user.username,
        },
        {
          key: 'password',
          type: 'text',
          value: user.password,
        },
        {
          key: 'profile_picture',
          type: 'file',
          value: media.name,
        },
        {
          key: 'favTeam',
          type: 'text',
          value: user.favTeam,
        }
            ]
          }
        )}
      )
      .then(res => formatUser(res.data))
      .then(formattedUser => dispatch(createUser(formattedUser)))
      .then(() => Actions.feed())
      .catch(err => console.error(`Creating user unsuccessful`, err))
}

export const authenticate = user => dispatch => {
  return axios.get(`https://api.cosmicjs.com/v1/${COSMIC_SLUG}/object-type/users/search?metafield_key=username&metafield_value=${user.username}`)
    .then(res => res.data)
    .then(data => {
      console.log('RESPONSE USER DATA: ', data);
      if (data.objects) {
        const userData = data.objects[0];
        return {
          password: userData.metadata.password,
          username: userData.metadata.username,
          name: userData.metadata.name,
          profilePicture: userData.metadata.profile_picture,
          favTeam: userData.metadata.favTeam,
          slug: userData.slug,
          id: userData._id,
        }
      } else {
        return 'Username invalid';
      }
    })
    .then(data => {
      if (data === 'Username invalid'){
        return data;
      } else if (data.password === user.password){
        dispatch(login({
          name: data.name,
          username: data.username,
          profilePicture: data.profilePicture,
          favTeam: data.favTeam,
          slug: data.slug,
          id: data.id,
        }))
      } else {
        return 'Password invalid';
      }
    })
    .catch(error => console.error('Login unsuccessful', error))
}
export const currentUserInfo = () => dispatch => {
  dispatch(currentUser());
  Actions.profile(user);
}
export const logoutUser = () => dispatch => {
  dispatch(logout());
  Actions.welcome();
}
