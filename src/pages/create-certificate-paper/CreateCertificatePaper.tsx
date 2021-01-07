import React, { useState } from "react";
import PageWrapper from "../wrapper/PageWrapper";
import Table from "../../components/common/table/Table";
import {onFailAction, onSuccessAction} from "helpers/SwalCommon";
import {RouteComponentProps} from "react-router";
import {CreateCertificatePaperService} from "../../services/create-certificate-paper/CreateCertificatePaperService";
import moment from "moment";
import WrappedRequestCTSGroupSearchForm from "./search/CreateCertificatePaperSearchForm";
import { Tag } from "antd";

interface Props extends RouteComponentProps {
}

export const CreateCertificatePaper: React.FC<Props> = props => {
    const renderActionButton = (text, record, index) => {
        return (
            <div className="row justify-content-center">
                {record.certificate_paper_status === 1 && record.status === 1
                    ? (<button title="Sinh giấy chứng nhận" className="ml-1" onClick={() => genCertificatePaper(record.id)}><i className="fab fa-magento fa-lg"/></button>)
                    : ('')
                }
                {record.certificate_paper_status === 2 && record.status === 1
                    ?
                    <div>
                        <a href = {file} className="ml-1" target={"_blank"} rel="noopener noreferrer" title="Xem giấy chứng nhận" onClick={()=> onPreviewFile(1, record.id)}>
                            <i className="fas fa-file-pdf fa-lg"/>
                        </a>
                        {/*<button title="Xem giấy chứng nhận" className="ml-1" onClick={()=> onPreviewFile(1, record.id)}><i className="fas fa-file-pdf fa-lg"/></button>*/}
                        {/*<button title="Xem giấy chứng nhận không ký" className="ml-1" onClick={()=> onPreviewFile(2, record.id)}><i className="far fa-file-pdf fa-lg"/></button>*/}
                    </div>  : ''
                }
            </div>
        );
    };

    const genCertificatePaper = async (id) => {
        const result = await CreateCertificatePaperService.genCertificatePaper(id);
        if (result && result.status === 200){
            onSuccessAction('Sinh giấy chứng nhận điện tử thành công!', () => {
                window.location.reload();
            });
        }else{
            onFailAction('Có lỗi xảy ra!');
        }
    };
    
    const [file, setFile] = useState("");
    const onPreviewFile = (type, id) => {
        try {
            let token = localStorage.getItem("currentUser");
            if (token){
                let obj = JSON.parse(token);
                let link = `${process.env.REACT_APP_BASE_API_URL}qlbh/quan-ly-giay-chung-nhan/previewFile/${id}/${type}?token=${obj.token}`;
                setFile(link);
            }
        } catch (error) {
            onFailAction("Có lỗi xảy ra!");
        } finally {
        }
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
            title: "Mã định danh",
            dataIndex: "",
            render: (e) => {
                if (e) {
                    if(Number(e.object) === 1 || Number(e.object) === 2){
                        if (e.requestcertificate.requestpersonal) {
                            return e.requestcertificate.requestpersonal.passport;
                        }
                        if (e.requestcertificate.organization) {
                            return e.requestcertificate.organization.code;
                        }
                    }else {
                        if(e.request_change_info){
                            return e.request_change_info.code;
                        }
                    }
                }
            }
        },
        {
            title: "Serial CTS",
            dataIndex: "certificateSerial"
        },
        {
            title: 'Subject DN',
            dataIndex: "subjectDN",
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "certificateBegin",
            render: (text, record, index) => formatDateTime(text)
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "certificateEnd",
            render: (text, record, index) => formatDateTime(text)
        },
        {
            title: "Trạng thái chứng thư số",
            dataIndex: "",
            render: (e) => {
                if (e) {
                    if (e.status === 1) {
                        return (<Tag color="green">Hoạt động</Tag>);
                    }
                    if (e.status === 2) {
                        return (<Tag color="magenta">Chờ thu hồi</Tag>);
                    }
                    if (e.status === 3) {
                        return (<Tag color="red">Đã thu hồi</Tag>);
                    }
                    if (e.status === 4) {
                        return (<Tag color="orange">Chờ hủy</Tag>);
                    }
                    if (e.status === 5) {
                        return (<Tag color="red">Đã hủy</Tag>);
                    }
                    if (e.status === 6) {
                        return (<Tag color="orange">Chờ tạm dừng</Tag>);
                    }
                    if (e.status === 7) {
                        return (<Tag color="purple">Đã tạm dừng</Tag>);
                    }
                    if (e.status === 8) {
                        return (<Tag color="red">Đã xóa</Tag>);
                    }
                }
            }
        },
        {
            title: "Trạng thái giấy chứng nhận",
            dataIndex: "",
            render: (e) => {
                if (e) {
                    if (e.certificate_paper_status === 1) {
                        return (<Tag color="red">Tạo thất bại</Tag>);
                    }
                    if (e.certificate_paper_status === 2) {
                        return (<Tag color="green">Tạo thành công</Tag>);
                    }
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
            const result = await CreateCertificatePaperService.list(params);
            return result;
        } catch (error) {
            onFailAction(error.message);
        }
    };

    return (
        <PageWrapper title="Quản lý giấy chứng nhận">
            <WrappedRequestCTSGroupSearchForm/>
            <Table columns={columns} onFetchData={fetch}/>
        </PageWrapper>
        
    );
};
