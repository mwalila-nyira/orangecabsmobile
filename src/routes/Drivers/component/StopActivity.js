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

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class StopActivity extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      data:[],
      message:"Not trip available",
      isbilledTrip:false,
      stopActivity:false,
      chatDataId:{}
      
    }
  }
  
  componentDidMount(){
    that = this;
    that.setState({data:this.props.data})
  }

  //stop activity 
  _stopActivityRide = async (trip_id,user_id,driver_id,car_id) => {
    this.setState({stopActivity:true})
      try {
        await fetch(`${getUrl}stopActivity.php`,{
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
            if(data === 'ok'){
              setTimeout(() => {
                this.setState({
                  stopActivity:false,
                });
                
                Alert.alert('Success','The trip has successfully completed at : '+moment().format('MMMM, Do YYYY HH:mm')),[{text: 'Okay'}];
                
                Actions.tripComplete({data:this.state.data});
                
              }, 2000);
              
            }else{
              this.setState({stopActivity:false});
                    Alert.alert('Failed',JSON.stringify(data)),[{text: 'Okay'}];
            }
            
          }).catch((error)=>{
            this.setState({stopActivity:false});
            console.log(error)
          })
      } catch (error) {
        this.setState({stopActivity:false});
        console.log(error)
      }
  }

  _billedTrip = async (trip_id,user_id,driver_id,car_id) => {
    this.setState({isbilledTrip:true})
    try {
      await fetch(`${getUrl}confirmPayment.php`,{
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
          if (data) {
            setTimeout(() => {
              this.setState({isbilledTrip:false})
              Alert.alert('Success',JSON.stringify(data)),[{text: 'Okay'}]
            }, 2000);
          }else{
            this.setState({isbilledTrip:false})
              Alert.alert('Failed',JSON.stringify(data)),[{text: 'Okay'}]
          }
        }).catch((error)=>{
          this.setState({isbilledTrip:false})
          console.log(error)
        })
    } catch (error) {
      this.setState({isbilledTrip:false})
      console.log(error)
    }
  }
  
  //chat message
  _sendMessage = async (trip_id, user_id) => {
    this.setState({
      chatDataId:{
        tripId:trip_id,
        userId:user_id,
      }
    })
    Actions.messageDriver({chatData:this.state.chatDataId})
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
            <Left>
              <TouchableOpacity 
                  onPress={() =>Actions.driver()}
                  opacity="0.6"
              >
                  <Icon name="chevron-left" style={[styles.icon,{color: '#FFFFFF'}]} />
              </TouchableOpacity>
            </Left>
            <Body>
                <Text style={styles.headerText}>Trip in progress</Text>                        
            </Body>
        </Header>

        <View style={[styles.Container,{marginBottom:50}]}>
          <ScrollView>
                {this.props.data !== null ?
                  <FlatList 
                  data={this.props.data}
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
                           <Body>
                           {item.payment === 'cash' &&  item.status_pay === 'unpaid'?    
                            
                            <TouchableOpacity 
                              opacity="0.6" 
                              onPress={() => this._billedTrip(item.trip_id,item.user_id,item.driver_id,item.car_id)}
                              style={{flexDirection:"row"}}
                            >
                              {this.state.isbilledTrip == true ?
                              <ActivityIndicator size="large" color="#F89D29" /> :
                              <Icon name="monetization-on" style={[styles.icon,{color: '#11A0DC',fontSize:30}]} />
                              }
                              <Text style={{marginTop:3}}>Confirm payment</Text>
                            </TouchableOpacity>
                            
                              :null
                              }
                              <TouchableOpacity 
                                opacity="0.6" 
                                onPress={() => this._stopActivityRide(item.trip_id,item.user_id,item.driver_id,item.car_id)}
                                style={{flexDirection:"row",marginTop:4}}
                              >
                              <Icon name="pause-circle-outline" style={[styles.icon,{color: '#11A0DC',fontSize:30}]}/>
                                <Text style={{marginTop:3}}>Stop</Text>
                              </TouchableOpacity>
                           </Body>
                           
                          <Right>
                              <TouchableOpacity 
                                opacity="0.6" 
                                onPress={() => this._sendMessage(item.trip_id,item.user_id)}
                                style={{flexDirection:"row"}}
                              >
                                <Icon name="chat" style={[styles.icon,{color: '#11A0DC',fontSize:30}]} />
                                <Text>Message</Text>
                              </TouchableOpacity>
                          </Right> 
                        </CardItem>
                        
                      </Card>
                    </Content>
                    }/> :<View style={{flex:1,justifyContent: 'center', alignContent:"center"}}>
                          <Text>{this.state.message}</Text>
                      </View>
              }
                
          </ScrollView>
        </View>
                
      </Container>
    );
  }
}
export default StopActivity;

