import React, {Component} from 'react'
import {Modal, View, Text} from 'react-native'
import { WebView } from 'react-native-webview';
import {Header, Left, Body, Button} from 'native-base';
import styles from '../../styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const PaymentModal = (props)=>(
    <View>
        <Modal 
            animationType="slide"
            transparent={false}
            visible={props.showMyModal}
            onRequestClose={props.hideModal}>
             <View>
             <Header style={{backgroundColor:"#11A0DC"}} iosBarStyle="light-content">
                      <Left>
                          <Button transparent onPress={props.hideModal}>
                          <Icon name="chevron-left" style={[styles.icon,{color: '#fff'}]}/>
                          </Button>
                      </Left>
                      <Body>
                          <Text style={styles.headerText}>Go back</Text>
                         
                      </Body>
                  </Header>
            </View>   
                <WebView 
                  startInLoadingState 
                  canGoBack={true}
                  scalesPageToFit
                  source={{ uri: `https://www.payfast.co.za/eng/process?amount=${props.amount}&merchant_id=13515506&merchant_key=yjf3e6lbkveve&return_url=http://10.0.0.44/orangecabs/app/success.php?trip_id=${props.tripId}&user_id=${props.userId}&item_name=Pay+Now+And+Make+Your+Trip+%2F+Orange+cabrs&cancel_url=http://10.0.0.44/orangecabs/app/cancel.php?tip_id=${props.tripId}&user_id=${props.userId}` }}
                />
                
        </Modal>
    </View>
)

export default PaymentModal