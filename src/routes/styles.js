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
  },
  
 //chat message
 marioChat:{
  maxWidth: 600,
  marginLeft:0,
  marginTop:0,
  marginBottom:0,
  borderWidth: 1,
  borderColor:"#ddd",
  // boxShadow: 1 3 5 rgba(0, 0, 0, 0.05),
  borderRadius:2,
},

chatwindow:{
  height: 400,
  background: "#f9f9f9",
},

output:{
  paddingTop: 14 ,
  PaddingBottom:14,
  paddingLeft:0,
  paddingRight:0,
  marginTop:0,
  marginBottom:0,
  marginLeft: 20,
  marginRight:20,
  borderBottom: 1,
  borderColor:"#e9e9e9",
  color: "#555",
  // color: #575ed8,
},

feedback:{
  color: "#aaa",
  paddingTop: 14 ,
  PaddingBottom:14,
  paddingLeft:0,
  paddingRight:0,
  marginTop:0,
  marginBottom:0,
  marginLeft: 20,
  marginRight:20,
},

// label :{
//   boxSizing: 'borderBox',
//   display: 'block',
//   paddingTop: 10 ,
//   PaddingBottom:10,
//   paddingLeft:20,
//   paddingRight:20,
// },

input: {
  padding: 20,
  backgroundColor: "#eee",
  borderWidth:0.5,
  borderColor:"#11A0DC",
  flexDirection:'column',
  width: "100%",
  background: "#fff",
  borderBottom: 1,
  borderColor:"#eee",
  fontFamily: 'Nunito',
  fontSize: 16,
},

buttonMessage :{
  backgroundColor: "#11A0DC",
  color: "#fff",
  fontSize: 18,
  border: 0,
  paddingTop: 12,
  PaddingBottom:12,
  paddingLeft:0,
  paddingRight:0,
  width: "100%",
  borderRadius: 2,
},


//chat message okay
containerMes:{
  flex:1
},
list:{
  paddingHorizontal: 17,
},
footer:{
  flexDirection: 'row',
  height:60,
  backgroundColor: '#eeeeee',
  paddingHorizontal:10,
  padding:5,
},
btnSend:{
  backgroundColor:"#11A0DC",
  width:40,
  height:40,
  borderRadius:360,
  alignItems:'center',
  justifyContent:'center',
},
iconSend:{
  width:30,
  height:30,
  alignSelf:'center',
},
inputContainer: {
  borderBottomColor: '#F5FCFF',
  backgroundColor: '#FFFFFF',
  borderRadius:30,
  borderBottomWidth: 1,
  height:40,
  flexDirection: 'row',
  alignItems:'center',
  flex:1,
  marginRight:10,
},
inputs:{
  height:40,
  marginLeft:16,
  borderBottomColor: '#FFFFFF',
  flex:1,
},
balloon: {
  maxWidth: 250,
  padding: 15,
  borderRadius: 20,
},
itemIn: {
  alignSelf: 'flex-start',
  backgroundColor:"#11A0DC"
},
itemOut: {
  alignSelf: 'flex-end'
},
time: {
  alignSelf: 'flex-end',
  margin: 15,
  fontSize:12,
  color:"#808080",
},
item: {
  marginVertical: 14,
  flex: 1,
  flexDirection: 'row',
  backgroundColor:"#eeeeee",
  borderRadius:300,
  padding:5,
},
  
};
