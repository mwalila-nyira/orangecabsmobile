import {combineReducers} from 'redux';
import {HomeReducer as home} from '../routes/Home/modules/home';
import {AccueilReducer as accueil} from '../routes/AccueilApp/accueilReducer';
import {LoginRiderReducer as logrider} from '../routes/Riders/Login/Reducer';
import {SignupRiderReducer as signup} from '../routes/Riders/Signup/Reducer';
import {LoginDriverReducer as logdriver} from '../routes/Drivers/Login/Reducer';
import {DriverReducer as driver} from '../routes/Drivers/module/driver';
import {ForgotPassReducer as forgotpassword} from '../routes/Riders/ForgotPassword/Reducer';
import {ResetPasswordReducer as resetpass} from '../routes/Riders/ResetPassword/Reducer';
import {ActivatePasswordReducer as activatepass} from '../routes/Riders/Activate/Reducer';
import {ViewTripReducer as viewtrip} from '../routes/viewtrips/module/ViewTrip';
import {UpdateTripReducer as updateTrip} from '../routes/viewtrips/module/updateTrip';
import {ProfileDriverRiderReducer as profileDriverRider} from '../routes/viewtrips/module/profileDriver.js';
import {HelpReducer as help} from '../routes/Help/Reducer';
import {MessageReducer as message} from '../routes/Message/module/Message';
import {ProfileReducer as profile} from '../routes/Profile/module/Profile';
import {ModalReducer as modal} from '../routes/Modal/module/modal';
import {SidebarReducer as drawer} from '../routes/sidebar/Reducer';

import {RequestForRidesReducer as requestRide} from '../routes/Drivers/container/RequestForRidesReducer';

import {MessageDriverReducer as messageDriver} from '../routes/Drivers/container/MessageReducer';

import {ProfileDriverReducer as profileDriver } from "../routes/Drivers/container/ProfileReducer";

import {StopActivityReducer as stopActivity } from "../routes/Drivers/container/StopActivityReducer";

import { TripCompleteReducer as tripComplete } from "../routes/Drivers/container/TripCompleteReducer";

import { NavigationDriverMapReducer as navigationDriverMap } from "../routes/viewtrips/module/NavigationDriverMap";



export const MakeRootReducer = () => {
    return combineReducers({
        home,
        accueil,
        signup,
        logrider,
        logdriver,
        driver,
        forgotpassword,
        resetpass,
        activatepass,
        viewtrip,
        help,
        message,
        modal,
        profile,
        drawer,
        requestRide,
        messageDriver,
        profileDriver,
        updateTrip,
        profileDriverRider,
        stopActivity,
        tripComplete,
        navigationDriverMap

    });
}

export default MakeRootReducer;