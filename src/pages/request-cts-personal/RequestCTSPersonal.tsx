import React, {} from "react";
import PageWrapper from "../wrapper/PageWrapper";
import Table from "../../components/common/table/Table";
import {onFailAction, onSuccessAction} from "helpers/SwalCommon";
import {RouteComponentProps} from "react-router";
import {reloadPage} from "helpers/NewCaCrmHelper";
import TableActionButton from "components/common/table/action-button/TableActionButton";
import WrappedRequestCTSPersonalSearchForm from "./search/RequestCTSPersonalSearchForm";
import {RequestDigitalCertificatePersonalServices} from "../../services/request-digital-certificate-personal/RequestDigitalCertificatePersonalServices";
import {STATUS_REQUEST_DIGITAL_CERTIFICATE_LABEL} from "../../helpers/enum/request-digital-certificate/RequestDigitalCertificateEnums";
import moment from "moment";
import { Tag } from "antd";

interface Props extends RouteComponentProps {
}

export const RequestCTSPersonal: React.FC<Props> = props => {

    const onDeleteRequestDigital = async id => {
        const {location, history} = props;
        try {
            await RequestDigitalCertificatePersonalServices.deleteRequest(id);
            reloadPage(location, history);
            onSuccessAction("Xóa yêu cầu thành công!");
        } catch (error) {
            onFailAction("Có lỗi xảy ra khi xóa yêu cầu!");
        }
    };

    const renderActionButton = (text, record, index) => {
        return (
            <TableActionButton
                permissionUpdate=""
                permissionDelete={true}
                onClickUpdate={
                    [1, 3].indexOf(record.status) !== -1
                        ? () => props.history.push(`yeu-cau-cts-ca-nhan/cap-nhat/${record.id}`)
                        : null
                }
                onClickDelete={
                    [1, 3].indexOf(record.status) !== -1
                        ? () => onDeleteRequestDigital(record.id)
                        : null
                }
                onClickPreviewButton={() =>
                    props.history.push(`yeu-cau-cts-ca-nhan/xem/${record.id}`)
                }
            />
        );
    };

    const renderStatusColumn = (text, record, index) => {
        return (
            <Tag color={`${STATUS_REQUEST_DIGITAL_CERTIFICATE_LABEL[text].class}`}>
        {STATUS_REQUEST_DIGITAL_CERTIFICATE_LABEL[text].label}
      </Tag>
        );
    };
    const formatDateTime = (date: string) => {
        if (date) {
            return moment(date).format("DD/MM/YYYY");
        } else {
            return "";
        }
    };

    const columns = [
        {
            title: "Mã yêu cầu",
            dataIndex: "code"
        },
        {
            title: "Tên khách hàng",
            dataIndex: "requestpersonal.fullname"
        },
        {
            title: "Số CMND/Hộ chiếu",
            dataIndex: "requestpersonal.passport"
        },
        {
            title: 'Đối tượng',
            dataIndex: "",
            render: (e) => {
                if (e) {
                    if(Number(e.object) === 1){
                        return <Tag color="green">Cấp mới</Tag>;
                    }else if(Number(e.object) === 2){
                        return <Tag color="orange">Gia hạn</Tag>;
                    }else {
                        return <Tag color="red">Chuyển đổi</Tag>;
                    }
                }
            }
        },
        {
            title: "Gói dịch vụ",
            dataIndex: "cateservicespackage.name"
        },
        {
            title: "Thời gian tạo",
            dataIndex: "created_at",
            render: (text, record, index) => formatDateTime(text)
        },
        {
            title: "Trạng thái",
            dataIndex: "status", render: renderStatusColumn
        },
        {
            title: "Mã bảo mật",
            dataIndex: "",
            render: (e) => {
                if (e.secret_code){
                    return e.secret_code;
                }
            }
        },
        {
            title: "Tác vụ",
            render: renderActionButton
        }
    ];
    const fetch = async (params = {}) => {
        try {
            return await RequestDigitalCertificatePersonalServices.getListIndex(params);
        } catch (error) {
            onFailAction(error.message);
        }
    };

    return (
        <PageWrapper title="Danh sách yêu cầu chứng thư số cá nhân">
            <WrappedRequestCTSPersonalSearchForm/>
            <Table columns={columns} onFetchData={fetch}/>
        </PageWrapper>
    );
};
