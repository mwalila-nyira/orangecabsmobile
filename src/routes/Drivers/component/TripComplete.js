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


class TripComplete extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data:[],
      isLoadingRequest:false,
      message:"",
    }
  }
  
  componentDidMount(){
    this._allrequesttrips();
}
  
    //Get all the request assigned for ride
    _allrequesttrips = async () => {
      this.setState({isLoadingRequest:true});
      let mobile = await AsyncStorage.getItem('mobile_driver');
      let token = await AsyncStorage.getItem('token_driver');
      try {
          await fetch(`${getUrl}completeAssignDriver.php?mobile=${mobile}&token=${token}`)
          .then((response) => response.json())
          .then((res) =>{
              if(res){
                setInterval(() => {
                  this.setState({isLoadingRequest:false,data:res})
                }, 2000);
                // alert(this.state.data)
              }else{
                this.setState({isLoadingRequest:false,message:JSON.stringify(res)});
                Alert.alert('Info',JSON.stringify(res)),[{text: 'Okay'}]
              }
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
        <StatusBar 
          backgroundColor="#11A0DC"
          barStyle="light-content"
        />
        <Header style={{backgroundColor:"#11A0DC"}} 
          iosBarStyle="light-content"
          androidStatusBarColor="#11A0DC">
            <Left>
              <TouchableOpacity 
                  onPress={() =>Actions.requestRide()}
                  opacity="0.6"
              >
                  <Icon name="chevron-left" style={[styles.icon,{color: '#FFFFFF',fontSize:25}]} />
              </TouchableOpacity>
            </Left>
            <Body>
                <Text style={styles.headerText}>Trip Complete</Text>                        
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
                              <Text style={{fontWeight:'bold',marginTop:2,}}>start trip date: {moment(item.start_activity_date).format('MMMM, Do YYYY HH:mm')}</Text>
                              <Text style={{fontWeight:'bold',marginTop:2,}}>End trip date: {item.end_trip_date}</Text>
                              <Text style={{fontWeight:'bold',marginTop:2,}}>Billed trip: {item.status_pay}</Text>
                              <Text style={{fontWeight:'bold',marginTop:2,}}>Payment Method: {item.payment}</Text>
                              <Text style={{fontWeight:'bold',marginTop:2,}}>Status Trip: {item.status_trip}</Text>
                            </Body>

                        </CardItem>
                        
                        <CardItem>
                            <Left>
                            <TouchableOpacity 
                                opacity="0.6"
                                onPress={() => Actions.requestRide()}
                                style={{flexDirection:"row"}}
                            >
                              <Icon name="clear" style={[styles.icon,{color: 'red',fontSize:30}]} />
                              <Text style={{marginTop:3,}}>Close</Text>
                            </TouchableOpacity>

                          </Left>
                           
                        </CardItem>
                        
                      </Card>
                    </Content>
                    }/> :<View style={{flex:1,justifyContent: 'center', alignContent:"center"}}>
                          <Text>{this.state.message}</Text>
                      </View>
              }
              {this.state.isLoadingRequest == true && <ActivityIndicator size="large" color="#F89D29" /> }
          </ScrollView>
        </View>
                
      </Container>
    );
  }
}
export default TripComplete;

