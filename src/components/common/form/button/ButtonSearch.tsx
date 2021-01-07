import React from "react";
import { Button } from "antd";
import { withRouter, RouteComponentProps } from "react-router";
import { convertJsonToQueryString } from "../../../../helpers/NewCaCrmHelper";

interface Props extends RouteComponentProps {
  className?: string;
  size?: any;
  data: any;
}

function ButtonSearch(props: Props) {
  const onClick = () =>{
    const queryString = convertJsonToQueryString(props.data);
    props.history.push({
      pathname: props.match.url,
      search: queryString
    });
  };

  return (
    <Button
      className={props.className ? props.className : `bg-primary text-white`}
      onClick={onClick}
    >
      <i className="fas fa-search mr-1"/>Tìm kiếm
    </Button>
  );
}
export default withRouter(ButtonSearch);