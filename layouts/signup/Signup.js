import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ImagePicker } from 'expo';
import { Actions } from 'react-native-router-flux';
import {View} from 'react-native';
import {
  Container,
  Content,
  Button,
  Text,
  Form,
  Thumbnail,
  Icon, Picker
} from 'native-base';
import axios from 'axios';
import TextField from '../../components/TextField';
import styles from './styles';
import { addUser } from '../../redux/reducers/users';
import cosmicConfig from '../../config/cosmic';

const mapDispatchToProps = {addUser};

const validate = form => {
  let errorMessage = '';
  if (form.username.includes(" ")){
    errorMessage = "Username cannot contain spaces";
  }
  if (form.password.includes(" ")){
    errorMessage = "Password cannot contain spaces";
  }
  Object.keys(form).slice(0, 5).map(field => {
    if (!form[field]){
      errorMessage = 'All fields must be filled';
    }
  })
  return errorMessage;
}

const Item = Picker.Item;

const renderFavTeam = (team) => (
 <FaveTeam
   uniqueID={team['_id']}
   key={team.key}
   name={team.name}
   city={team.city}
   logo={team.WikipediaLogoUrl}
   division={team.division}
 />
)

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      favTeam: '',
      image: null,
      error: '',
      teams: []
    }
  }

  onSubmit(){
    const error = validate(this.state);
    if (error) {
      this.setState({ error })
    } else {
      this.checkUsername(this.state.username);
    }
  }


  checkUsername(username){
    axios.get(`https://api.cosmicjs.com/v1/${cosmicConfig.bucket.slug}/object-type/users/search?metafield_key=username&metafield_value=${username}`)
    .then(res => res.data)
    .then(data => {
      if (data.objects) {
        this.setState({ error: 'Username not available'})
      } else {
        this.props.addUser(this.state);
      }
    })
  }

  uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  loadTeams() {
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
   .then((prettyData) => prettyTeams = prettyData.map(team => {
     return {
       name: team.Name,
       city: team.City,
       key: team.Key,
       conference: team.Conference,
       division: team.Division,
       logo: team.WikipediaLogoUrl,
       id: team.GlobalTeamID
     }
     console.log("team created", team)
   }))
   .then((prettyTeams) => this.setState({
     teams: prettyTeams
   }))
   .catch((error) => {
     console.log("couldn't load the teams", error)
   });
 }



 componentDidMount(){
   this.loadTeams();
}

  render(){
    return (
      <Container style={styles.container}>
        <Content>
          <Form style={styles.mar10}>
            <TextField
              name="First Name"
              value={this.state.firstName}
              onChangeText={(text) => this.setState({firstName: text})}
            />
            <TextField
              name="Last Name"
              value={this.state.lastName}
              onChangeText={(text) => this.setState({lastName: text})}
            />
            <TextField
              name="Username"
              value={this.state.username}
              onChangeText={(text) => this.setState({username: text})}
            />
            <TextField
              secureTextEntry
              name="Password"
              value={this.state.password}
              onChangeText={(text) => this.setState({password: text})}
            />
            <Picker
              iosHeader="Select one"
              mode="dropdown"
              selectedValue={this.state.favTeam}
              onValueChange={(value) => this.setState({favTeam: value})}
            >
              { this.state.teams.map((team) => {
                let teamName = team.city + ' ' + team.name
                  return (
                  <Item key={team.id} label={teamName} value={team.key} />
                  )
                })
              }
            </Picker>
          </Form>
          <Text style={styles.addPic}>Add a profile picture</Text>
          {
            !this.state.image &&
            <Button
              primary
              bordered
              onPress={this.uploadImage}
              style={styles.uploadButton}>
              <Icon
                ios='ios-camera'
                android='md-camera'
              />
            </Button>
          }
          {
            this.state.image &&
            <Thumbnail
              size={80}
              source={{uri: this.state.image}}
              style={styles.thumbnail}
            />
          }
          <Button
            block
            style={styles.mar10}
            onPress={() => this.onSubmit()}
          >
            <Text>Create account</Text>
          </Button>
          <Text style={styles.formMsg}>{this.state.error}</Text>
          <Button
            transparent
            style={styles.loginBtn}
            onPress={() => Actions.login()}
          >
            <Text style={styles.loginTxt}>Already have an account?</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export default connect(null, mapDispatchToProps)(Signup);
