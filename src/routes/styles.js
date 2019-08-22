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
    fontSize:20,
    paddingRight:10
  },
  headerText:{
      color:"#fff",
      // fontSize:20
  },
  headerTextDriver:{
    color:"##333",
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
  btn:{
    flexDirection:'row',
    alignItems: 'center'
  },
  suggestions: {
    backgroundColor:'white',
    fontSize:18,
    borderWidth:0.5,
    padding:5,
    marginLeft:0,
    marginRight:0
  },
  formContainerUpdate: {
    marginTop: 30,
    paddingHorizontal: 10,
  },
  directionContainer: {
    backgroundColor:'#fff',
    marginTop: 'auto',
    padding:15,
    // marginTop:Platform.OS === "android" ? 330 : 400,
    // alignSelf:'center',
    paddingLeft:30,
    paddingRight:30
  },
  findDriverRiderText: {
    fontSize:20,
    color:'#fff',
  },
  findDriverRiderContainer: {
    backgroundColor:'#11A0DC',
    marginTop: 10,
    padding:10,
    color: '#FFFFFF',
    // margin:20,
    alignSelf:'center',
    marginLeft:170
    // paddingLeft:30,
    // paddingRight:30
  },

  //chat message style
  ContainerMessage:{
    // ...absoluteFillObject,
    flex: 1,
    backgroundColor:"#FFFFFF"
    
  },
  messageInput:{
    height:40,
    borderWidth:0.5,
    marginLeft:5,
    marginRight:5,
    // padding:15,
    backgroundColor:'#fff',
    opacity:0.9,
    borderRadius:7,
    width:300
  }
};
