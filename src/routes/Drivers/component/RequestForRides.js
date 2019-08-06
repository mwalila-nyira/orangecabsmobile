import React from 'react';
import {
    Text, 
    View,
    ScrollView,
    Alert,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    FlatList,
    Image
} from 'react-native';
import {
  Container,
  Header, 
  Left, 
  Body, 
  Right, 
  Button,
  Footer, 
  FooterTab,
  Content, 
  Card,
  CardItem,
  Thumbnail
} from 'native-base';
import styles from '../../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import { getUrl} from '../../config';
import moment from 'moment';

const startRide = require("../../../../assets/contacts/iconsstartfilled.png");

const stopRide = require("../../../../assets/contacts/circledpausefilled.png");

const completeRide = require("../../../../assets/contacts/taskcompleted.png");

const findRider = require("../../../../assets/contacts/iconssent.png");
const findRiderAv = require("../../../../assets/contacts/findusermale.png");
const chaticon = require("../../../../assets/contacts/iconschat.png");
const cancelRide = require("../../../../assets/contacts/cancelfilled.png");

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class RequestForRides extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data:[],
      isLoadingRequest:false,
      message:'',
      startRideActivity:false,
      stopRideActivity:false,
      completeRide:false,
      rateDrive:false,
      startDateRideActivity:'',
      endDateRideActivity:'',
      isFindRider:false,
      trip_id:'',
      user_id:'',
      duration:'',

    };
    this._handleCloseModal = this._handleCloseModal.bind(this);
  }
  
  componentDidMount(){
    this._allrequesttrips();
}

  //find rider
  _findRider = async () => {
    this.setState({isFindRider:true});
    setTimeout(() => {
      this.setState({isFindRider:false}); 
      alert('Rider'); 
    }, 5000);
  }

  //cancel find rider
  _cancelFindRider= async () => {
    this.setState({isFindRider:false});
  }

//start activity 
 _startActivityRide = async (trip_id,user_id,duration) => {
   this.setState({
     startRideActivity:true,
     trip_id:trip_id,
     user_id:user_id,
     duration:duration
    })
 }

 //close modalVisible
 _handleCloseModal = async () => {
   this.setState({startRideActivity:false});
 }
  
//Get all the request assigned for ride
  _allrequesttrips = async () => {
    this.setState({isLoadingRequest:true});
    let mobile = await AsyncStorage.getItem('mobile_driver');
    let token = await AsyncStorage.getItem('token_driver');
    try {
        await fetch(`${getUrl}request_assign_driver.php?mobile=${mobile}&token=${token}`)
        .then((response) => response.json())
        .then((res) =>{
            setInterval(() => {
              this.setState({isLoadingRequest:false,data:res})
            }, 2000);
            // alert(this.state.data)
        }
        ).catch(err =>{
            this.setState({isLoadingRequest:false});
            console.log(err);
        });
    
    } catch (error) {
        this.setState({isLoadingRequest:false});
        console.log(error);
    }
  }

  render() {
    return (
      <Container>
        <Header style={{backgroundColor:"#11A0DC"}} 
          iosBarStyle="light-content"
          androidStatusBarColor="#F89D29">
            <Left>
              <TouchableOpacity 
                  onPress={() =>Actions.driver()}
                  opacity="0.6"
              >
                  <Icon name="chevron-left" style={[styles.icon,{color: '#FFFFFF'}]} />
              </TouchableOpacity>
            </Left>
            <Body>
                <Text style={styles.headerText}>Assigned Request Driver</Text>                        
            </Body>
        </Header>

        <View style={styles.Container}>
          <ScrollView>
            <KeyboardAvoidingView>

                {this.state.data !== null ?
                  <FlatList 
                  data={this.state.data}
                  ItemSeparatorComponent={this.renderSeparator}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => 
                    <Content>
                      <Card>
                        <CardItem>
                          <Left>
                            <Thumbnail source={findRiderAv} />
                            <Body>
                              <Text style={{fontWeight:'bold',marginTop:2,}}>Rider Username: {item.username}</Text>
                              <Text note style={{fontWeight:'bold',marginTop:2,}}>Mobile N.: {item.mobile}</Text>
                            </Body>
                          </Left>
                        </CardItem>
                        
                        <CardItem cardBody >
                            <Body style={{paddingLeft:20}}>
                              <Text style={{fontWeight:'bold'}} >From: {item.departure}</Text>
                              <Text style={{fontWeight:'bold',marginTop:2,marginLeft:0}}>To: {item.destination}</Text>
                              <Text style={{fontWeight:'bold',marginTop:2,marginLeft:0}}>Distance: {item.distance} , {item.duration}</Text>
                              <Text style={{fontWeight:'bold',marginTop:2,}}>Date: {moment(item.date).format('MMMM, Do YYYY HH:mm')}</Text>
                              <Text style={{fontWeight:'bold',marginTop:2,}}>Status Pay: {item.status_pay}</Text>
                            </Body>

                        </CardItem>
                        
                        <CardItem>
                          <Left>
                            {this.state.isFindRider == true ?    <ActivityIndicator size="large" color="#F89D29"/>:
                            <Button transparent onPress={() => this._findRider()} >
                              <Image source={findRider}/>
                                <Text>Find Rider</Text>
                            </Button>
                            }
                          </Left>
                          
                          <Body>
                             <Button transparent onPress={() => this._startActivityRide(item.trip_id,item.user_id,item.duration)}>
                              <Image source={startRide}/>
                                <Text>Start Journey</Text>
                            </Button>
                          </Body>
                          
                          <Right>
                            {this.state.isFindRider == true ?
                              
                              <Button transparent onPress={() => this._cancelFindRider()}>
                                <Image source={cancelRide}/>
                                <Text>Cancel</Text>
                              </Button> : 

                              <Button transparent onPress={() => this._sendMessage(item.trip_id,item.user_id)}>
                                <Image source={chaticon} />
                                <Text>Message</Text>
                              </Button>
                            }
                          </Right> 
                        </CardItem>
                        
                      </Card>
                    </Content>
                    }/> :<View style={{flex:1,justifyContent: 'center', alignContent:"center"}}>
                          <Text>{this.state.message}</Text>
                      </View>
              }
                {this.state.isLoadingRequest == true && <ActivityIndicator size="large" color="#F89D29" /> }
              </KeyboardAvoidingView>
          </ScrollView>
        </View>
                
        <Footer style={{marginTop:'auto'}}>
            <FooterTab  style={[styles.footerContainer]}>
                
                <Button vertical  onPress={() => Actions.driver()}>
                    <Icon name="home" size={20} color={"#F89D29"} />
                    <Text style={{fontSize:12, color:"grey"}}>Home</Text>
                </Button>

                <Button vertical active onPress={() => Actions.requestRide()}>
                    <Icon name="eye" size={20} color={"#F89D29"} />
                    <Text style={{fontSize:12, color:"grey"}}>Requests</Text>
                </Button>

                <Button vertical  onPress={() => Actions.profileDriver()}>
                    <Icon name="user" size={20} color={"#F89D29"} />
                    <Text style={{fontSize:12, color:"grey"}}>Profile</Text>
                </Button>
                <Button vertical  onPress={() => Actions.messageDriver()}>
                    <Icon active name="envelope-o" size={20} color={"#F89D29"} />
                    <Text style={{fontSize:12, color:"grey"}}>Message</Text>
                </Button>

            </FooterTab>
        </Footer> 
       
      </Container>
    );
  }
}
export default RequestForRides;

