import React, { Component } from "react";
import { StatusBar } from "react-native";
import { Container, Header, Content, Accordion } from "native-base";

const dataArray = [
  { title: "How to Add New Trip", content: "This is where you create your Trip using you Current Location and your Destination.Enter your Drop-Off Point Location. Select Date and Time for Pick Up. Enter the Number of Riders. Enter a name of atleast one rider.Click on Book now button. and the last step is the payment before your journey." },
  { title: "Payment History", content: "This is where you can view your Payment History. After every successful payment a list of you Previous Payments" },
  { title: "Message", content: "This is where the message between the Driver and the Rider." },
  { title: "Profile", content: "This is where you can edit your profile.You can change your Profile Picture, Username, Contact Number, Email Address, Password" }
];
export default class Help extends Component {
  render() {
    return (
      <Container>
        <StatusBar 
          backgroundColor="#11A0DC"
          barStyle="light-content"
          />
        <Content padder>
          <Accordion 
            dataArray={dataArray} 
            expanded={0}
            expandedIcon="remove"
            iconStyle={{ color: "#FFFFFF" }}
            expandedIconStyle={{ color: "#F89D29" }}
            headerStyle={{ backgroundColor: "#11A0DC",color:"#FFFFFF" }}
            contentStyle={{ backgroundColor: "#FFFFFF" }}
            // #F89D29
            // #11A0DC
          />
        </Content>
      </Container>
    );
  }
}
