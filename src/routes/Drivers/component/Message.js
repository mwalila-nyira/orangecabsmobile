import React from 'react';
// import {
//     Text, 
//     View,
//     ScrollView,
//     Alert,
//     Dimensions,
//     TouchableOpacity,
//     StyleSheet,
//     StatusBar,
//     KeyboardAvoidingView,
//     Platform
// } from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
  Button
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
import Icons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Actions } from 'react-native-router-flux';
import io from 'socket.io-client';
import {serverExp} from '../../config';
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
      type:"out",
      date:"",
      chatMessage:"",
      isTyping:false,
      messages: []
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
      date:moment().format('YY-M-DD HH:mm A')
    })
    
    // const socket = io(`${serverExp}`);
    //socket io
    this.socket = io(`${serverExp}`);
    //listening from the server 
    this.socket.on("chatOutComing",chatOutComing=>{
      // alert(chatOutComing[0].message);
      const data = {
        type:chatOutComing.type,
        message:chatOutComing.message,
        date:chatOutComing.date
      }  
      this.setState({messages:[...this.state.messages,data]})
    })
    this.socket.on('chatInComing',chatInComing => {
      if (chatInComing.driverId == this.state.driverId && chatInComing.tripId == this.state.tripId && chatInComing.userId == this.state.userId) {
        let type = "";
        if (chatInComing.type === 'out') {
          type = chatInComing.type = "in";
        } 
        const dataIn = {
           message : chatInComing.message,
           date : chatInComing.date,
           type:type
        } 
        this.setState({messages:[...this.state.messages,dataIn]})
      }
    })
    
    //listening for feedback onKeyPress
    this.socket.on('typingRider',typingRiderData =>{
      if (typingRiderData.tripId == this.state.tripId && typingRiderData.driverId == this.state.driverId && typingRiderData.userId == this.state.userId) {
        this.setState({isTyping:true});
      }
    })
    
  }
  
  async _onSendMessage() {
    const data ={
      message:this.state.chatMessage,
      tripId:this.state.tripId,
      userId:this.state.userId,
      driverId:this.state.driverId,
      username:this.state.username,
      date:this.state.date,
      type:this.state.type,
    };
    // submit message
    this.socket.emit("chatOutComing",data)
    //clear the textinput box
    this.setState({
      isTyping:false,
      chatMessage:"",
      });
    
  }
  
  renderDate = (date) => {
    return(
      <Text style={styles.time}>
        {date}
      </Text>
    );
  }

  render() {
    
    return (
      <Container>
        <Header style={{backgroundColor:"#FFFFFF"}} 
          iosBarStyle="light-content"
          androidStatusBarColor="#11A0DC">
             <Left>
              <TouchableOpacity 
                onPress={() =>Actions.requestRide()}
                opacity="0.6"
              >
                  <Icon name="chevron-left" style={[styles.icon,{color: '#F89D29',marginTop:15}]} />
                  <Text style={[styles.headerText, {color: '#333'}]}> </Text>
              </TouchableOpacity>
            </Left>
            <Body>
              {this.state.isTyping == true ?
                <Text style={[styles.headerText, {color: '#333'}]}>Chat with :  {this.state.username} typing ...</Text>
                :
                <Text style={[styles.headerText, {color: '#333'}]}>Chat with :  {this.state.username}</Text>
                }                       
            </Body>
            <Right>
              {this.state.isConnect == 1 ?
                <Icon name="toggle-on" style={[styles.icon,{color: '#28b485'}]} />
                :
                <Icon name="toggle-off" style={[styles.icon,{color: '#dc3545'}]} />
              }
            </Right>
        </Header>
          <View style={styles.containerMes}>
            <FlatList style={styles.list}
              data={this.state.messages}
              keyExtractor={(item,index) => index.toString()}
              renderItem={(message) => {
                // console.log(item);
                const item = message.item;
                let inMessage = item.type === 'in';
                let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
                return (
                  <View style={[styles.item, itemStyle]}  >
                    {!inMessage && this.renderDate(item.date)}
                    <View style={[styles.balloon]}>
                      <Text>{item.message}</Text>
                    </View>
                    {inMessage && this.renderDate(item.date)}
                  </View>
                )
              }}/>
            <View style={styles.footer}>
              <View style={styles.inputContainer}>
                <TextInput style={styles.inputs}
                    placeholder="Write a message..."
                    underlineColorAndroid='transparent'
                    multiline={true}
                    autoCorrect={false}
                    onChangeText={(chatMessage) => this.setState({chatMessage})}
                    value={this.state.chatMessage}
                    onSubmitEditing={() => this._onSendMessage()}
                    onKeyPress={() => { 
                      this.socket.emit('typingDriver',{driverId:this.state.driverId,
                      userId:this.state.userId,
                      tripId:this.state.tripId,});
                      this.setState({isTyping:false})
                    }}
                    />
              </View>

                <TouchableOpacity 
                  style={styles.btnSend}
                  onPress={() => this._onSendMessage()}
                >

                  <Icons name="send" sstyle={[styles.iconSend,{color: '#FFFFFF',fontSize:30}]}/>
                  
                </TouchableOpacity>
              </View>
          </View>
       </Container>
    );
  }
}
export default MessageDriver;

