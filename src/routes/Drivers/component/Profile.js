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
    Thumbnail ,
    Button,Footer, FooterTab
} from 'native-base';
import styles from '../../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
const avatars = require("../../../../assets/contacts/userprofile.jpg")
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import { getUrl} from "../../config";

export default class ProfileDriver extends Component {
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
        let mobile = await AsyncStorage.getItem('mobile_driver');
        let token = await AsyncStorage.getItem('token_driver');
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
                    AsyncStorage.setItem('currentDriver',JSON.stringify(data))
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
    
      //Logoutapp
    logout = async () => {

        let mobile = await AsyncStorage.getItem("mobile_driver");
        let token = await AsyncStorage.getItem("token_driver");

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
                    AsyncStorage.removeItem("mobile_driver");
                    AsyncStorage.removeItem("token_driver");
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
            <Header style={{backgroundColor:"#11A0DC"}} 
                iosBarStyle="light-content"
                androidStatusBarColor="#11A0DC">
                    <Left>
                        <TouchableOpacity 
                            onPress={() =>Actions.driver()}
                            opacity="0.6"
                        >
                            <Icon name="chevron-left" style={[styles.icon,{color: '#FFFFFF',fontSize:25}]} />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <Text style={styles.headerText}>Profile Settings </Text>                        
                    </Body>
            </Header>
            <Content>
                {this.state.fetching == true ? 
                    <ActivityIndicator size="large" color="#F89D29"/> : <Card>
                    <CardItem header>
                    <Text>Account</Text>
                    </CardItem>
                    
                    <CardItem>
                        <Thumbnail square source={avatars} />
                        <TouchableOpacity>
                            <Icon name="edit" style={[styles.icon,{color: '#FFFFFF',fontSize:25}]} />
                        </TouchableOpacity>
                    </CardItem>
                    
                    <CardItem>
                        <Left><Text>Username:</Text></Left>
                        <Body>
                            <Text>{this.state.username}</Text>
                        </Body>
                    </CardItem>
                    
                    <CardItem>
                    <Left><Text>Email:</Text></Left>
                        <Body>
                            <Text>{this.state.email}</Text>         
                        </Body>
                    </CardItem>
                    
                    <CardItem>
                    <Left><Text>Password:</Text></Left>
                        <Body>
                            <Text>hidden</Text>
                        </Body>
                    </CardItem>
                    
                    <CardItem footer>
                    <Text>Profile Settings</Text>
                    </CardItem>
                </Card>}
            
            </Content>
            <Footer style={{marginTop:'auto'}}>
            <FooterTab style={[styles.footerContainer]} >
                
                <Button vertical  onPress={() => Actions.requestRide()}>
                    <Icon name="eye" size={20} color={"#F89D29"} />
                    <Text style={{fontSize:12, color:"grey"}}>Requests Assigned</Text>
                </Button>

                <Button vertical  onPress={() => this.logout()}>
                    <Icon name="power-off" size={20} color={"#F89D29"} />
                    <Text style={{fontSize:12, color:"grey"}}>Logout</Text>
                </Button>

            </FooterTab>
        </Footer>
        </Container>
        );
    }
}