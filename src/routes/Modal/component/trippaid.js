import React, {Component} from 'react';
import {
  Modal, 
  Text, 
  TouchableOpacity, 
  View, 
  Alert,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  StatusBar
} from 'react-native';

import {Content, Card, CardItem,Left,Body,Button,Header} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles';
import moment from 'moment';
import { getUrl } from "../../config";
import { Actions } from 'react-native-router-flux';


class TripPaidModal extends Component {
  state = {
    modalVisible: false,
    message:'',
    isLoadingDelete: false
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  
  async deleteData(trip_id){
    this.setState({isLoadingDelete:true});

    try {
        await fetch(`${getUrl}deletetrip.php?trip_id=${trip_id}`)
        .then((response) => response.json())
        .then((res) => {

          this.setState({isLoadingDelete:false,modalVisible: false});
          Actions.viewtrip();  
        })
        .catch(err=>{
          this.setState({isLoadingDelete:false});
        console.log(err);
        });
        Keyboard.dismiss();
        
    } catch (error) {
      this.setState({isLoadingDelete:false});
        console.log(error);
    }
}

  render() {
    return (
      <View style={{marginTop:0}}>
        
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(!this.state.modalVisible)}>
            
            <View style={{marginTop: 0}}>
            <StatusBar 
          backgroundColor="#11A0DC"
          barStyle="light-content"
          />
              <Header style={{backgroundColor:"#11A0DC"}} iosBarStyle="light-content">
                      <Left>
                          <Button transparent onPress={()=>this.setModalVisible(!this.state.modalVisible)}>
                          <Icon name="chevron-left" style={[styles.icon,{color: '#fff'}]}/>
                          </Button>
                      </Left>
                      <Body>
                          <Text style={styles.headerText}>Trips Paid</Text>
                         
                      </Body>
                  </Header>
                  {this.props.isLoadingTripPaid == true ? <ActivityIndicator size="large" color="#F89D29" /> : 
                  <View>
                  <ScrollView>
                    <KeyboardAvoidingView>
  
                        <FlatList 
                            data={this.props.trippaid}
                            ItemSeparatorComponent={this.renderSeparator}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item}) => 
                        
                            <Content>
                              <Card>
                                <CardItem style={{paddingTop:10,paddingBottom:35}}>
                                  <Body>
                                  <Text style={{fontWeight:'bold'}} >From: {item.departure}</Text>
                                  <Text style={{fontWeight:'bold',marginTop:2,marginLeft:0}}>To: {item.destination}</Text>
                                  <Text style={{fontWeight:'bold',marginTop:2,marginLeft:0}}>Distance: {item.distance} , {item.duration}</Text>
                                  <Text style={{fontWeight:'bold',marginTop:2,}}>Date Pick up: {moment(item.date).format('MMMM, Do YYYY HH:mm')}</Text>
                                  <Text style={{fontWeight:'bold',marginTop:2,}}>Price: ZAR {item.price}</Text>
                                  <Text style={{fontWeight:'bold',marginTop:2,}}>Driver: {item.username}</Text>
                                  <Text style={{fontWeight:'bold',marginTop:2,}}>Model car:  {item.model_type}</Text>
                                  <Text style={{fontWeight:'bold',marginTop:2,}}> Brand car: {item.brand_car}</Text>
                                  <Text style={{fontWeight:'bold',marginTop:2,}}>Color car: {item.color}</Text>
                                  <Text style={{fontWeight:'bold',marginTop:2,}}>Registration:  {item.vehicule_registration}</Text>
                             
                                 <Text style={{fontWeight:'bold',marginTop:2,}}>Date Trip: {moment(item.date).format('MMMM, Do YYYY HH:mm')}</Text>
                                 <Text style={{fontWeight:'bold',marginTop:2,}}>Payment Method: {item.payment}</Text>
                                 <Text style={{fontWeight:'bold',marginTop:2,}}>Status Pay Trip: {item.status_pay}</Text>
                                 
                                 <Text style={{fontWeight:'bold',marginTop:2,}}>Status Trip: {item.status_trip}</Text>
                                    
                                    <TouchableOpacity
                                      opacity="0.6"
                                        onPress={() => { this.deleteData(item.trip_id)}}
                                        style={{marginTop:-50,marginLeft:250}}
                                        >
                                        <Text transparent value={item.trip_id}> 
                                          <Icon name="trash" color="red" style={{fontSize:25}}/>  
                                        </Text>
                                    </TouchableOpacity>
                                    {this.state.isLoadingDelete == true &&
                                      <ActivityIndicator size="large" color="#F89D29"/>}
                                    </Body>
                                    
                                </CardItem>
                              </Card>
                            </Content>                       
                    }
                  />
                  </KeyboardAvoidingView>
                  </ScrollView>
                </View>
                }
                
              
                
            </View>
        </Modal>
          <Button vertical onPress={() => {this.setModalVisible(true);}}>
            <Icon 
              name="eye"
              style={[styles.icon,{color: '#11A0DC',fontSize:25,paddingLeft:20}]}
            />
          </Button>
      </View>
    );
  }
}

export default TripPaidModal;