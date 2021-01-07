import React, { Component } from "react";
import { Table as AntTable, Select } from "antd";
import {
  queryStringToJSON,
  convertJsonToQueryString
} from "../../../helpers/NewCaCrmHelper";
import { RouteComponentProps, withRouter } from "react-router";
const { Option } = Select;


interface Props extends RouteComponentProps {
  columns: any[];
  onFetchData: any;
  noIndexColumn?: boolean;
  noSelectPage?: boolean;
}
interface State {
  data: any;
  pagination: any;
  loading: boolean;
  total: number;
}


class Table extends Component<Props, State> {
  state = {
    selectedRowKeys: [],// Check here to configure the default column
    data: [],
    pagination: { total: 0, pageSize: 10, current: 2 },
    loading: false,
    total: 0
  };

  onSelectChange = (selectedRowKeys) => {
  return selectedRowKeys;
  };

  onRenderRowKey = (record, index) => {
    return index;
  };

  componentDidMount() {
    this.fetch();
  }
//  rowSelection() {
//   const { selectedRowKeys } = this.state;
//     selectedRowKeys,
//     onChange: this.onSelectChange,
//     selections: [ Table.SELECTION_ALL  ],
//   };

  onChangeData = (pagination, filters, sorter) => {
    if (pagination) {
      const dataQuery = queryStringToJSON(this.props.location.search);
      const queryString = convertJsonToQueryString({
        ...dataQuery,
        page: pagination.current
      });
      this.props.history.push({
        pathname: this.props.match.url,
        search: queryString
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.fetch();
    }
  }

  fetch = async (params = {}) => {
    this.setState({ loading: true });
    const pagination = { ...this.state.pagination };
    const queryString = queryStringToJSON(this.props.location.search);
    try {
      let data = await this.props.onFetchData({ ...queryString, ...params });
      data = data.data;
      pagination.total = data.total;
      pagination.pageSize = parseInt(data.per_page);
      pagination.current = data.current_page;
      this.setState({
        data: data.data,
        pagination,
        total: data.total
      });
    } catch (error) {
    } finally {
      this.setState({
        loading: false
      });
    }
  };

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);}
  };

  withIndexColumn = () => {
    const { pagination } = this.state;
    const { noIndexColumn } = this.props;
    const withIndex = [
      {
        title: "STT",
        key: "index",
        render: (text, record, index) =>
          (pagination.current - 1) * pagination.pageSize + index + 1,
        className: "text-center w-5"
      },
      ...this.props.columns
    ];
    return noIndexColumn ? this.props.columns : withIndex;
  };

  render() {
    const { data, pagination, loading } = this.state;
    return (
      <AntTable
        rowSelection={this.rowSelection}
        columns={this.withIndexColumn()}
        dataSource={data}
        pagination={pagination}
        onChange={this.onChangeData}
        loading={loading}
        rowKey={this.onRenderRowKey}
        bordered={true}
        style={{ width: "100%" }}
        footer={ this.props.noSelectPage ? ()=>null : this.onRenderChangeRaw}
        className="mt-2 table-responsive"
      />
    );
  }


  onChangeRaw = value => {
    const dataQuery = queryStringToJSON(this.props.location.search);
    const queryString = convertJsonToQueryString({
      ...dataQuery,
      raw: value
    });
    this.props.history.push({
      pathname: this.props.match.url,
      search: queryString
    });
  };



  onRenderChangeRaw = () => {
    return (
      <div className="font-weight-bold">
        <Select
          onChange={this.onChangeRaw}
          value={this.state.pagination.pageSize}
          className="mr-2"
        >
          {rawOptions.map((option, index) => {
            return (
              <Option key={index} value={option}>
                {option}
              </Option>
            );
          })}
        </Select>
        Bản ghi
      </div>
    )
  }
}


const rawOptions = [10, 20, 30, 40];

export default withRouter(Table);
