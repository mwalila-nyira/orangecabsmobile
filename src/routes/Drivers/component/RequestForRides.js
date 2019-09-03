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
    Image,
    StatusBar
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import { getUrl} from '../../config';
import moment from 'moment';
// import Map from './Driver';

class RequestForRides extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data:[],
      isLoadingRequest:false,
      message:'',
      startActivity:false,
      rateDrive:false,
      startDateRideActivity:'',
      endDateRideActivity:'',
      isFindingRider:false,
      chatDataId:{},
      
      //declarations of variable to send to server via socket for getting rider distance
      modalVisible : false,
      datafindrider:{},
      isSendMessage:false

    };
    this.intervalID
  }
  
  componentDidMount(){
    this._allrequesttrips();
  }

  componentWillUnmount() {
    /*
      stop _allrequesttrips() from continuing to run even
      after unmounting this component
    */
    clearTimeout(this.intervalID);
  }

  _closeModal= async()=>{
    this.setState({modalVisible:false})
  }
  //find rider
  _findRider = async (trip_id,user_id,driver_id,username,mobile,departure,destination,departureLatitude,departureLongitude,place_id_departure,place_id_destination,distance,duration,isconnect) => {
    this.setState({ isFindingRider:true})
    setTimeout(() => {
      this.setState({
        datafindrider:{
          driverId : driver_id,
          username:username,
          mobile:mobile,
          departure:departure,
          destination:destination,
          userId : user_id,
          tripId : trip_id,
          departureLatitude : departureLatitude,
          departureLongitude:departureLongitude,
          placeIdDestination:place_id_destination,
          placeIdDeparture:place_id_departure,
          distance:distance,
          duration:duration,
          isconnect:isconnect
        } 
      });
      // alert(JSON.stringify(this.state.datafindrider))
      Actions.driver({data:this.state.datafindrider});
       
    }, 2000);
    
    
  }

  //cancel find rider
  _cancelFindRider= async () => {
    this.setState({isFindRider:false});
  }

  //start activity 
  _startActivityRide = async (trip_id,user_id,driver_id,car_id) => {
    this.setState({startActivity:true})
    
      try {
        await fetch(`${getUrl}startActivity.php`,{
          method:"POST",
          headers:{
            Accept: 'application/json',
            'Content-Type':'application/json'
          }, 
          body:JSON.stringify({
            tripId:trip_id,
            userId:user_id,
            driverId:driver_id,
            carId:car_id,
          })
        }).then((response) => response.json())
          .then((data)=>{
            if(data){
              setTimeout(() => {
                this.setState({
                  startActivity:false,
                });
                Alert.alert('Success',JSON.stringify(data)),[{text: 'Okay'}]
              }, 2000);
              
              Actions.stopActivity({data:this.state.data});
            }else{
              this.setState({startActivity:false});
                    Alert.alert('Failed',JSON.stringify(data)),[{text: 'Okay'}];
            }
            
          }).catch((error)=>{
            this.setState({startActivity:false});
            console.log(error)
          })
      } catch (error) {
        this.setState({startActivity:false});
        console.log(error)
      }
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
              this.setState({data:[...res],isLoadingRequest:false,})
                // call _requestDriver() again in 5 seconds
                this.intervalID = setTimeout(this._allrequesttrips.bind(this), 5000);

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
  
  //chat message
  _sendMessage = async (trip_id, user_id,driver_id,isconnect,username) => {
    this.setState({isSendMessage:true});
    setTimeout(() => {
      this.setState({
        chatDataId:{
          tripId:trip_id,
          userId:user_id,
          driverId:driver_id,
          isconnect:isconnect,
          username:username,
        }
      })
      Actions.messageDriver({chatData:this.state.chatDataId})
    }, 2000);
    
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
        <StatusBar 
          backgroundColor="#11A0DC"
          barStyle="light-content"
        />
        <Header style={{backgroundColor:"#11A0DC"}} 
          iosBarStyle="light-content"
          androidStatusBarColor="#11A0DC">
            <Left></Left>
            <Body>
                <Text style={styles.headerText}>Assignement Resquest for rides</Text>                        
            </Body>
        </Header>

        <View style={[styles.Container,{marginBottom:50}]}>
          <ScrollView>
                {this.state.data !== null ?
                  <FlatList 
                  data={this.state.data}
                  ItemSeparatorComponent={this.renderSeparator}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => 
                    <Content>
                      <Card >
                        <CardItem>
                          <Left>
                            <Icon name="account-circle" style={[styles.icon,{color: '#11A0DC',fontSize:40}]}/>
                            <Body>
                              <Text style={{fontWeight:'bold',marginTop:2,}}>Rider Details </Text>
                              <Text note style={{fontWeight:'bold',marginTop:2,}}>Name: {item.username}</Text>
                              <Text note style={{fontWeight:'bold',marginTop:2,}}>Mobile: {item.mobile}</Text>
                              <Text note style={{fontWeight:'bold',marginTop:2,}}>Mail: {item.email}</Text>
                            </Body>
                          </Left>
                        </CardItem>
                        
                        <CardItem cardBody >
                            <Body style={{paddingLeft:20}}>
                              <Text style={{fontWeight:'bold'}} >From: {item.departure}</Text>
                              <Text style={{fontWeight:'bold',marginTop:2,marginLeft:0}}>To: {item.destination}</Text>
                              <Text style={{fontWeight:'bold',marginTop:2,marginLeft:0}}>Distance: {item.distance} , {item.duration}</Text>
                              <Text style={{fontWeight:'bold',marginTop:2,}}>Date Trip: {moment(item.date).format('MMMM, Do YYYY HH:mm')}</Text>
                              <Text style={{fontWeight:'bold',marginTop:2,}}>Number of riders: {item.amountofriders}</Text>
                              <Text style={{fontWeight:'bold',marginTop:2,}}>Name of one rider: {item.nameofonerider}</Text>
                              <Text style={{fontWeight:'bold',marginTop:2,}}>Payment Method: {item.payment}</Text>
                              <Text style={{fontWeight:'bold',marginTop:2,}}>Status Trip: {item.status_pay}</Text>
                            </Body>

                        </CardItem>
                        
                        <CardItem>
                          <Left>
                            {this.state.isFindRider == true ?    <ActivityIndicator size="large" color="#F89D29"/>:
                            <TouchableOpacity 
                              opacity="0.6" 
                              onPress={() => this._findRider(item.trip_id,item.user_id,item.driver_id,item.username,item.mobile,item.departure,item.destination,item.departureLatitude,item.departureLongitude,item.place_id_departure,item.place_id_destination,item.distance,item.duration,item.is_connect)} 
                              style={{flexDirection:"row"}}
                            >
                              <Icon name="people" style={[styles.icon,{color: '#11A0DC',fontSize:30,}]}/>
                                <Text style={{marginTop:5}}>Find Rider</Text>
                            </TouchableOpacity>
                            
                            }
                          </Left>
                          
                          <Body>
                            {item.is_found_rider > 0 ?
                            <TouchableOpacity 
                            opacity="0.6"
                             onPress={() => this._startActivityRide(item.trip_id,item.user_id,item.driver_id,item.car_id)}
                             style={{flexDirection:"row"}}
                            >
                            <Icon name="play-circle-outline" style={[styles.icon,{color: '#11A0DC',fontSize:30}]}/>
                              <Text style={{marginTop:5}}>Start</Text>
                            </TouchableOpacity>
                            :
                            <Text style={{color:"red", fontSize:15}}>Rider not found yet!</Text>

                            }
                             
                            
                          </Body>
                          {this.state.startActivity == true && <ActivityIndicator size="large" color="#F89D29" /> }
                          
                          <Right>
                            {this.state.isFindRider == true ?
                              
                              <TouchableOpacity 
                                opacity="0.6"
                                onPress={() => this._cancelFindRider()}
                                style={{flexDirection:"row"}}
                              >
                                <Icon name="clear" style={[styles.icon,{color: 'red',fontSize:30}]}/>
                                <Text style={{marginTop:3}}>Cancel</Text>
                              </TouchableOpacity> : 

                              <TouchableOpacity 
                                opacity="0.6"
                                onPress={() => this._sendMessage(item.trip_id,item.user_id,item.driver_id,item.is_connect,item.username)}
                                style={{flexDirection:"row"}}
                              >
                                <Icon name="chat" style={[styles.icon,{color: '#11A0DC',fontSize:30}]} />
                                <Text style={{marginTop:2}}>Message</Text>
                              </TouchableOpacity>
                            }
                          </Right> 
                        </CardItem>
                        
                      </Card>
                    </Content>
                    }/> :
                    <View style={{color:'red',marginTop:250,fontSize:30}}>
                          <Text>{this.state.message}</Text>
                      </View>
              }
                {this.state.isLoadingRequest == true && <ActivityIndicator size="large" color="#F89D29" /> }
          </ScrollView>
          
          {/* <Map 
            showMyModal={this.state.modalVisible}
            hideModal={this._closeModal}
            driverId ={this.state.driverId}
            userId ={this.state.userId}
            tripId ={this.state.tripId}
            departureLatitude ={this.state.departureLatitude}
            departureLongitude={this.state.departureLongitude}
            place_id_destination={this.state.place_id_destination}
            // data={this.state.data}
          /> */}
        </View>
                
        <Footer style={{marginTop:'auto'}}>
            <FooterTab  style={[styles.footerContainer]}>

                <Button vertical active onPress={() => Actions.requestRide()}>
                    <Icons name="eye" size={20} color={"#F89D29"} />
                    <Text style={{fontSize:12, color:"grey"}}>Requests</Text>
                </Button>

                <Button vertical  onPress={() => Actions.tripComplete()}>
                    <Icon name="list" size={30} color={"#F89D29"} />
                    <Text style={{fontSize:12, color:"grey"}}>Complete</Text>
                </Button>
                <Button vertical  onPress={() => Actions.profileDriver()}>
                        <Icons name="user" size={20} color={"#F89D29"} />
                        <Text style={{fontSize:12, color:"grey"}}>Profile</Text>
                </Button>
                
                <Button vertical  onPress={() => this.logout()}>
                    <Icons name="power-off" size={20} color={"#F89D29"} />
                    <Text style={{fontSize:12, color:"grey"}}>Logout</Text>
                </Button>
            </FooterTab>
        </Footer> 
       
      </Container>
    );
  }
}
export default RequestForRides;

