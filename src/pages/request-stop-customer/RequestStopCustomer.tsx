import React, { useEffect, useState } from "react";
import PageWrapper from "../wrapper/PageWrapper";
import Table from "../../components/common/table/Table";
import { onFailAction, onSuccessAction } from "helpers/SwalCommon";
import { RequestStopService } from "services/request-stop-coop/RequestStopCooperationService";
import { RouteComponentProps } from "react-router";
import moment from "moment";
import { STATUS_LABEL_CLASS } from "./Enum";
import TableActionButton from "./../../components/common/table/action-button/TableActionButton";
import { reloadPage } from "./../../helpers/NewCaCrmHelper";
import ModalAdd from "./ModalAdd";

interface Props extends RouteComponentProps {}

export const RequestStopCustomer: React.FC<Props> = props => {
  const [statusAdd, setStatusAdd] = useState({});
  const [modal, setModal] = useState({
    visible_modal: false,
    loading: false
  });
  const formatDateTime = (date: string) => {
    if (date) {
      return moment(date).format("DD/MM/YYYY");
    } else {
      return "";
    }
  };

  const renderStatusColumn = (text, record, index) => {
    return (
      <span className={`badge ${STATUS_LABEL_CLASS[text].class}`}>
        {STATUS_LABEL_CLASS[text].label}
      </span>
    );
  };

  const onRenderActionColumn = (text, record, index) => {
    return (
      <TableActionButton
        onClickDelete={
          [1].indexOf(record.status) !== -1
            ? () => onDestroyRequest(record.id)
            : null
        }
        onConfirmDestroy={
          [2].indexOf(record.status) !== -1
            ? () => onConfirmDestroy(record.id)
            : null
        }
        mesDelete="Bạn có chắc chắn muốn hủy yêu cầu!"
        mesConfirmDestroy="Xác nhận dừng hợp tác với Newca!"
        permissionDelete={true}
      />
    );
  };

  const onDestroyRequest = async id => {
    const { location, history } = props;
    try {
      await RequestStopService.destroyCustomer(id);
      reloadPage(location, history);
      onSuccessAction("Hủy yêu cầu dừng hợp tác thành công!");
    } catch (error) {
      onFailAction("Có lỗi xảy ra trong quá trình hủy!");
    }
  };

  const onConfirmDestroy = async id => {
    const { location, history } = props;
    try {
      await RequestStopService.customerConfirmDestroy(id);
      reloadPage(location, history);
      onSuccessAction("Xác nhận dừng hợp tác thành công!");
    } catch (error) {
      onFailAction("Có lỗi xảy ra trong quá trình duyệt!");
    }
  };

  const columns = [
    { title: "Mã yêu cầu", dataIndex: "code", key: "code" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      className: "",
      render: renderStatusColumn
    },
    { title: "Lý do dừng hợp tác", dataIndex: "reason", key: "reason" },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      render: text => formatDateTime(text)
    },
    {
      title: "Tác vụ",
      render: onRenderActionColumn,
      width: "5%"
    }
  ];

  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, []);
  const fetch = async (params = {}) => {
    try {
      const data = await RequestStopService.getListIndexCustomer(params);
      setStatusAdd(data.checkAdd);
      return data;
    } catch (error) {
      onFailAction(error.message);
    }
  };

  const onClickAddRequest = async () => {
    setModal({ ...modal, visible_modal: true, loading: true });
  };
  const onOkModalDecline = async e => {
    setModal({ ...modal, visible_modal: false });
    let params = { reason: e };
    try {
      var result = await RequestStopService.sendDataRequest(params);
      if(result['status'] === 2)
        onFailAction('Bạn không thể tạo yêu cầu dừng hợp tác');
      else
        onSuccessAction("Tạo yêu cầu dừng thành công!");
      const { location, history } = props;
      reloadPage(location, history);
    } catch (error) {
      onFailAction("Có lỗi xảy ra trong quá trình tạo yêu cầu!");
    }
  };
  const onCancelModelDecline = async () => {
    setModal({ ...modal, visible_modal: false });
  };

  return (
    <PageWrapper title="Danh sách yêu cầu dừng hợp tác">
      {statusAdd === 0 ? (
        <div className="input-group">
          <div className="form-group col-md-6 mt-1 nopadding-left">
            <button
              className="btn btn-success btn-sm"
              onClick={onClickAddRequest}
            >
              <i className="fas fa-plus mr-1" />
              Tạo yêu cầu dừng hợp tác
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      <Table columns={columns} onFetchData={fetch} />
      <ModalAdd
        modalVisible={modal.visible_modal}
        handleCancel={onCancelModelDecline}
        onOkModalDecline={onOkModalDecline}
        loading={modal.loading}
      />
    </PageWrapper>
  );
};
