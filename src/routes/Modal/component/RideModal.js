import React, {Component} from 'react'
import {
    Modal, 
    View, 
    Text, 
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    FlatList
} from 'react-native'
import {
    Left, 
    Body,  
    Right,
    Button, 
    Card,
    CardItem,
    Content,} from 'native-base';
import styles from '../../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';

class RideModal extends Component{

constructor(props) {
    super(props);
    this.state = {
    modalVisible: false,
    isFindingRider: false,
    isSending: false,
    chatDataId:{}
    };
}

setModalVisible(visible) {
    this.setState({modalVisible: visible});
}

//chat message
_sendMessage = async (trip_id, user_id,driver_id,isconnect,username) => {
  this.setState({isSending:true});
  setTimeout(() => {
    this.setState({
      chatDataId:{
        tripId:trip_id,
        userId:user_id,
        driverId:driver_id,
        isconnect:isconnect,
        username:username,
      },
      modalVisible: false,
    })
    // alert(JSON.stringify(this.state.chatDataId))
    Actions.messageDriver({chatData:this.state.chatDataId})
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
             Alert.alert('Modal has been closed.');
            this.setModalVisible(!this.state.modalVisible);
        }}>
        <View style={{marginTop: 'auto', backgroundColor:"#FFFFFF"}}>

              <Card style={{padding:20}}>
                 <CardItem>
                 <Left>
                     <Icon name="account-circle" style={[styles.icon,{color: '#11A0DC',fontSize:40}]}/>
                     <Body>
                         <Text style={{fontWeight:'bold',marginTop:2,}}>Rider Details for this trip </Text>
                         <Text note style={{fontWeight:'bold',marginTop:2,}}>Name: {this.props.data.username}</Text>
                         <Text note style={{fontWeight:'bold',marginTop:2,}}>Mobile: {this.props.data.mobile}</Text>  
                     </Body>
                 </Left>
                 </CardItem>
                
                 <CardItem cardBody >
                   <Body style={{paddingLeft:20}}>
                     <Text style={{fontWeight:'bold',marginTop:2,}}>From :  {this.props.data.departure}</Text>
                     <Text style={{fontWeight:'bold',marginTop:2,}}>To :  {this.props.data.destination}</Text>
                    
                     <Text style={{fontWeight:'bold',marginTop:2,}}>Distance : {this.props.data.distance}</Text>
                     <Text style={{fontWeight:'bold',marginTop:2,}}>Duration: {this.props.data.duration}</Text>
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
                          <Text>Rider Route</Text>
                      </TouchableOpacity>
                        {this.state.isFindingRider == true &&   <ActivityIndicator size="large" color="#F89D29"/>}
                    </Left>
                    
                    <Right>
                      <TouchableOpacity 
                      opacity="0.6"  
                      onPress={() => this._sendMessage(this.props.data.tripId,this.props.data.userId,this.props.data.driverId,this.props.data.isconnect,this.props.data.username)}
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

        </Modal>

        <TouchableOpacity 
            onPress={() => {
                this.setModalVisible(true);
              }}
            style={{padding:7,backgroundColor:"#11A0DC",color:"#FFFFFF",flexDirection:"row"}}
        >
            <Icon name="account-circle" style={[styles.icon,{color: '#FFFFFF'}]}/>
            <Text style={{color:"#fff", fontSize:15,}}>Rider</Text>
        </TouchableOpacity>
        
    </View>
    );
}
}

export default RideModal;
              
              