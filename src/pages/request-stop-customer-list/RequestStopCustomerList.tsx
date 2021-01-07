import React, { useEffect} from "react";
import PageWrapper from "../wrapper/PageWrapper";
import Table from "../../components/common/table/Table";
import { onFailAction, onSuccessAction } from "helpers/SwalCommon";
import { RequestStopService } from "services/request-stop-coop/RequestStopCooperationService";
import { RouteComponentProps } from "react-router";
import moment from "moment";
import { STATUS_LABEL_CLASS, STATUS_TYPE_CLASS } from "./Enum";
import TableActionButton from "../../components/common/table/action-button/TableActionButton";
import { reloadPage, checkPermission } from "../../helpers/NewCaCrmHelper";
import { Popover, Tag } from "antd";
import SearchForm from "./SearchForm";

interface Props extends RouteComponentProps {}

export const RequestStopCustomerList: React.FC<Props> = props => {
  const formatDateTime = (date: string) => {
    if (date) {
      return moment(date).format("DD/MM/YYYY");
    } else {
      return "";
    }
  };

  const renderStatusColumn = (text, record, index) => {
    return (
      <Tag color={`${STATUS_LABEL_CLASS[text].class}`}>
        {STATUS_LABEL_CLASS[text].label}
      </Tag>
    );
  };

  const onRenderActionColumn = (text, record, index) => {
    return (
      <TableActionButton
        onClickConfirmButton={
          () => onConfirmDestroyRequest(record.id)
        }

        onClickDelete={
          checkDelete(record) ? () => onDestroyRequest(record.id) : null
        }

        mesDelete="Bạn có chắc chắn muốn hủy yêu cầu!"
        mesConfrim="Bạn có chắc chắn muốn duyệt yêu cầu dừng hợp tác!"
        permissionConfirm={checkUpdateAble(record)}
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

  const checkUpdateAble = (record: any): any => {
    if ( ([1].indexOf(record.status) !== -1) && checkPermission('confirm-stop-coop')) return true;
    return false;
  };
  const checkDelete = (record: any): any => {
    if ( ([2].indexOf(record.status) !== -1) && checkPermission('confirm-stop-coop')) return true;
    return false;
  };

  const renderTypeOwner = (text, record, index) => {
    return (
      <Tag color={`${STATUS_TYPE_CLASS[text].class}`}>
        {STATUS_TYPE_CLASS[text].label}
      </Tag>
    );
  };

  const onConfirmDestroyRequest = async id => {
    const { location, history } = props;
    try {
      await RequestStopService.confirmDestroyRequest(id);
      reloadPage(location, history);
      onSuccessAction("Duyệt yêu cầu dừng hợp tác thành công!");
    } catch (error) {
      onFailAction("Có lỗi xảy ra trong quá duyệt!");
    }
  };

  useEffect(() => {
      // const User = Store.getState().authReducer;
      // eslint-disable-next-line
  }, []);
  const columns = [
    { title: "Mã yêu cầu", dataIndex: "code", key: "code" },
    {
      title: "Loại người dùng",
      dataIndex: "belong_to",
      render: renderTypeOwner
    },
    { title: "Tên đại lý/cộng tác viên", dataIndex: "owner.fullname" },
    {
      title: "Mã số thuế/Chứng minh thư",
      dataIndex: "",
      render: e => {
        if (e) {
          if (e.belong_to === 1) {
            return <a href="/#">{(e.owner) ? e.owner.tax_code : ''}</a>;
          } else {
            return <a href="/#">{(e.owner) ? e.owner.passport : ''}</a>;
          }
        }
      }
    },
    { title: "Số điện thoại", dataIndex: "owner.phone", key: "phone" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      className: "",
      render: renderStatusColumn
    },
    {
      title: "Lý do dừng hợp tác",
      dataIndex: "reason",
      className: "",
      render: e => {
        return (
          <Popover content={e}>
            <Tag color="green">Xem</Tag>
          </Popover>
        );
      }
    },
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

  const fetch = async (params = {}) => {
    try {
      const data = await RequestStopService.getListIndexStaff(params);
      return data;
    } catch (error) {
      onFailAction(error.message);
    }
  };

  return (
    <PageWrapper title="Danh sách yêu cầu dừng hợp tác">
      <SearchForm />
      <Table columns={columns} onFetchData={fetch} />
    </PageWrapper>
  );
};
