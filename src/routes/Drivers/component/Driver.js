import React, { Component } from 'react';
import {
    Alert,
    StyleSheet,
    View,
    StatusBar,
    Dimensions,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    Image,
    Platform,
    Linking
} from 'react-native';

import { Container } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Actions } from 'react-native-router-flux';
import { getUrl, serverExp } from "../../config";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import apiKey from "../../google_api_key";
import PolyLine from '@mapbox/polyline';
import socketIo from 'socket.io-client';
import icons from '../../styles';
import RideModal from '../../Modal/component/RideModal';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;

const LATITUDE_DELTA = 0.0922;

const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;


export default class ProfileDriver extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error:"",
            pointCoords:[],
            routeResponse:[],
            indicator: false,
            
            focusedLocation:{
              latitude:-33.9305686,
              longitude:18.4731583,
              latitudeDelta:LATITUDE_DELTA,
              longitudeDelta:LONGITUDE_DELTA
            },
            locationChosen:false,
            
            lookForPassengers: false,
            datafindrider: [],
            modalVisible: false,
            isriderfound:false,
            dataResponse:[]
        };
        //Automatically Refreshing Data 
        this.intervalID;
        this.watchID;
        this.socket;
    }

    componentDidMount() { 
        //get data from requestRide
        let that = this;
        that.setState({
            datafindrider: this.props.data
        });

        //disponibilize data object getting from Request for Rider Screen 
        this.props.data;

        // alert(JSON.stringify(this.props.data));

        this.getCurrentLocationHandler(); 
       
        //make a socket io connect
        this.socket = socketIo.connect(`${serverExp}`);
        
        //background-geolocation configuration
        BackgroundGeolocation.configure({
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 50,
            distanceFilter: 50,
            notificationTitle: 'Background tracking',
            notificationText: 'enabled',
            debug: true,
            startOnBoot: false,
            stopOnTerminate: true,
            locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
            interval: 10000,
            fastestInterval: 5000,
            activitiesInterval: 10000,
            stopOnStillActivity: false,
            // url: 'http://192.168.81.15:3000/location',
            // httpHeaders: {
            //   'X-FOO': 'bar'
            // },
            // // customize post properties
            // postTemplate: {
            //   lat: '@latitude',
            //   lon: '@longitude',
            //   foo: 'bar' // you can also add your own properties
            // }
          });
          
          //authorization of background-geolocation to run in the background
          BackgroundGeolocation.on('authorization', (status) => {
            console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
            if (status !== BackgroundGeolocation.AUTHORIZED) {
              // we need to set delay or otherwise alert may not be shown
              setTimeout(() =>
                Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
                  { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
                  { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
                ]), 1000);
            }
          });
        
    }
    
    componentWillUnmount() {
        // unregister all event listeners
        BackgroundGeolocation.removeAllListeners();
        navigator.geolocation.clearWatch(this.watchID);
      }
    
      //pickup place manually
    pickuplocationHandler = event =>{
        const coords = event.nativeEvent.coordinate;
        this.map.animateToRegion({
        ...this.state.focusedLocation,
        latitude:coords.latitude,
        longitude:coords.longitude
        });
        this.setState(prevState => {
        return {
            focusedLocation:{
            ...prevState.focusedLocation,
            latitude:coords.latitude,
            longitude:coords.longitude
            },
            locationChosen:true
        }
        })
    }

    //get current location for the user
    getCurrentLocationHandler(){
        this.watchID = navigator.geolocation.watchPosition(
        position => {
            const coordsEvent = {
            nativeEvent:{
                coordinate:{
                latitude:position.coords.latitude,
                longitude:position.coords.longitude,
                }
            }
            };
            this.pickuplocationHandler(coordsEvent);
            this.setState({error:null,});
            },
            error => this.setState({ error:error.message }),
            {enableHighAccuracy:true, timeout:20000, maximumAge:2000}
            );
            // this.getRouteDirections();
    }
    
    isFoundRider = async (tripId,userId,driverId) => {
        //update status rider found to the server 
        await fetch(`${getUrl}isFoundRider.php`,{
            method: "POST",
            headers:{
                "Accept": "application/json",
                "Content-type": "application/json"
            },
            body:JSON.stringify({
                tripId:tripId,
                userId:userId,
                driverId:driverId
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson){
                this.setState({
                    lookForPassengers:false,isriderfound:true});
                Alert.alert('Success',"Rider Found"),[{text: 'Okay'}];
            
            }else{
                this.setState({lookForPassengers:false});
                Alert.alert("Failed",JSON.stringify(responseJson)),[{text: "Okay"}];
            }
            
        }).catch((error) => {
            this.setState({lookForPassengers:false});
            alert("Try later or check your network!");
            console.error(error);
        });
    }

    //Get google routes directions
    getFindRider = async () => {
        this.setState({lookForPassengers:true});
        
        const driverId = this.props.data.driverId;
        const userId = this.props.data.userId;
        const tripId = this.props.data.tripId;

        const dataResponse = [
            {
                latitude:this.state.focusedLocation.latitude,
                longitude: this.state.focusedLocation.longitude,
            },
            {
                driverId:driverId,
                userId:userId,
                tripId:tripId
            }];
            
        //emit driver data include his location
        this.socket.emit('directionsDriver',dataResponse);
        
        // this.socket.on('')

        //listenning for event on taxiRequest
        this.socket.on('taxiRequest', routeResponse => {
            // alert(JSON.stringify(routeResponse))
            // console.log(routeResponse);
            //compare data from routeResponse send by the server and dataResponse send the driver if is equal then trace a route between driver and rider
            if(routeResponse[1].driverId == driverId && routeResponse[1].userId == userId && routeResponse[1].tripId == tripId){
                
                this.isFoundRider(tripId,userId,driverId);
                
                this.getDirectionApiRider(routeResponse[0].geocoded_waypoints[0].place_id);
            }                    
        });
            
    }
    
    //direction route between the driver and the rider
    getDirectionApiRider = async (placeId) => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.focusedLocation.latitude},${this.state.focusedLocation.longitude}&destination=place_id:${placeId}&units=metric&key=${apiKey}`);
        
            //store json data for directions
            const json = await response.json(); 
            // console.log(json);
            
            // routeResponse = JSON.stringify(json);
                //using mapbox/PolyLine to decode the overview_polyline   
            const points = PolyLine.decode(json.routes[0].overview_polyline.points);
            
            //polyline mapbox coordinates store
            const pointCoords = points.map(point => {
                return { latitude: point[0], longitude: point[1] };
            });
        
            // // console.log(directionsData);
            // //set data into differents variables for using later
            this.setState({pointCoords});
            
            this.map.fitToCoordinates(pointCoords,
                { edgePadding:{top:20,bottom:20,left:20,right:20}}
            );
            
        }catch (error) {
        console.log(error)
        } 
    }
    
    acceptRiderRequest = async () =>{
         // navigate to the rider side by openning google maps
         const passengerLocation = this.state.pointCoords[
            this.state.pointCoords.length - 1];
            
        const driverId = this.props.data.driverId;
        const userId = this.props.data.userId;
        const tripId = this.props.data.tripId;
        const passengerLocationLatitude = this.props.data.departureLatitude;
        const passengerLocationLongitude = this.props.data.departureLongitude;
            
        BackgroundGeolocation.on('location', (focusedLocation) => {
            // handle your locations here       
            const dataResponse = [
                {
                    latitude: focusedLocation.latitude,
                    longitude: focusedLocation.longitude,
                },
                {
                    driverId:driverId,
                    userId:userId,
                    tripId:tripId
                }];
            
            //emit driver data include his location
            this.socket.emit('driverLocation',dataResponse);
            
        }); 
        
        BackgroundGeolocation.checkStatus(status => {
            // you don't need to check status before start (this is just the example)
            if (!status.isRunning) {
              BackgroundGeolocation.start(); //triggers start on start event
            }
        });
        
        BackgroundGeolocation.on('stop', () => {
            // console.log('[INFO] BackgroundGeolocation service has been stopped');
            Actions.requestRide();
        });
               
        if (Platform.OS === "ios") {
            Linking.canOpenURL(`http://maps.apple.com/?daddr=${passengerLocation.latitude},${passengerLocation.longitude}`)
            .then((supported) => {
                if (!supported) {
                alert("Can't handle url: " + `http://maps.apple.com/?ll=${passengerLocation.latitude},${passengerLocation.longitude}`);
                } else {
                return Linking.openURL(`http://maps.apple.com/?ll=${passengerLocation.latitude},${passengerLocation.longitude}`);
                }
            })
            .catch((err) => console.error('An error occurred', err));

            }else {    
                Linking.canOpenURL(`https://www.google.com/maps/dir/?api=1&origin=${this.state.focusedLocation.latitude},${this.state.focusedLocation.longitude}&destination=${passengerLocation.latitude},${passengerLocation.longitude}&travelmode=driving`)
                .then((supported) => {
                    if (!supported) {
                        alert("Can't handle url: " + 
                    `https://www.google.com/maps/dir/?api=1&origin=${this.state.focusedLocation.latitude},${this.state.focusedLocation.longitude}&destination=${passengerLocation.latitude},${passengerLocation.longitude}&travelmode=driving`);
                        
                    } else {
                    return Linking.openURL(`https://www.google.com/maps/dir/?api=1&origin=${this.state.focusedLocation.latitude},${this.state.focusedLocation.longitude}&destination=${passengerLocation.latitude},${passengerLocation.longitude}&travelmode=driving`);
                    }
                })
                .catch((err) => console.error('An error occurred', err));

            }
        //sending the location in the background to the rider then i can be able in real time see how the driver in comming 
    }

    render() {
        let marker1 = null;
      
        if(this.state.focusedLocation){
            marker1 = <MapView.Marker coordinate={this.state.focusedLocation} title="My location"/>
        }
        
        let marker = null;
        //chech if the pointCoords is notr4 null > 1 display a marker polyline
        if (this.state.pointCoords.length > 1) {
            marker = < Marker coordinate = { this.state.pointCoords[this.state.pointCoords.length - 1] }
            > 
                <Image
                style={{ width: 40, height: 40 }}
                source={require("../../../../assets/contacts/person-marker.png")}
                />
            </ Marker>
        }

    return ( 
        <Container>
            <View style ={ styles.container}>
                <StatusBar backgroundColor = "#11A0DC"
                barStyle = "light-content" />
                
                <MapView
                    // ref={map => {this.map = map}}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={this.state.focusedLocation}
                    onPress={this.pickuplocationHandler}
                    // region={this.state.focusedLocation}
                    showsCompass={false} 
                    showsUserLocation={true}
                    ref={ref => this.map = ref}
                >
        
                <Polyline
                    coordinates={this.state.pointCoords}
                    strokeColor="red" // fallback for when 
                    strokeWidth={4}
                /> 
                    {marker1} 
                    { marker } 
                    </MapView >
                    
                    <View 
                        style={[styles.directionContainer, { flexDirection: "row", justifyContent: "space-around"}]}>
                            
                        <RideModal data = { this.props.data }/>

                            {this.state.isriderfound == true ?
                            <TouchableOpacity opacity = "0.6"
                            onPress = {() => this.acceptRiderRequest()}
                            style = {{ padding: 7, backgroundColor: "#F89D29", color: "#FFFFFF", flexDirection: "row" }} >   
                            <Icon name = "place"
                            style = {[icons.icon, { color: '#FFFFFF' }]}/> 
                                <Text style = {{ color: "#fff", fontSize: 15 }}>Confirm Ride </Text>
                                
                            </TouchableOpacity>
                            :
                            <TouchableOpacity opacity = "0.6"
                            onPress = {() => this.getFindRider()}
                            style = {{ padding: 7, backgroundColor: "#F89D29", color: "#FFFFFF", flexDirection: "row" }} >
                                
                            <Icon name = "place"
                            style = {[icons.icon, { color: '#FFFFFF' }]}/> 
                            
                            {this.state.lookForPassengers == true ?
                                <ActivityIndicator size = "small"
                                color = "#FFFFFF" / > :
                                <Text style = {{ color: "#fff", fontSize: 15 }} > 
                                Find Rider </Text>
                            }

                            </TouchableOpacity>
                            }

                            <TouchableOpacity 
                                onPress = {() => Actions.requestRide()}
                                style = {{ padding: 7, backgroundColor: "#FFFFFF", color: "#11A0DC", flexDirection: "row", borderWidth: 0.5, borderColor: "#11A0DC" }
                                }>
                                <Icon name = "dashboard"
                                style = {[styles.icon, { color: '#FFFFFF' }]}/> 
                                <Text style = {{color: "#11A0DC", fontSize: 15, }} > 
                                Requests </Text> 
                            </TouchableOpacity>
                        
                    </View>
                    
                </View>

        </Container>

    );
    }
}

const styles = StyleSheet.create({

    container: {
        ...StyleSheet.absoluteFillObject,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    findDriverRiderContainer: {
        backgroundColor: '#11A0DC',
        // marginTop: 'auto',
        padding: 10,
        // margin:20,
        alignSelf: 'center',
        marginLeft: 170
            // paddingLeft:30,
            // paddingRight:30
    },
    directionContainer: {
        backgroundColor: '#fff',
        marginTop: 'auto',
        padding: 15,
        // marginTop:Platform.OS === "android" ? 330 : 400,
        // alignSelf:'center',
        paddingLeft: 30,
        paddingRight: 30
    },
    findDriverRiderText: {
        fontSize: 20,
        color: '#fff',
    }

});










