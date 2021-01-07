import React, { useState } from "react";
import Table from "../../../components/common/table/Table";
import {
  formatDate,
  reloadPage,
  checkPermission,
} from "../../../helpers/NewCaCrmHelper";
import { STATUS_LABEL_CLASS, AgencyEnum } from "../../agency/enum/AgencyEnum";
import { onFailAction, onSuccessAction } from "../../../helpers/SwalCommon";
import { collaboratorsServices } from "../../../services/collaborators/CollaboratorsServies";
import { RouteChildrenProps } from "react-router";
import { UserEnum } from "../../../helpers/enum/UserEnums";
import TableActionButton from "components/common/table/action-button/TableActionButton";
import { CollaboratorsPermission } from "helpers/enum/PermissionEnums";
import { RequestStopService } from "services/request-stop-coop/RequestStopCooperationService";
import ModalStop from './../../agency/ModalStop';
import { Tag } from "antd";

interface Props extends RouteChildrenProps {
  user: any;
}

const CollaboratorsTable: React.FC<Props> = (props) => {
  const [modal, setModal] = useState({
    visible_modal: false,
    loading: false,
    title: "",
    id: "",
  });
  const renderStatusColumn = (text, record, index) => {
    return (
      <Tag color={`${STATUS_LABEL_CLASS[text].class}`}>
        {STATUS_LABEL_CLASS[text].label}
      </Tag>
    );
  };

  const renderActionButton = (text, record, index) => {
    return (
      <TableActionButton
        permissionUpdate=""
        onClickUpdate={
          checkEditAbleRecord(record)
            ? () => props.history.push(`/quan-ly-ctv/cap-nhat/${record.id}`)
            : null
        }
        onClickPreviewButton={
          checkPermission(CollaboratorsPermission.VIEW)
          ? () => {props.history.push(`/quan-ly-ctv/xem-chi-tiet/${record.id}`);}
          : null
        }
        onClickDelete={
          checkEditAbleRecord(record) ? () => onClickDelete(record.id) : null
        }
        onClickRequestStopButton={
          checkStopAbleRecord(record)
            ? () => onClickAddRequest(record)
            : null
        }
        onClickReActive={
          checkReactiveRecord(record)
            ? () =>
                props.history.push(`/quan-ly-ctv/kich-hoat-lai/${record.id}`)
            : null
        }
      />
    );
  };

  const checkReactiveRecord = (record) => {
    const { user } = props;
    if (
      user.type === UserEnum.TYPE_BUSINESS_EMPLOYEE &&
      checkPermission(CollaboratorsPermission.REACTIVE)
    ) {
      return [AgencyEnum.STATUS_STOPED].indexOf(record.status) !== -1;
    }
    return false;
  };

  const onClickAddRequest = async (record) => {
    let title = "Tạo yêu cầu dừng hợp tác với cộng tác viên " + record.fullname;
    setModal({
      ...modal,
      visible_modal: true,
      loading: true,
      title: title,
      id: record.id,
    });
  };

  const onOkModalDecline = async (e) => {
    setModal({ ...modal, visible_modal: false });
    let params = { reason: e, type: 2, id: modal.id };
    try {
      await RequestStopService.sendDataRequestNewca(params);
      onSuccessAction("Tạo yêu cầu dừng hợp tác thành công!");
      const { location, history } = props;
      reloadPage(location, history);
    } catch (error) {
      onFailAction("Có lỗi xảy ra trong quá trình tạo yêu cầu!");
    }
  };

  const onCancelModelDecline = async () => {
    setModal({ ...modal, visible_modal: false });
  };

  const onClickDelete = async (id) => {
    const { location, history } = props;
    try {
      await collaboratorsServices.deleteColla(id);
      reloadPage(location, history);
      onSuccessAction("Xóa CTV thành công!");
    } catch (error) {
      onFailAction("Có lỗi xảy ra khi xóa CTV!");
    }
  };

  const checkEditAbleRecord = (record) => {
    const { user } = props;
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

  const checkStopAbleRecord = (record) => {
    const { user } = props;
    if (
      user.type === UserEnum.TYPE_BUSINESS_SUPPORT &&
      checkPermission(CollaboratorsPermission.STOP)
    ) {
      return [AgencyEnum.STATUS_ACTIVE].indexOf(record.status) !== -1;
    }
    return false;
  };

  const columns = [
    { title: "Mã CTV", dataIndex: "code" },
    { title: "Tên CTV", dataIndex: "fullname" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: renderStatusColumn,
    },
    { title: "Số CMND/Hộ chiếu", dataIndex: "passport", width: "" },
    { title: "Email", dataIndex: "email" },
    { title: "SĐT", dataIndex: "phone" },
    { title: "Người quản lý", dataIndex: "manager.fullname" },
    {
      title: "Thời gian tạo",
      dataIndex: "created_at",
      render: (text, record, index) => formatDate(text),
    },
    {
      title: "Tác vụ",
      render: renderActionButton,
    },
  ];

  const fetch = async (params = {}) => {
    try {
      const agency = await collaboratorsServices.getListIndex(params);
      return agency;
    } catch (error) {
      onFailAction(error.message);
    }
  };

  return (
    <React.Fragment>
      <Table columns={columns} onFetchData={fetch} />
      <ModalStop
        modalVisible={modal.visible_modal}
        handleCancel={onCancelModelDecline}
        onOkModalDecline={onOkModalDecline}
        loading={modal.loading}
        title={modal.title}
      />
    </React.Fragment>
  );
};

export default CollaboratorsTable;
