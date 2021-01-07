import React from 'react'
import { authenticationService } from '../../services/authentication/AuthenticationService'
import store from 'store/store';
import { unsetAuthData } from 'actions/authAction';
import { useKeycloak } from '@react-keycloak/web';

interface Props {
}

export default function Logout(props): Props {
    const { keycloak } = useKeycloak()
    const logout = ()=>{
        
        if (keycloak?.authenticated){
           console.log(keycloak);
           keycloak.logout()
      
        }else{

            
        }
      
        props.history.push('/');
        return true;
    }

    return (
        <div>
           {logout()}
        </div>
    )
}

  