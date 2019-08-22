import React, { Component } from 'react';
import {
    TouchableOpacity, 
    ActivityIndicator,
    Image,
    StatusBar
} from 'react-native';
import { 
    Container, 
    Header, 
    Content, 
    Card, 
    CardItem, 
    Text, 
    Body, 
    Left, 
    Right,
    Thumbnail 
} from 'native-base';
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "../../styles";
const avatars = require("../../../../assets/contacts/userprofile.jpg")
import AsyncStorage from '@react-native-community/async-storage';
import { getUrl} from "../../config";

export default class ProfileApp extends Component {
    constructor(props){
        super(props);
        this.state = {
            id:"",
            username:"", 
            email:"", 
            photo:"",
            fetching: true,
        }
    }
    
    componentDidMount(){
        this._user();
      }
      
    //get Current user details
      _user = async () => {
        let mobile = await AsyncStorage.getItem('mobile');
        let token = await AsyncStorage.getItem('token');
          if(token !== null){
            try {
              await fetch(`${getUrl}user_details.php?mobile=${mobile}&token=${token}`
              ).then((response)=>response.json())
                .then((data)=>data.map((user) =>{
                  setTimeout(() => {
                    this.setState({
                      fetching:false,
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
    
    render() {
        return (
        <Container>
            <StatusBar 
                backgroundColor="#11A0DC"
                barStyle="light-content"
                />
            <Content>
                {this.state.fetching == true ? 
                    <ActivityIndicator size="large" color="#F89D29"/> : <Card>
                    <CardItem header>
                    <Text>Account</Text>
                    </CardItem>
                    
                    <CardItem>
                        <Thumbnail square source={avatars} />
                        <TouchableOpacity>
                            <Icon name="edit" style={[styles.icon,{color: '#28b485',fontSize:25}]} />
                        </TouchableOpacity>
                    </CardItem>
                    
                    <CardItem>
                        <Left><Text>Username:</Text></Left>
                        <Body>
                            <Text>{this.state.username}</Text>
                        </Body>
                        <Right>
                            <TouchableOpacity>
                                <Icon name="edit" style={[styles.icon,{color: '#28b485',fontSize:25}]} />
                            </TouchableOpacity>
                        </Right>
                    </CardItem>
                    
                    <CardItem>
                    <Left><Text>Email:</Text></Left>
                        <Body>
                            <Text>{this.state.email}</Text>         
                        </Body>
                        <Right>
                            <TouchableOpacity>
                                <Icon name="edit" style={[styles.icon,{color: '#28b485',fontSize:25}]} />
                            </TouchableOpacity>
                        </Right>
                    </CardItem>
                    
                    <CardItem>
                    <Left><Text>Password:</Text></Left>
                        <Body>
                            <Text>hidden</Text>
                        </Body>
                        <Right>
                            <TouchableOpacity opacity="0.6">
                                <Icon name="edit" style={[styles.icon,{color: '#28b485',fontSize:25}]} />
                            </TouchableOpacity>
                        </Right>
                    </CardItem>
                    
                    <CardItem footer>
                    <Text>Profile Settings</Text>
                    </CardItem>
                </Card>}
            
            </Content>
        </Container>
        );
    }
}

