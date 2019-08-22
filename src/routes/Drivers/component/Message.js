import React from 'react';
import {
    Text, 
    View,
    ScrollView,
    Alert,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    StatusBar
} from 'react-native';
import {
  Container,
  Content,
  Header,
  Left,
  Body, 
  Right
} from 'native-base';
import styles from '../../styles';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Actions } from 'react-native-router-flux';
import io from 'socket.io-client';
import {serverExp} from '../../config';
import { GiftedChat } from 'react-native-gifted-chat'
import moment from 'moment'

class MessageDriver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tripId:null,
      userId:null,
      driverId:null,
      isConnect:null,
      username:null,
      messages: [],
    };
    this.socket
  }
  
  componentDidMount(){
    let that = this;
    that.setState({
      tripId:this.props.chatData.tripId,
      userId:this.props.chatData.userId,
      driverId:this.props.chatData.driverId,
      isConnect:this.props.chatData.isconnect,
      username:this.props.chatData.username,
      createdAt:moment().format('YYYY-MM-DD HH:mm')
    })
    
    // const socket = io(`${serverExp}`);
    //socket io
    this.socket = io(`${serverExp}`);
    this.socket.on("chat message",msg=>{
      this.setState({messages:[...this.state.messages,msg]})
    })
  }
  
  async _onSendMessage(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    // alert(JSON.stringify(messages))
    // submit message
    this.socket.emit("chat message",this.state.messages)
    //clear the textinput box
    this.setState({messages:""})
  }

  render() {
    
    return (
      <Container>
        <Header style={{backgroundColor:"#FFFFFF"}} 
          iosBarStyle="light-content"
          androidStatusBarColor="#11A0DC">
             <Left>
              <TouchableOpacity 
                onPress={() =>Actions.driver()}
                opacity="0.6"
              >
                  <Icon name="chevron-left" style={[styles.icon,{color: '#F89D29',marginTop:15}]} />
                  <Text style={[styles.headerText, {color: '#333'}]}> </Text>
              </TouchableOpacity>
            </Left>
            <Body>
                <Text style={[styles.headerText, {color: '#333'}]}>Chat with : {this.state.username} </Text>                        
            </Body>
            <Right>
              {this.state.isConnect == 1 ?
                <Icon name="toggle-on" style={[styles.icon,{color: '#28b485'}]} />
                :
                <Icon name="toggle-off" style={[styles.icon,{color: '#dc3545'}]} />
              }
            </Right>
        </Header>

        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => {
            //send message to the backend
            this._onSendMessage(messages)
          }
          }
          // _id={}
          user={{
            _id:this.state.userId,
            // from: this.state.userId,
            to: this.state.driverId,
            username:this.state.username,
            tripid:this.state.tripId,
            carid: this.state.car_id
            
          }}
          showUserAvatar
        />
      </Container>
    );
  }
}
export default MessageDriver;

