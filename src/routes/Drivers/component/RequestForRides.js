import React from 'react';
import {
    Text, 
    View,
    ScrollView,
    Alert,
    Dimensions,
    TouchableOpacity
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
  Content
} from 'native-base';
import styles from '../../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import { getUrl} from '../../config';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class RequestForRides extends React.Component {
  state = {
    messages: [],
  }

  render() {
    return (
      <Container>
        <Header style={{backgroundColor:"#11A0DC"}} 
          iosBarStyle="light-content"
          androidStatusBarColor="#F89D29">
            <Left>
              <TouchableOpacity 
                  onPress={() =>Actions.driver()}
                  opacity="0.6"
              >
                  <Icon name="chevron-left" style={[styles.icon,{color: '#FFFFFF'}]} />
              </TouchableOpacity>
            </Left>
            <Body>
                <Text style={styles.headerText}>Assigned Request Driver</Text>                        
            </Body>
        </Header>

        <View style={styles.Container}>
          <ScrollView>
            <Content>
              <Text>All request Assigned to the driver</Text>
            </Content>
          </ScrollView>
        </View>
        
        <Footer style={{marginTop:'auto'}}>
            <FooterTab  style={[styles.footerContainer]}>
                
                <Button vertical  onPress={() => Actions.driver()}>
                    <Icon name="home" size={20} color={"#F89D29"} />
                    <Text style={{fontSize:12, color:"grey"}}>Home</Text>
                </Button>

                <Button vertical active onPress={() => Actions.requestRide()}>
                    <Icon name="eye" size={20} color={"#F89D29"} />
                    <Text style={{fontSize:12, color:"grey"}}>Requests</Text>
                </Button>

                <Button vertical  onPress={() => Actions.profileDriver()}>
                    <Icon name="user" size={20} color={"#F89D29"} />
                    <Text style={{fontSize:12, color:"grey"}}>Profile</Text>
                </Button>
                <Button vertical  onPress={() => Actions.messageDriver()}>
                    <Icon active name="envelope-o" size={20} color={"#F89D29"} />
                    <Text style={{fontSize:12, color:"grey"}}>Message</Text>
                </Button>

            </FooterTab>
        </Footer> 
       
      </Container>
    );
  }
}
export default RequestForRides;

