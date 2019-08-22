import React from 'react';
import {Scene, Actions,Drawer} from 'react-native-router-flux';
import HomeContainer from './Home/containers/homeContainer';
import AccueilApp from './AccueilApp/container';
import Signup from './Riders/Signup/container';
import LoginRider from './Riders/Login/container';
import LoginDriver from './Drivers/Login/container';
import ForgotPassword from './Riders/ForgotPassword/container';
import Driver from './Drivers/container/DriverContainer';
import ResetPassword from './Riders/ResetPassword/container';
import ActivatePassword from './Riders/Activate/container';
import ViewTrip from './viewtrips/container/ViewTripContainer';
import UpdateTrip from './viewtrips/container/updateTripContainer';
import ProfileDriverClientSide from './viewtrips/container/profilDriverContainer';
import Help from './Help/container';
import Message from './Message/container/MessageContainer';
import Profile from './Profile/container/ProfileContainer';
import Modal from './Modal/container/ModalContainer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RequestForRide from "./Drivers/container/RequestForRidesContainer";
import StopActivity from "./Drivers/container/StopActivityContainer";
import TripComplete from "./Drivers/container/TripCompleteContainer";
import NavigationDriverMap from "./viewtrips/container/NavigationDriverMapContainer"
//drawer
import Sidebar from './sidebar/container';
import MessageDriver from './Drivers/container/MessageContainer';
import ProfileDriver from './Drivers/container/ProfileContainer';

const TabIcon = ({focused, iconName}) => {
    var color = focused ? '#F89D29' : '#7f8c8d';
    return (
        <Icon name={iconName} color={color} size={30} style={{height: 30, width:30}} />
    )
}

const MenuIcon = () => {
    return (
        <Icon name='menu' size={35} color="#11A0DC" style={{marginTop:0}}/>
    )
}
const scenes = Actions.create(
    <Drawer key="drawer" drawer contentComponent={Sidebar} drawerIcon={MenuIcon} drawerWidth={300}>
      <Scene key="root" >
        <Scene key="home" component={HomeContainer} title="" drawer={true} navTransparent/>

        <Scene key="accueil" component={AccueilApp} title="accueil"  drawer={false} initial={true} hideNavBar/>
        <Scene key="signup" component={Signup} title="signup" drawer={false} initial={false} hideNavBar/>
        <Scene key="logrider" component={LoginRider} title="Login Rider" drawer={false} initial={false} hideNavBar/>
        <Scene key="logdriver" component={LoginDriver} title="Login Driver" drawer={false} initial={false} hideNavBar/>
        <Scene key="forgotpassword" component={ForgotPassword} title="Forgot Password" drawer={false} initial={false} hideNavBar/>
        
        <Scene key="driver" component={Driver} title="" drawer={false} initial={false} hideNavBar/>
        <Scene key="resetpass" component={ResetPassword} title="Reset Password" drawer={false} initial={false} hideNavBar/>
        <Scene key="activatepass" component={ActivatePassword} title="Activate Password" drawer={false} initial={false} hideNavBar/>
        <Scene key="viewtrip" component={ViewTrip} title="Manage Trips"/>
        <Scene key="help" component={Help} title="How to use Orange Cabs"/>
        <Scene key="message" component={Message} drawer={false} title="chat"hideNavBar/>
        <Scene key="profile" component={Profile} title="Profile Settings"/>
        <Scene key="modal" component={Modal} title="Complete Bookings Request Step 2/3"/>
        
        <Scene key="requestRide" drawer={false} component={RequestForRide}  title="Request Ride" hideNavBar/>
        
        <Scene key="messageDriver" drawer={false} component={MessageDriver} title="Chat"  hideNavBar/>
        
        <Scene key="stopActivity" drawer={false} component={StopActivity} title="Trip in progress"  hideNavBar/>
        
        <Scene key="tripComplete" drawer={false} component={TripComplete} title="Trip Complete"  hideNavBar/>
        
        <Scene key="profileDriver" drawer={false} component={ProfileDriver} title="Account Setting" hideNavBar/>
        
        <Scene key="updateTrip" drawer={false} component={UpdateTrip} title="Update Trip" hideNavBar/>
        
        <Scene key="profileDriverRider" drawer={false} component={ProfileDriverClientSide} title="Profile Driver Rider side" hideNavBar/>
        
        <Scene key="navigationDriverMap" drawer={false} component={NavigationDriverMap} title="NavigationDriverMap" hideNavBar/>

        
        {/* <Scene key="Anasayfa" component={Anasayfa} title="Anasayfa" initial={false} renderLeftButton={null} /> */}
        
      </Scene>
    </Drawer>
);

export default scenes;