import React, { Component } from "react";
import { Table as AntTable } from "antd";
import {
  queryStringToJSON,
  convertJsonToQueryString,
} from "../../../helpers/NewCaCrmHelper";
import { RouteComponentProps, withRouter } from "react-router";

interface Props extends RouteComponentProps {
  columns: any[];
  onFetchData?: any;
  data?: any;
  noIndexColumn?: boolean;
}
interface State {
  data: any;
  pagination: any;
  loading: boolean;
  total: number;
}

class TableTransfer extends Component<Props, State> {
  state = {
    data: [],
    pagination: { total: 0, pageSize: 10, current: 2 },
    loading: false,
    total: 0,
  };

  onRenderRowKey = (record, index) => {
    return index;
  };

  componentDidMount() {
    // this.fetch();
  }

  onChangeData = (pagination, filters, sorter) => {
    if (pagination) {
      const dataQuery = queryStringToJSON(this.props.location.search);
      const queryString = convertJsonToQueryString({
        ...dataQuery,
        page: pagination.current,
      });
      this.props.history.push({
        pathname: this.props.match.url,
        search: queryString,
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.fetch();
    }
  }

  fetch = (params = {}) => {
    try {
      let data = this.props.data;
      const pagination = { ...this.state.pagination };
      this.setState({
        data: data.data,
        pagination,
        total: data.total,
      });
    } catch (error) {
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  withIndexColumn = () => {
    const { noIndexColumn } = this.props;
    const withIndex = [
      {
        title: "STT",
        key: "index",
        render: (text, record, index) => index + 1,
        className: "text-center w-5",
      },
      ...this.props.columns,
    ];
    return noIndexColumn ? this.props.columns : withIndex;
  };

  render() {
    const { loading } = this.state;
    if (this.props.data) {
    }
    return (
      <AntTable
        columns={this.withIndexColumn()}
        dataSource={this.props.data ? this.props.data.data : []}
        pagination={false}
        onChange={this.onChangeData}
        loading={loading}
        rowKey={this.onRenderRowKey}
        bordered={true}
        style={{ width: "100%" }}
        className="mt-2 table-responsive"
      />
    );
  }
}

export default withRouter(TableTransfer);
