import React, {Component} from 'react';
import {
  Modal, 
  Text, 
  TouchableOpacity, 
  View, Alert,FlatList,ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator 
} from 'react-native';
import {Content, Card, CardItem,Left,Right,Body,Button,Header} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../../Home/components/styles';
import moment from 'moment';
import { getUrl,} from "../../config";
import { Actions } from 'react-native-router-flux';



class HistoryTripModal extends Component {
  state = {
    modalVisible: false,
    message:'You have not taken a trip yet.',
    isLoadingDelete:false
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

          this.setState({isLoadingDelete:false});
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
              <Header style={{backgroundColor:"#11A0DC"}} iosBarStyle="light-content">
                      <Left>
                          <Button transparent onPress={()=>this.setModalVisible(!this.state.modalVisible)}>
                          <Icon name="chevron-left" style={[styles.icon,{color: '#fff'}]}/>
                          </Button>
                      </Left>
                      <Body>
                          <Text style={[styles.headerText,{color:'#fff'}]}>History Unpaid Trip</Text>
                         
                      </Body>
                  </Header>
                  {this.props.isLoading == true ? <ActivityIndicator size="large" color="#F89D29" /> :
                  <View>
                  <ScrollView>
                    <KeyboardAvoidingView>
  
                        <FlatList 
                            data={this.props.historydata}
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
                                  <Text style={{fontWeight:'bold',marginTop:2,}}>Date: {moment(item.date).format('MMMM, Do YYYY HH:mm')}</Text>
                                  <Text style={{fontWeight:'bold',marginTop:2,}}>Price: ZAR {item.price}</Text>
                                    
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

        {/* <View> */}
        <Button vertical onPress={() => {this.setModalVisible(true);}}>
            <Icon name="history" color="#F89D29" size={25} style={{paddingTop:10}}/>
          </Button>
        {/* </View> */}
      </View>
    );
  }
}

export default HistoryTripModal;