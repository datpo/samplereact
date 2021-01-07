import React, { Component } from 'react'
import OwnerDashboard from "./OwnerDashboard";
import SaleDashboard from "./SaleDashboard";
import {authenticationService} from "../../services/authentication/AuthenticationService";
import '../../public/js/index';

interface Props {

}
interface State {
    
}

export default class Home extends Component<Props, State> {
    state = {
        userType: 0
    };
    componentDidMount() {

        this.setState({
            // userType: authenticationService.currentUserValue.typeUser,
        });

        // this.setState({
        //     userType: authenticationService.currentUserValue.typeUser,
        // });

    }
    render() {
        return (
            <React.Fragment>
                {Number(this.state.userType) === 7 || Number(this.state.userType) === 8 ? (
                    <OwnerDashboard/>
                ):("")}
                {Number(this.state.userType) === 5 || Number(this.state.userType) === 6 ? (
                    <SaleDashboard/>
                ):("")}
             </React.Fragment>
        )
    }
}
