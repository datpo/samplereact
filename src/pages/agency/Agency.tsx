import React, { Component } from "react";
import PageWrapper from "../wrapper/PageWrapper";
import WrappedAgencySearchForm from "./form/AgencySearchForm";
import { RouteComponentProps } from "react-router";
import Table from "../../components/common/table/Table";
import { UserEnum } from "helpers/enum/UserEnums";
import { AgencyEnum, STATUS_LABEL_CLASS } from "./enum/AgencyEnum";
import {
  formatDate,
  reloadPage,
  checkPermission,
} from "helpers/NewCaCrmHelper";
import { AgencyService } from "services/agency/AgencyServices";
import { onSuccessAction, onFailAction } from "helpers/SwalCommon";
import { AgencyPermission } from "helpers/enum/PermissionEnums";
import TableActionButton from "components/common/table/action-button/TableActionButton";
import ModalStop from "./ModalStop";
import { RequestStopService } from "services/request-stop-coop/RequestStopCooperationService";
import { Card, Icon, Tag } from "antd";

interface Props extends RouteComponentProps {
  user: any;
}
interface State {
  visible_modal: boolean;
  loading: boolean;
  title: String;
  id: String;
}

export default class Agency extends Component<Props, State> {
  state = {
    visible_modal: false,
    loading: false,
    title: "",
    id: "",
  };

  componentDidMount() {
    this.fetch();
  }

  onClickAddRequest = async (record) => {
    let title = "Tạo yêu cầu dừng hợp tác với nhóm quyền " + record.fullname;
    this.setState({
      visible_modal: true,
      loading: true,
      title: title,
      id: record.id,
    });
  };

  onOkModalDecline = async (e) => {
    this.setState({ visible_modal: false });
    let params = { reason: e, type: 1, id: this.state.id };
    try {
      await RequestStopService.sendDataRequestNewca(params);
      onSuccessAction("Tạo yêu cầu dừng hợp tác thành công!");
      const { location, history } = this.props;
      reloadPage(location, history);
    } catch (error) {
      onFailAction("Có lỗi xảy ra trong quá trình tạo yêu cầu!");
    }
  };

  onCancelModelDecline = async () => {
    this.setState({ visible_modal: false });
  };

  fetch = async (params = {}) => {
    debugger
    const service = new AgencyService();
    try {
      const agency = await service.indexAgency(params);
      console.log("hehe"+agency)
      return agency;
    } catch (error) {
      onFailAction(error.message);
    }
  };

  render() {
    return (
     <div> 
        <Card >
     <label><Icon type="setting" />Cấu hình hệ thống: </label>
     <Card>
         <label><Icon />Phê duyệt trình ký hàng loạt</label>
         <label><Icon />Giới hạn địa chỉ email khi khởi tạo người dùng:</label>
     </Card>
 </Card>
 
      <PageWrapper title="Danh sách nhóm quyền">
        <WrappedAgencySearchForm
            searchValue={this.props.location.search}
            history={this.props.history}
            match={this.props.match}
        />
        <Table columns={this.columns} onFetchData={this.fetch} />
        <ModalStop
          modalVisible={this.state.visible_modal}
          handleCancel={this.onCancelModelDecline}
          onOkModalDecline={this.onOkModalDecline}
          loading={this.state.loading}
          title={this.state.title}
        />
      </PageWrapper>
      </div>
    );
  }

  onRenderActionColumn = (text, record, index) => {
    return (
      <TableActionButton
        onClickDelete={
          this.checkEditAbleRecord(record)
            ? () => this.onDeleteAgency(record.id)
            : null
        }
        onClickUpdate={
          this.checkEditAbleRecord(record)
            ? () =>
                this.props.history.push(`/nhom-quyen/cap-nhat/${record.id}`)
            : null
        }
        // onClickPreviewButton={
        //   checkPermission(AgencyPermission.VIEW)
        //   ? () => this.props.history.push(`/nhom-quyen/xem-chi-tiet/${record.id}`)
        //   : null
        // }
        onClickRequestStopButton={
          this.checkStopAbleRecord(record)
            ? () => this.onClickAddRequest(record)
            : null
        }
        // onClickReActive={
        //   this.checkReactiveRecord(record)
        //     ? () =>
        //         this.props.history.push(`/nhom-quyen/kich-hoat-lai/${record.id}`)
        //     : null
        // }
        // permissionUpdate={AgencyPermission.UPDATE}
      />
    );
  };

  onDeleteAgency = async (id) => {
    const { location, history } = this.props;
    try {
      const agencyService = new AgencyService();
      await agencyService.deleteAgency(id);
      reloadPage(location, history);
      onSuccessAction("Xóa đại lý thành công!");
    } catch (error) {
      onFailAction("Có lỗi xảy ra khi xóa đại lý!");
    }
  };

  onCreateRequestStop = async () => {
    try {
      onSuccessAction("Tạo yêu cầu dừng thành công!");
    } catch (error) {
      onFailAction("Có lỗi xảy ra khi tạo yêu cầu!");
    }
  };

  checkEditAbleRecord = (record) => {
    const { user } = this.props;
    if (
      user.type === UserEnum.TYPE_BUSINESS_SUPPORT &&
      record.created_by !== user.id
    ) {
      return false;
    }
    return (
      [
        AgencyEnum.STATUS_DRAFT,
        AgencyEnum.STATUS_REJECTED,
        AgencyEnum.STATUS_DIRECTOR_REJECTED,
      ].indexOf(record.status) !== -1
    );
  };

  checkReactiveRecord = (record) => {
    const { user } = this.props;
    if (
      user.type === UserEnum.TYPE_BUSINESS_EMPLOYEE &&
      checkPermission(AgencyPermission.REACTIVE)
    ) {
      return [AgencyEnum.STATUS_STOPED].indexOf(record.status) !== -1;
    }
    return false;
  };

  checkStopAbleRecord = (record) => {
    const { user } = this.props;
    if (
      user.type === UserEnum.TYPE_BUSINESS_SUPPORT &&
      checkPermission(AgencyPermission.STOP)
    ) {
      return [AgencyEnum.STATUS_ACTIVE].indexOf(record.status) !== -1;
    }
    return false;
  };

  renderStatusColumn = (text, record, index) => {
    return (
      <Tag color={`${STATUS_LABEL_CLASS[text].class}`}>
        {STATUS_LABEL_CLASS[text].label}
      </Tag>
    );
  };

  columns = [
    { title: "Tên", dataIndex: "ten", minWidth: "20%" },
    { title: "Người dùng", dataIndex: "user" },
    { title: "Ngày tạo", dataIndex: "ngayTao", minwidth: "20%"},
    { title: "Mô tả", dataIndex: "mota", minWidth: "20%" },
    { title: "Chức năng", dataIndex: "idChucNangCT", minWidth: "20%" },
    { title: "",},
  ];
}
