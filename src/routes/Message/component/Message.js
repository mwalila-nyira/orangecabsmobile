import React from 'react';
import {
    Text, 
    View,
    ScrollView,
    Alert,
    TextInput,
    Dimensions,
    TouchableHighlight,
} from 'react-native';
import {Container,Content } from 'native-base';
import styles from '../../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class MessageApp extends React.Component {
  state = {
    messages: [],
  }

  render() {
    return (
      <Container>
        <View style={styles.Container}>
          <ScrollView>
            <Content>
              <Text>Message</Text>
            </Content>
          </ScrollView>
        </View>
      </Container>
    );
  }
}
export default MessageApp;

