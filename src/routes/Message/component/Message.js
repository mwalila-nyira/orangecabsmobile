import React from 'react';
import {
    Text, 
    View,
    ScrollView,
    Alert,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    TouchableHighlight,
    TextInput,
    Button,
    FlatList
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


class MessageApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tripId:null,
      userId:null,
      driverId:null,
      carId:null,
      isConnect:null,
      username:null,
      type:"",
      date:"",
      chatMessage:"",
      isTyping:false,
      messages: []
    }
  }
 
  componentDidMount(){
    let that = this;
    that.setState({
      tripId:this.props.chatData.tripId,
      userId:this.props.chatData.userId,
      driverId:this.props.chatData.driverId,
      carId:this.props.chatData.carId,
      isConnect:this.props.chatData.isConnect,
      username:this.props.chatData.username,
      date:moment().format('YY-M-DD HH:mm A')
    })
    
    //make socket io connection
    this.socket = io(`${serverExp}`);
    
    //listening from the server 
    this.socket.on('chatInComing',chatInComing => {
      const data = {
         type : chatInComing.type,
         message : chatInComing.message,
         date : chatInComing.date
      } 
      this.setState({messages:[...this.state.messages,data]});
    })
    
    this.socket.on("chatOutComing",chatOutComing=>{
      // console.log(chatOutComing);
      if (chatOutComing.driverId == this.state.driverId && chatOutComing.tripId == this.state.tripId && chatOutComing.userId == this.state.userId) {
        let type = "";
        if (chatOutComing.type === 'out') {
          type = chatOutComing.type = 'in';
        } 
        const dataOut ={
           message : chatOutComing.message,
           date : chatOutComing.date,
           type:type
        } 
        this.setState({messages:[...this.state.messages,dataOut]})
      }
    })
    
    //listening for feedback onKeyPress
    this.socket.on('typingDriver',typingDriverData =>{
      if (typingDriverData.tripId == this.state.tripId && typingDriverData.driverId == this.state.driverId && typingDriverData.userId == this.state.userId) {
        this.setState({isTyping:true});
      }
    })
  }
  
  async _onSendMessage() {
    const data = {
      message:this.state.chatMessage,
      tripId:this.state.tripId,
      userId:this.state.userId,
      driverId:this.state.driverId,
      username:this.state.username,
      date:this.state.date,
      type:"out",
    };
    // submit message
    this.socket.emit("chatInComing",data)
    //clear the textinput box
    this.setState({
      isTyping:false,
      chatMessage:""})
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
                onPress={() =>Actions.viewtrip()}
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
                  <View style={[styles.item, itemStyle]}>
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
                    autoCorrect= {false}
                    onChangeText={(chatMessage) => this.setState({chatMessage})}
                    value={this.state.chatMessage}
                    onSubmitEditing={() =>{ 
                      this._onSendMessage();
                      this.setState({isTyping:false})
                    }}
                    onKeyPress={() => { 
                      this.socket.emit('typingRider',{driverId:this.state.driverId,
                      userId:this.state.userId,
                      tripId:this.state.tripId,
                     });
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

export default MessageApp;

