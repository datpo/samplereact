import React, {} from "react";
import PageWrapper from "../wrapper/PageWrapper";
import Table from "../../components/common/table/Table";
import {onFailAction} from "helpers/SwalCommon";
import {RouteComponentProps} from "react-router";
import TableActionButton from "components/common/table/action-button/TableActionButton";
import {
    STATUS_REQUEST,
    STATUS_REQUEST_TOKEN_GEN_CERT
} from "../../helpers/enum/request-token/RequestTokenEnums";
import WrappedGenCertSearchForm from "./search/InfoCertSearchForm";
import {GenCertServices} from "../../services/gen-cert/GenCertServices";
import moment from "moment";
import { Tag } from "antd";

interface Props extends RouteComponentProps {
}

export const InfoCertList: React.FC<Props> = props => {

    const renderActionButton = (text, record, index) => {
        return (
            <TableActionButton
                onClickPreviewButton={() =>
                    props.history.push(`info-certificate/xem/${record.id}`)
                }
                onClickDownloadCertificate={() => downloadCert(record.id)
                }
                permissionDownloadCert={checkPermissionStatus(record.status)}
            />
        );
    };
    const checkPermissionStatus =  (status) =>{
        if (Number(status) === 1){
            return true;
        }else {
            return false;
        }
    };
    const downloadCert = async (id) =>{
        try{
            let token = localStorage.getItem("currentUser");
            if (token){
                let obj = JSON.parse(token);
                let link = `${process.env.REACT_APP_BASE_API_URL}qlbh/gen-cts/download-cert/${id}?token=${obj.token}`;
                window.open(link);
            }

        }catch (error){
            onFailAction("Có lỗi xảy ra!");
        }
    };

    const renderStatusColumn = (text, record, index) => {
        return (
            <Tag color={`${STATUS_REQUEST_TOKEN_GEN_CERT[text].class}`}>
        {STATUS_REQUEST_TOKEN_GEN_CERT[text].label}
      </Tag>
        );
    };
    const renderStatusRequest = (text, record, index) => {
        return (
            <Tag color={`${STATUS_REQUEST[text].class}`}>
        {STATUS_REQUEST[text].label}
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
            title: 'Mã định danh',
            dataIndex: '',
            render: (e) => {
                if (e) {
                    if(Number(e.object) === 1 || Number(e.object) === 2 || Number(e.object) === 4){
                        if(Number(e.customer_type) === 1){
                            return <p>{e.requestcertificate.organization.code}</p>;
                        }else {
                            return <p>{e.requestcertificate.requestpersonal.passport}</p>;
                        }

                    }else{
                        return <p>{e.request_change_info.code}</p>;
                    }
                }
            }
        },
        { title: "Mã bảo mật", dataIndex: '',
            render: (e) => {
                if(Number(e.object) === 1 || Number(e.object) === 2 || Number(e.object) === 4){
                    return <p>{e.requestcertificate.secret_code}</p>;
                }else {
                    if(Number(e.customer_type) === 1){
                        return <p>{e.request_change_info.cert_change_organ.secret_code}</p>;
                    }else {
                        return <p>{e.request_change_info.cert_change_per.secret_code}</p>;
                    }
                }
            }
        },
        {
            title: 'Đối tượng',
            dataIndex: "",
            render: (e) => {
                if (e) {
                    if(Number(e.object) === 1){
                        return <p>Cấp mới</p>;
                    }else if(Number(e.object) === 2){
                        return <p>Gia hạn</p>;
                    }else if(Number(e.object) === 3){
                        return <p>Thay đổi thông tin</p>;
                    }else {
                        return <p>Chuyển đổi</p>;
                    }
                }
            }
        },
        {
            title: "Gói dịch vụ",
            dataIndex: "",
            render: (e) => {
                if (e) {
                    if(Number(e.object) === 1 || Number(e.object) === 2 || Number(e.object) === 4){
                        return <p>{e.requestcertificate.cateservicespackage.name}</p>;
                    }else {
                        if(Number(e.customer_type) === 1){
                            return <p>{e.request_change_info.cert_change_organ.request.cateservicespackage.name}</p>;
                        }else {
                            return <p>{e.request_change_info.cert_change_per.request.cateservicespackage.name}</p>;
                        }
                    }
                }
            }
        },
        {
            title: "Thời gian tạo",
            dataIndex: "created_at",
            render: (text, record, index) => formatDateTime(text)
        },
        {
            title: "Loại yêu cầu",
            dataIndex: "object", render: renderStatusRequest
        },
        {
            title: "Trạng thái",
            dataIndex: "status", render: renderStatusColumn
        },
        {
            title: "Tác vụ",
            render: renderActionButton
        }
    ];
    const fetch = async (params = {}) => {
        try {
            const data = await GenCertServices.getListIndex(params);
            return data;
        } catch (error) {
            onFailAction(error.message);
        }
    };

    return (
        <PageWrapper title="Danh sách chứng thư số">
            <WrappedGenCertSearchForm/>
            <Table columns={columns} onFetchData={fetch}/>
        </PageWrapper>
    );
};
