import React from 'react';
import {
    Text, 
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    FlatList,
    ActivityIndicator,
    StatusBar,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
    Container,
    Body,
    Footer, 
    FooterTab,
    Content,
    Card, 
    CardItem,
    Left, 
    Thumbnail,
    Button,
    Right} from 'native-base';
import { Actions } from 'react-native-router-flux';
import styles from '../../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import HistoryModal from "../../Modal/component/historytripModal";
import TripPaid from "../../Modal/component/trippaid";
import HistoryPaymentModal from '../../Modal/component/historyPayment';
import { getUrl } from "../../config";
import moment from 'moment';
import PaymentModal from '../../Modal/component/paymentModal';


class ViewTrip extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            data:[],
            historydata:[],
            trippaid:[],
            paymenthistory:[],
            message:'You have not taken a trip yet.',
            messageHistoryTrip:'',
            messageTripPaid:'',
            messageHistoryPay:'',
            modalVisible: false,
            amount:0,
            userId:null,
            tripId:null,
            cancelled:false,
            paymentStatus:false,
            isDeleted:false,
            isLoadingTrip:false,
            isLoadingTripPaid:false,
            isLoadingHistoryTrip:false,
            isLoadingHistoryPay:false, 
            canGoBack:false,
            isUpdatedTrip:false,
            focusedLocation:{
                latitude:0,
                longitude:0,
            },
            
            //update data tripId
            updateDatas:{},
            
            //send message details
            tripid:null,
            driverid:null,
            userid:null,
            carid:null,
            isSendMessage:false,
            
            //send trip_id and  user_id to the profilDriver.js
           trip_id:null,
           user_id:null,
           isRequestDriver:false
               
        }; 
        this.intervalID;
    }
    
    componentDidMount(){
         
        this._alltrips();
        this._historyTrips();
        this._trippaid();
        this._paymenthistory();
    }

     //Payment modal
    _paynow(price,tripId,userId){
        this.setState({
            modalVisible:true,
            amount:price,
            tripId:tripId,
            userId:userId, 
        })   
        
    }
    
    //Transaction cancelled
    _cancelledTransaction = () => {
       this.setState({modalVisible:false})
    }
    
    //delete data
    async deleteData(trip_id){
        this.setState({isDeleted:true});
        try {
            await fetch(`${getUrl}deletetrip.php?trip_id=${trip_id}`)
            .then((response) => response.json())
            .then((res) => {
                    this.setState({isDeleted:false});
                    Actions.viewtrip();   
            })
            .catch((err)=>{
                this.setState({isDeleted:false});
                console.log(err);
            });
            Keyboard.dismiss();
            
        } catch (error) {
            this.setState({isDeleted:false});
            console.log(error);
        }
    }
    
    updateData = async (trip_id, user_id,location,latitude,longitude,destination,amountofriders,nameofonerider,payment,date) => {
        this.setState({isUpdatedTrip:true})
          setTimeout(() => {
            this.setState({
                updateDatas:{
                    tripId:trip_id,
                    userId:user_id,
                    destination:destination,
                    departure:location,
                    payment:payment,
                    date:date,
                    nameofonerider:nameofonerider,
                    numberofrider:amountofriders.toString(),
                    focusedLocation:{
                        latitude:latitude,
                        longitude:longitude,
                    },
                },
                
                isUpdatedTrip:false,
                
            }) 
            // alert(this.state.updateDatas.numberofrider);
            Actions.updateTrip({data:this.state.updateDatas})
          }, 2000); 

    }

    _alltrips = async () => {
        this.setState({isLoadingTrip:true});
        let mobile = await AsyncStorage.getItem('mobile');
        let token = await AsyncStorage.getItem('token');
        try {
            await fetch(`${getUrl}alltrips.php?mobile=${mobile}&token=${token}`)
            .then((response) => response.json())
            .then((res) =>{
                this.setState({isLoadingTrip:false,data:[...res]})
                // call getData() again in 5 seconds
                this.intervalID = setTimeout(this._alltrips.bind(this), 5000);
                // alert(this.state.data)
            }
            ).catch(err =>{
                this.setState({isLoadingTrip:false});
                console.log(err);
            });
        
        } catch (error) {
            this.setState({isLoadingTrip:false});
            console.log(error);
        }
    }

    _historyTrips = async () => {
        this.setState({isLoadingHistoryTrip:true});
        
        let mobile = await AsyncStorage.getItem('mobile');
        let token = await AsyncStorage.getItem('token');

       try {
        await fetch(`${getUrl}historytrip.php?mobile=${mobile}&token=${token}`)
        .then((response) => response.json())
        .then((res) =>{
            if(res){
               setTimeout(() => {
                this.setState({
                    isLoadingHistoryTrip:false,
                    historydata: res,
                  });
               }, 2000); 
            }else{
                this.setState({isLoadingHistoryTrip:false,
                messageHistoryTrip:res});
            }

        }).catch((error)=>{
            this.setState({isLoadingHistoryTrip:false});
           console.log(error);
        });
        
       } catch (error) {
           this.setState({isLoadingHistoryTrip:false});
           console.log(error);
       } 
    }

    _trippaid = async () => {
        this.setState({isLoadingTripPaid:true});
        let mobile = await AsyncStorage.getItem('mobile');
        let token = await AsyncStorage.getItem('token');
        try {
            await fetch(`${getUrl}trippaid.php?mobile=${mobile}&token=${token}`)
            .then((response) => response.json())
            .then((res) =>{
                if(res){
                    setTimeout(() => {
                        this.setState({
                            isLoadingTripPaid:false,
                            trippaid:[...res],
                        });
                    }, 2000);
                }
                else{
                    this.setState({
                        isLoadingTripPaid:false,
                        messageTripPaid:JSON.stringify(res)});
                    // alert();
                }
                
            }).catch((error)=>{
                this.setState({isLoadingTripPaid:false});
                console.log(error);
            }); 
        } catch (error) {
            this.setState({isLoadingTripPaid:false});
            console.log(error);
        }
    }

    _paymenthistory = async () =>{
        this.setState({isLoadingHistoryPay:true})
        let mobile = await AsyncStorage.getItem('mobile');
        let token = await AsyncStorage.getItem('token');
       try {
            await fetch(`${getUrl}paymentHistory.php?mobile=${mobile}&token=${token}`)
            .then((response) => response.json())
            .then((res) =>{
                if(res){
                    setTimeout(() => {
                        this.setState({
                            isLoadingHistoryPay:false,
                            paymenthistory: res,
                        });
                    }, 2000);
                    
                }else{
                    this.setState({isLoadingHistoryPay:false,messageHistoryPay:res});
                    // alert(JSON.stringify(res));
                }

            }).catch((error)=>{
                this.setState({isLoadingHistoryPay:false});
                console.log(error);
            });
       } catch (error) {
           this.setState({isLoadingHistoryPay:false});
           console.log(error);
       } 
    }
    
    //request driver
    _requestDriver = async (trip_id, user_id,driver_id,car_id) =>{
        this.setState({isRequestDriver:true,});
        setTimeout(() => {
            this.setState({
                trip_id:trip_id,
                user_id:user_id,
                isRequestDriver:false
            });
            
            if (driver_id > 0 && car_id > 0) {
              // alert('TripId: '+this.state.trip_id+'userId: '+this.state.user_id)
             Actions.profileDriverRider({tripId:this.state.trip_id,userId:this.state.user_id,tripData:this.state.data});  
            }else{
                this.setState({isRequestDriver:false,});
                Alert.alert("Info","this trip is not assigned to a driver yet. Try again later");
            }
            
             
        }, 2000);
    }
    
    render(){  
        return(
            <Container style={styles.containerModal}>
                <StatusBar 
                    backgroundColor="#11A0DC"
                    barStyle="light-content"
                    />
                {/* Load trips */}
                {this.state.isLoadingTrip == true ? <ActivityIndicator size="large" color="#F89D29" /> :
                
                <View style={{marginBottom:50}}>
                    <ScrollView>
                    <KeyboardAvoidingView>

                   {this.state.data !== null ?
                    <FlatList 
                    data={this.state.data}
                    ItemSeparatorComponent={this.renderSeparator}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => 
                
                    <Content>
                        <Card>
                        <CardItem style={{paddingTop:10,paddingBottom:25}}>
                            <Body>
                            <Text style={{fontWeight:'bold'}} >From: {item.departure}</Text>
                            <Text style={{fontWeight:'bold',marginTop:2,marginLeft:0}}>To: {item.destination}</Text>
                            <Text style={{fontWeight:'bold',marginTop:2,marginLeft:0}}>Distance: {item.distance} , {item.duration}</Text>
                            <Text style={{fontWeight:'bold',marginTop:2,}}>Number of riders: {item.amountofriders}</Text>
                            <Text style={{fontWeight:'bold',marginTop:2,}}>Date: {moment(item.date).format('MMMM, Do YYYY HH:mm')}</Text>
                            <Text style={{fontWeight:'bold',marginTop:2,}}>Price: ZAR {item.price}</Text>
                            <Text style={{fontWeight:'bold',marginTop:2,}}>Trip status: {item.status_pay}</Text>
                            <Text style={{fontWeight:'bold',marginTop:2,}}>Payment Method: {item.payment}</Text>
                            
                            {item.driver_id > 0 && item.car_id > 0 ? 
                            <Text style={{fontWeight:'bold',marginTop:2,color:'#2998ff'}}>Info: You can now request the driver!</Text> :
                            <Text style={{fontWeight:'bold',marginTop:2,color:'red'}}>Info: Waiting driver to be assigned to this trip !</Text>
                            }
                            
                            </Body>  
                        </CardItem>
                        <View style={{flexDirection:"row",justifyContent:"space-between",padding:10}}>
                        {item.payment !== 'cash' ?
                                <TouchableOpacity
                                opacity="0.6"
                                underlayColor="transparent"
                                onPress={() => this._paynow(item.price,item.trip_id,item.user_id)}   
                                >
                                    <Image 
                                        source={{uri:"https://www.payfast.co.za/images/buttons/light-small-paynow.png"}}
                                            style={{width:165,height:36}}
                                    />
                                </TouchableOpacity>
                                :
                                <View>
                                    <TouchableOpacity
                                        opacity="0.6"
                                        underlayColor="transparent"
                                        onPress={() => this._requestDriver(item.trip_id,item.user_id,item.driver_id,item.car_id)}   
                                        style={{flexDirection:"row",alignItems:"center"}}
                                    >
                                        <Icon name="taxi" style={[styles.icon,{color: '#11A0DC'}]}/>
                                        {item.driver_id > 0 ? 
                                        <Text>Request Driver</Text> :
                                        <Text>Waiting Driver...</Text>
                                        }
                                        
                                    </TouchableOpacity>
                                    
                                    {this.state.isRequestDriver == true && 
                                    <ActivityIndicator 
                                        size="large" 
                                        color="#F89D29"
                                    />
                                    
                                    }
                                    
                                </View>
                                
                                }
                                
                                {this.state.isUpdatedTrip == true ?    <ActivityIndicator 
                                    size="large" 
                                    color="#F89D29"
                                    animating={this.state.isUpdatedTrip}
                                />:<TouchableOpacity
                                    opacity="0.6"
                                    onPress={() => { this.updateData(item.trip_id,item.user_id,item.departure,item.departureLatitude,item.departureLongitude,item.destination,item.amountofriders,item.nameofonerider,item.payment,item.date)}}
                                    // style={{marginLeft:80}}
                                >
                                
                                    <Icon name="edit" size={25} color={"#11A0DC"}/>
                                </TouchableOpacity>}
                                
                                <TouchableOpacity
                                    opacity="0.6"
                                    onPress={() => { this.deleteData(item.trip_id)}}
                                >
                                    <Text transparent value={item.trip_id}> 
                                    <Icon name="trash" color="red" style={{fontSize:25}}/>  
                                    </Text>
                                </TouchableOpacity>
                                {this.state.isDeleted == true &&    <ActivityIndicator size="large" color="#F89D29"/>} 
                            
                        </View>
                        {/* <CardItem>
                            <Left>
                                
                                
                            </Left>
                            
                            <Body>
                            
                                
                            
                            </Body>
                            
                            <Right>
                                
                            </Right>                               
                            </CardItem> */}
                        </Card>
                    </Content>                       
                    }
                    /> :<View style={{flex:1,justifyContent: 'center',alignContent:"center"}}>
                        <Text>{this.state.message}</Text>
                    </View>}
                    
                    </KeyboardAvoidingView>

                    </ScrollView>
                        <PaymentModal 
                            showMyModal={this.state.modalVisible}
                            amount={this.state.amount}
                            tripId={this.state.tripId}
                            userId={this.state.userId}
                            hideModal={this._cancelledTransaction}         
                        /> 
                 </View> 
                 }
                 
                 <Footer style={{marginTop:'auto'}}>
                        <FooterTab style={[styles.footerContainer]} >
                            <TripPaid 
                                trippaid = {this.state.trippaid}
                            isLoadingTripPaid={this.state.isLoadingTripPaid}
                        />
                        
                        <HistoryModal 
                            historydata = {this.state.historydata}
                            isLoadingHistoryModal={this.state.isLoadingHistoryTrip}
                        /> 
                        
                        <HistoryPaymentModal 
                            paymenthistory = {this.state.paymenthistory}
                            isLoadingHistoryPaymentModal={this.state.isLoadingHistoryPay}
                        />
                            
                    </FooterTab>
                    </Footer>
                
        </Container>

        );
    }
}

export default ViewTrip;


