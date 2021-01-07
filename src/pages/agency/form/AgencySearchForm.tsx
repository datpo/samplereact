import React, { Component } from "react";
import { Button, Form, Input, Modal, Table ,Checkbox} from "antd";
import { FormComponentProps } from "antd/lib/form";
import SelectWithLabel from "../../../components/common/form/input-with-label/SelectWithLabel";
import { STATUS_OPTIONS } from "../enum/AgencyEnum";
import { queryStringToJSON } from "../../../helpers/NewCaCrmHelper";
import ButtonSearch from "../../../components/common/form/button/ButtonSearch";
import ButtonCreate from "../../../components/common/form/button/ButtonCreate";
import { History } from "history";
import { match } from "react-router";
import { AgencyService } from "../../../services/agency/AgencyServices";
import { AgencyPermission } from "../../../helpers/enum/PermissionEnums";
import InputWithoutLabel from "../../../components/common/form/input-with-label/input/InputWithoutLabel";
import Search from "antd/lib/input/Search";

interface Props extends FormComponentProps {
  searchValue: any;
  history: History;
  match: match;
}
interface State {}

class AgencySearchForm extends Component<Props, State> {
  state = {
    managers: {},
    visible: false,
    checkedList: "",
    indeterminate: true,
    checkAll: false,
  };

  componentDidMount() {
  //  this.getListManager();
    const { form, searchValue } = this.props;
    if (searchValue) {
      const searchObject = queryStringToJSON(searchValue);
      form.setFieldsValue(searchObject);
    }
  }

  async getListManager() {
    try {
      const agencyServices = new AgencyService();
      const user = await agencyServices.getManagerByAuth();
      this.setState({
        managers: user.data
      });
    } catch (error) {}
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

 columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      title:  <Checkbox>Tất cả</Checkbox>,
      dataIndex: 'all',
      render: () => <Checkbox  indeterminate={this.state.indeterminate}
      onChange={this.onCheckAllChange}
      checked={this.state.checkAll}  />
     
     
    },
    {
      title: 'Truy cập',
     
    },
    {
      title: 'Thêm',
    
    },
    {
      title: 'Cập nhật',
     
    },
    {
      title: 'Xóa',
    
    },
    {
      title: 'Kích hoạt',
    
    },
    {
      title: 'Vô hiệu hóa',
    
    },
  ];

   data = [
    // {
    //   key: '1',
    //   name: 'John Brown',
    //   age: 32,
    //   address: 'New York No. 1 Lake Park',
    // },
    // {
    //   key: '2',
    //   name: 'Jim Green',
    //   age: 42,
    //   address: 'London No. 1 Lake Park',
    // },
    // {
    //   key: '3',
    //   name: 'Joe Black',
    //   age: 32,
    //   address: 'Sidney No. 1 Lake Park',
    // },
    // {
    //   key: '4',
    //   name: 'Disabled User',
    //   age: 99,
    //   address: 'Sidney No. 1 Lake Park',
    // },
  ];

  onCheckAllChange = e => {
    this.setState({
      checkedList: e.target.checked ? this.data : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };


  render() {
    return (
 
        <div className="input-group nopadding-left">
          {/* <SelectWithLabel
            options={this.state.managers}
            name="manager"
            wrappedClass="col-md-2 nopadding-left"
            form={this.props.form}
            placeholder="Tìm kiếm"
          />
         
          <div className="form-group col-md-2 nopadding-left">
            <InputWithoutLabel form={this.props.form} name="name" placeholder="Mã, tên đại lý" />
          </div> */}
          <div className="form-group col-md-2 nopadding-left">
            <InputWithoutLabel form={this.props.form} name="name" placeholder="Tìm Kiếm" />
          </div>
          <div className="form-group col-md-4 mt-1 nopadding-left">
              <ButtonSearch data={this.props.form.getFieldsValue()} />
          </div>
          <div className="form-group col-md-4 nopadding-right">
             
          <Button type="primary" onClick={this.showModal}>
          Thêm mới
        </Button>
          </div>

          <div >
          <Modal className="showmode"
              title="Khởi tạo nhóm quyền"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <div style={{ marginBottom: 16 }}>
             <Input placeholder="Tên " />
             </div>
             <div style={{ marginBottom: 16 }}>
             <Search
           placeholder="Người dùng"
           onSearch={value => console.log(value)}
    />
             </div>
             <div style={{ marginBottom: 16 }}>
             <Input placeholder="Mô tả" />
             </div>
             <Table columns={this.columns} dataSource={this.data} />
            </Modal>
            </div>
        </div>

    );
  }
}

const WrappedAgencySearchForm = Form.create<Props>({ name: "AgencySearch" })(
  AgencySearchForm
);

export default WrappedAgencySearchForm;
