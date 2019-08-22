import React, {Component} from 'react'
import {
  Modal, 
  View, 
  Text, 
  TouchableOpacity,
  StatusBar,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native'
import {
  Left, 
  Body,  
  Right,
  Button,
  Header, 
  Card,
  CardItem,
  Content,} from 'native-base';
import styles from '../../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from "moment";
import { Actions } from 'react-native-router-flux';

class NavigationDriverMap extends Component{
  
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      isSending:false,
      chatDataId:{}
    };
  }
  
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  
  //chat message
  _sendMessage = async (trip_id,user_id,driver_id,car_id,status,username) => {
    this.setState({isSending:true})
    setTimeout(() => {
      this.setState({
        chatDataId:{
          tripId:trip_id,
          userId:user_id,
          driverId:driver_id,
          carId:car_id,
          isConnect:status,
          username:username,
        },
        isSending:false,
        modalVisible: false,
      })
      
      // alert(JSON.stringify(this.state.chatDataId))
    Actions.message({chatData:this.state.chatDataId})
    
    }, 2000);
    
  }
  
  render() {
    return (
      <View style={{marginTop: 'auto'}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            this.setModalVisible(!this.state.modalVisible);
          }}>
          {this.props.isLoading == true ?
              <ActivityIndicator size="large" color="#F89D29"/> :
          <View style={{marginTop: 'auto', backgroundColor:"#FFFFFF"}}>
            <View>
            
              <FlatList 
                data={this.props.data}
                ItemSeparatorComponent={this.renderSeparator}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => 
                <Content>
                <Card>
                <CardItem>
                    <Left>
                    <Icon name="account-circle" style={[styles.icon,{color: '#11A0DC',fontSize:40}]}/>
                    <Body>
                        <Text style={{fontWeight:'bold',marginTop:2,}}>Driver Details </Text>
                        <Text note style={{fontWeight:'bold',marginTop:2,}}>Name: {item.username}</Text>
                        <Text note style={{fontWeight:'bold',marginTop:2,}}>Mobile: {item.mobile}</Text>
                        {/* <Text note style={{fontWeight:'bold',marginTop:2,}}>Mail: {item.email}</Text> */}   
                    </Body>
                    
                    </Left>
                </CardItem>
                
                <CardItem cardBody >
                  <Body style={{paddingLeft:20}}>
                    <Text style={{fontWeight:'bold',marginTop:2,}}>Car Details:  {item.model_type} / {item.brand_car} / {item.color}</Text>
                    <Text style={{fontWeight:'bold',marginTop:2,}}>Registration:  {item.vehicule_registration}</Text>
                    
                    <Text style={{fontWeight:'bold',marginTop:2,}}>Date Trip: {moment(item.date).format('MMMM, Do YYYY HH:mm')}</Text>
                    <Text style={{fontWeight:'bold',marginTop:2,}}>Payment Method: {item.payment}</Text>
                    <Text style={{fontWeight:'bold',marginTop:2,}}>Status Pay Trip: {item.status_pay}</Text>
                  </Body>
  
                </CardItem>
                
                <CardItem>
                    <Left>
                      <TouchableOpacity 
                      opacity="0.6" 
                      onPress={() => {
                        this.setModalVisible(!this.state.modalVisible); 
                      }} 
                      style={{flexDirection:"row",marginTop:5}}
                      >
                          <Icon name="person-pin-circle" style={[styles.icon,{color: '#11A0DC',fontSize:30}]}/>
                          <Text>Driver Route</Text>
                      </TouchableOpacity>
                        {this.state.isFindingDriver == true &&   <ActivityIndicator size="large" color="#F89D29"/>}
                    </Left>
                    
                    <Right>
                      <TouchableOpacity 
                      opacity="0.6"  
                      onPress={() => this._sendMessage(item.trip_id,item.user_id,item.driver_id,item.car_id,item.is_connect,item.username)}
                      style={{flexDirection:"row",marginTop:5}}
                      >
                        <Icon name="chat" style={[styles.icon,{color: '#11A0DC',fontSize:30}]}/>
                        <Text>Message</Text>
                      </TouchableOpacity>
                      {this.state.isSending == true &&
                        <ActivityIndicator size="large" color="#F89D29" />
                      }
                    </Right>
                  </CardItem>                                 
                  </Card>
              </Content>                                   
              }
              />
              
            </View>
            
              <TouchableOpacity 
                  opacity="0.6"
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible); 
                  }}
                  style={{flexDirection:"row",paddingLeft:10}}
                >
                  <Icon name="clear" style={[styles.icon,{color: 'red',fontSize:30}]} />
                  <Text style={{marginTop: 5}}>Close</Text>
              </TouchableOpacity>
              
          </View>
           } 
        </Modal>

        <TouchableOpacity 
          opacity="0.6"
          onPress={() => {
            this.setModalVisible(true);
          }}
          style={{padding:7,backgroundColor:"#11A0DC",color:"#FFFFFF",flexDirection:"row"}}
        >
          <Icon name="account-circle" style={[styles.icon,{color: '#FFFFFF'}]}/>
          <Text style={{color:"#fff", fontSize:15,}}>Driver</Text>
        </TouchableOpacity>
        
      </View>
    );
  }
}

export default NavigationDriverMap;

