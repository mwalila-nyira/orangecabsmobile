import { Platform,StyleSheet } from 'react-native';

const styles = {
    container: {
      ...StyleSheet.absoluteFillObject,
    },
    imageContainer: {
      alignItems: 'center',
    },
    image: {
      width: 200,
      height: 100,
      marginTop: 30,
    },
    formContainer: {
      marginTop: 30,
      paddingHorizontal: 30,
    },
    textInputStyle: {
      height: 40,
      fontSize: 16,
      paddingLeft:5,
      color: 'black',
    },
    textInputBottomLine: {
      height: 1,
      backgroundColor: (Platform.OS == 'ios') ? '#E6E7E9': '#11A0DC',
    },
    button: {
      height: 40,
      width: 300,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 60,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: '#057DC1',
    },
    buttonText: {
      fontSize: 17,
      color: '#057DC1',
      fontWeight: 'bold',
    },
    buttonSignup: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
    },
    buttonTextSignup: {
      fontSize: 12,
    },
    viewTextRights: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 75,
    },
    textRights: {
      fontSize: 10,
      color: '#11A0DC',
    },
    footerContainer:{
      backgroundColor:"#FFFFFF",
      
      //  backgroundColor: (Platform.OS == 'ios') ? '#E6E7E9': '#11A0DC'
      // marginTop:'auto'
    },
  };

  export default styles;