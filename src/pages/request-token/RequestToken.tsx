import React from "react";
import PageWrapper from "../wrapper/PageWrapper";
import WrappedRequestSearchForm from "../../components/request-token/search/RequestTokenSearchForm";
import Table from "../../components/common/table/Table";
import { onFailAction, onSuccessAction } from "helpers/SwalCommon";
import { RequestTokenService } from "services/request-token/RequestTokenServices";
import { RouteComponentProps } from "react-router";
import {STATUS_CREATE_ACCOUNT, STATUS_REQUEST_TOKEN_LABEL} from "helpers/enum/request-token/RequestTokenEnums";
import { reloadPage } from "helpers/NewCaCrmHelper";
import TableActionButton from "components/common/table/action-button/TableActionButton";
import { Tag } from "antd";

interface Props extends RouteComponentProps {}

export const RequestToken: React.FC<Props> = props => {
  const onDeleteRequestToken = async id => {
    const { location, history } = props;
    try {
      await RequestTokenService.deleteRequest(id);
      reloadPage(location, history);
      onSuccessAction("Xóa đại lý thành công!");
    } catch (error) {
      onFailAction("Có lỗi xảy ra khi xóa đại lý!");
    }
  };

  const renderActionButton = (text, record, index) => {
    return (
      <TableActionButton
        onClickUpdate={
          [1, 3].indexOf(record.status) !== -1
            ? () => props.history.push(`yeu-cau-token/cap-nhat/${record.id}`)
            : null
        }
        onClickDelete={
          [1, 3].indexOf(record.status) !== -1
            ? () => onDeleteRequestToken(record.id)
            : null
        }
        onClickPreviewButton={() =>
          props.history.push(`yeu-cau-token/xem/${record.id}`)
        }
      />
    );
  };

  const renderStatusColumn = (text, record, index) => {
    return (
      <Tag color={`${STATUS_REQUEST_TOKEN_LABEL[text].class}`}>
        {STATUS_REQUEST_TOKEN_LABEL[text].label}
      </Tag>
    );
  };
  const renderStatusAccountColumn = (text, record, index) => {
    return (
        <Tag color={`${STATUS_CREATE_ACCOUNT[text].class}`}>
          {STATUS_CREATE_ACCOUNT[text].label}
        </Tag>
    );
  };

  const columns = [
    { title: "Tên đại lý", dataIndex: "owner.fullname" },
    { title: "Mã số thuế", dataIndex: "owner.tax_code" },
    {
      title: "Hình thức nhận",
      dataIndex: "receive_type",
      render: (text, record, index) =>
        text === 1 ? "Nhận tại văn phòng" : "Nhận qua chuyển phát nhanh"
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "type_pay",
      render: (text, record, index) =>
        text === 1 ? "Chuyển khoản" : "Tiền mặt"
    },
    { title: "Tên người nhận", dataIndex: "receive_fullname" },
    { title: "Ngày tạo", dataIndex: "created_at" },
    { title: "Trạng thái", dataIndex: "status", render: renderStatusColumn },
    {
      title: "Trạng thái tài khoản",
      dataIndex: "status_create_account",
      render: renderStatusAccountColumn
    },
    {
      title: "Tác vụ",
      render: renderActionButton
    }
  ];

  const fetch = async (params = {}) => {
    try {
      let data = await RequestTokenService.getListIndex(params);
      return data;
    } catch (error) {
      onFailAction(error.message);
    }
  };

  return (
    <PageWrapper title="Danh sách yêu cầu tạo tài khoản">
      <WrappedRequestSearchForm />
      <Table columns={columns} onFetchData={fetch} />
    </PageWrapper>
  );
};
