import React, { Component } from "react";
import {View,Alert,TouchableOpacity,ActivityIndicator,} from "react-native";
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Thumbnail,
} from "native-base";
import styles from "./style";
import { Actions } from "react-native-router-flux";
import { getUrl} from "../config";
import AsyncStorage from '@react-native-community/async-storage';
const avatar = require("../../../assets/contacts/user.png");


class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4,
      fetching: false,
      id:"",
      username:"", 
      email:"", 
      photo:""
    };
  }
  
  componentDidMount(){
    this._user();
  }
  
//get Current user details
  _user = async () => {
    this.setState({fetching:false});
    let mobile = await AsyncStorage.getItem('mobile');
    let token = await AsyncStorage.getItem('token');
      if(token !== null && mobile !== null){
        try {
          await fetch(`${getUrl}user_details.php?mobile=${mobile}&token=${token}`
          ).then((response)=>response.json())
            .then((data)=>data.map((user) =>{
              setTimeout(() => {
                this.setState({
                  fetching:true,
                  id:user.user_id,
                  username:user.username,
                  email:user.email,
                  photo:user.profilepicture 
                });
                // alert(this.state.email);
                AsyncStorage.setItem('currentUser',JSON.stringify(data))
              }, 2000);
              
            })).catch(err=>{
              this.setState({fetching:false});
              console.log(err);
            })
  
        } catch (error) {
          this.setState({fetching:false});
          console.log(error);
        }
      }   
}

logout = async () => {
  
    let mobile = await AsyncStorage.getItem("mobile");
    let token = await AsyncStorage.getItem("token");

    await fetch(`${getUrl}logoutapp.php`,{
            method: "POST",
            headers:{
                "Accept": "application/json",
                "Content-type": "application/json"
            },
            body:JSON.stringify({
                mobile:mobile,
                token:token
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson === "ok"){
                AsyncStorage.removeItem("mobile");               
                AsyncStorage.removeItem("token");
                AsyncStorage.removeItem("currentUser");
                this.setState({
                  id:"",
                  username:"", 
                  email:"", 
                  photo:""
                })
                Actions.accueil();
            }else{
              Alert.alert("Failed",JSON.stringify(responseJson)),[{text: "Okay"}];
            }
        }).catch((error) => {
          alert("Try later or check your network!");
          console.error(error);
      });
  }

  render() {

    return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
        >
          <View style={{ flex: 1, backgroundColor: "#3498db", justifyContent:"center", alignItems:"center",paddingBottom:15, paddingTop:15}}>

                {this.state.fetching == true ? 
                  <View>
                    <TouchableOpacity onPress={() =>Actions.profile()}>
                      <Thumbnail 
                        source={avatar} large  style={{marginTop:35}}
                        />
                    </TouchableOpacity>
                      
                      <Text style={{color:"#fff", fontSize:15,paddingBottom:3}}> 
                          {this.state.username}
                        </Text>
                      <Text style={{color:"#fff", fontSize:15, }}>
                          {this.state.email}
                        </Text>
                  </View> 
                  : <View>
                    <TouchableOpacity onPress={() =>Actions.profile()}>
                      <Thumbnail 
                        source={avatar} large  style={{marginTop:35}}
                        />
                    </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => Actions.profile()} 
                        opacity="0.6" 
                        key={2}>
                      <Text style={{color:"#fff", fontSize:17, }}>
                          View Your Profile
                        </Text>
                      </TouchableOpacity>
                  </View>
                }
          </View>
          

          <List>
            <ListItem 
              button
              noBorder
              onPress={() => Actions.home()}
            >
                <Left>
                  <Icon
                    active
                    name="add"
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                  />
                  <Text style={styles.text}>
                    Book now
                  </Text>
                </Left>
              </ListItem>

              <ListItem
                button
                noBorder
                onPress={() => Actions.viewtrip()}
              >
                <Left>
                  <Icon
                    active
                    name="eye"
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                  />
                  <Text style={styles.text}>
                    Your Trips
                  </Text>
                </Left>
              </ListItem>

              <ListItem
                button
                noBorder
                onPress={() => Actions.help()}
              >
                <Left>
                  <Icon
                    active
                    name="call"
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                  />
                  <Text style={styles.text}>
                    Help
                  </Text>
                </Left>
              </ListItem>

              <ListItem
                button
                noBorder
                onPress={() => Actions.viewtrip()}
              >
                <Left>
                  <Icon
                    active
                    name="bookmarks"
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                  />
                  <Text style={styles.text}>
                    Payment
                  </Text>
                </Left>
              </ListItem>

              <ListItem
                button
                noBorder
                onPress={() => Actions.message()}
              >
                <Left>
                  <Icon
                    active
                    name="notifications"
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                  />
                  <Text style={styles.text}>
                    Message
                  </Text>
                </Left>
              </ListItem>

              <ListItem
                button
                noBorder
                onPress={() => Actions.profile()}
              >
                <Left>
                  <Icon
                    active
                    name="person"
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                  />
                  <Text style={styles.text}>
                    Profile
                  </Text>
                </Left>
              </ListItem> 

              <ListItem
                button
                noBorder
                onPress={() => this.logout()}
              >
                <Left>
                  <Icon
                    active
                    name="refresh"
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                  />
                  <Text style={styles.text}>Logout</Text>
                </Left>
              </ListItem> 

          </List>

        </Content>
      </Container>
    );
  }
}

export default SideBar;
