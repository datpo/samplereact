import React, { Component } from "react";
import Helmet from "react-helmet";
import { Card } from "antd";
import LoadingComponent from "../../components/common/loading/LoadingComponent";

interface Props {
  title: string;
  loading?: boolean;
}
interface State {}

class PageWrapper extends Component<Props, State> {
  state = {};

  render() {
    const { loading } = this.props;

    return (
      <div className="content-card-wrapper">
        {loading ? (
          <div className="loadding-content-wrapper">
            <LoadingComponent />
          </div>
        ) : (
          ""
        )}
        <Card
          size="default"
          title={this.props.title}
          bordered={false}
          className="card-content"
        >
          <Helmet>
            <title>{this.props.title}</title>
          </Helmet>
          {this.props.children}
        </Card>
      </div>
    );
  }
}

export default PageWrapper;
