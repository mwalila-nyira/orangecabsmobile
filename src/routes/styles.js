const React = require("react-native");
const { Dimensions, Platform ,StyleSheet} = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
export default {
  imageContainer: {
    flex: 1,
    width: null,
    height: null,
    aligneItems:"center"
  },
  logoContainer: {
    flex: 1,
    marginTop: deviceHeight / 5,
  },
  logo: {
    position: "absolute",
    left: Platform.OS === "android" ? 140 : 140,
    top: Platform.OS === "android" ? 35 : 60,

  },
  textAccueil: {
    color: "#333",
    bottom: 6,
    marginTop: 5,
    fontSize:deviceWidth * 0.037
    
  },

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center'
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    marginTop: 30,
  },
  formContainer: {
    marginTop: 30,
    paddingHorizontal: 30,
  },
  textInputStyle: {
    height: 50,
    fontSize: 16,
    paddingLeft:5,
    color: 'black',
    paddingBottom:15
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
    marginTop: 30,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#11A0DC',
  },
  buttonText: {
    fontSize: deviceWidth * 0.037,
    color: '#11A0DC',
    fontWeight: 'bold',
  },
  buttonSignup: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  buttonTextSignup: {
    fontSize: 12,
  },
  buttonTextSignupw: {
    fontSize: deviceWidth * 0.037,
    marginTop:20,
    alignItems:'center'
  },
  viewTextRights: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,

  },
  textRights: {
    fontSize: deviceWidth * 0.037,
    color: '#11A0DC',
  },
  buttonRiderDriver:{
    width:"90%",
    alignSelf:"center",
    borderRadius: 5,
  },
  icon: {
    color:"#000",
    fontSize:20
  },
  headerText:{
      color:"#fff",
      // fontSize:20
  },
  // logo: {
  //     width:38,
  //     height:30,
  //     paddingBottom:10
  // },
  footerContainer:{
      backgroundColor:"#fff",
      // marginTop:'auto'
  },
  subText:{
      fontSize:8
  },

  InputDriverContainer:{
      color:"orange"
  },
  containerModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

};
