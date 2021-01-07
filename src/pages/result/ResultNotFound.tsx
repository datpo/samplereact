import React from "react";
import { Result } from "antd";
import { Link } from "react-router-dom";
import { authenticationService } from './../../services/authentication/AuthenticationService';

interface Props {
}

export const ResultNotFound: React.FC<Props> = (props: any) => {
  if(!authenticationService.currentUserValue){
    //  props.history.push('/');
  }
 
  return (
    <Result
      status={404}
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Link to="/">Back Home</Link>}
    />
  );
};
