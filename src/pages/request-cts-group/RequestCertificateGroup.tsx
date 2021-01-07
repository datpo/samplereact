import React, {useState} from "react";
import PageWrapper from "../wrapper/PageWrapper";
import Table from "../../components/common/table/Table";
import {onFailAction, onSuccessAction} from "helpers/SwalCommon";
import {RouteComponentProps} from "react-router";
import {reloadPage} from "helpers/NewCaCrmHelper";
import TableActionButton from "components/common/table/action-button/TableActionButton";
import {RequestCertificateGroupService} from "../../services/request-certificate-group/RequestCertificateGroupServices";
import {STATUS_REQUEST_DIGITAL_CERTIFICATE_LABEL} from "../../helpers/enum/request-digital-certificate/RequestDigitalCertificateEnums";
import ModalUploadFile from "../../components/common/modal/upload-file/ModalUploadFile";
import {loading} from "../../components/common/loading/Loading";
import BaseServices from "../../services/base/BaseServices";
import moment from "moment";
import WrappedRequestCTSGroupSearchForm from "./search/RequestCTSGroupSearchForm";
import { Tag } from "antd";

interface Props extends RouteComponentProps {
}

export const RequestCertificateGroup: React.FC<Props> = props => {
        const onDeleteRequestDigital = async id => {
        const {location, history} = props;
        try {
            await RequestCertificateGroupService.deleteRequest(id);
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
                    [1, 3, 7].indexOf(record.status) !== -1
                        ? () => props.history.push(`yeu-cau-cts-to-chuc/cap-nhat/${record.id}`)
                        : null
                }
                onClickDelete={
                    [1, 3, 7].indexOf(record.status) !== -1
                        ? () => onDeleteRequestDigital(record.id)
                        : null
                }
                onClickPreviewButton={() =>
                    props.history.push(`yeu-cau-cts-to-chuc/xem/${record.id}`)
                }
                onClickUpload={
                    [2].indexOf(record.file_status) !== -1
                    ? () => importClick(record.id)
                    : null
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
            dataIndex: "organization.fullname"
        },
        {
            title: "Mã số/MST",
            dataIndex: "organization.code"
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
                if (Number(e.status) === 6 && e.secret_code){
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
            return await RequestCertificateGroupService.getListIndex(params);
        } catch (error) {
            onFailAction(error.message);
        }
    };
    const [modalImport, setModalImport] = useState({
        visible_modal_deny : false,
        loading: false,
        title_modal: "",
        base64: "",
        type_file: "",
        text_deny: "",
        error_text_deny: "",
    });
    const [fileName, setFileName] = useState("");
    const [id, setID] = useState();
    const handleModalImportCancel = () => {
        setModalImport({...modalImport, 'visible_modal_deny':false})
    };
    const confirmImport = async () => {
        if (!fileName) {
            setModalImport({...modalImport, 'error_text_deny': "Bạn chưa tải file hồ sơ lên" });
            return false;
        }
        const data = {file:fileName, id: id};
        const result = await RequestCertificateGroupService.uploadFile(data);
        await setModalImport({...modalImport, 'visible_modal_deny': false });
        if (result && Number(result.status) === 200) {
            onSuccessAction("Tải dữ liệu thành công!", () => {
                props.history.push("/yeu-cau-cts-to-chuc");
            });
        } else if (result && Number(result.status) === 404) {
            onFailAction("File hồ sơ ko đúng mẫu!");
        } else {
            onFailAction(result.error, () => {
                props.history.push("/yeu-cau-cts-to-chuc");
                setFileName("");
            });
        }
    };
    const onChangeDataDeny = ({ target: { value } }) => {
        setModalImport({...modalImport, 'text_deny': value});
    };
    const onChangeFile = async e => {
        const files = e.target.files[0];
        if (files) {
            const fileSize = files.size/1024/1024;
                if(fileSize>2){
                    setModalImport({...modalImport, 'error_text_deny': "File tải lên không thể lớn hơn 2MB" });
                    return false;
                }else {
                    const formData = new FormData();
                    formData.append("file", files);
                    loading.runLoadingBlockUI();
                    const fileData = await BaseServices.axiosUpLoadFile(formData);
                    if(fileData){
                        setFileName(fileData.file);
                    }
                    loading.stopRunLoading();
                }

        } else {
            setFileName("");
        }
    };
    const importClick = async id => {
        setModalImport({...modalImport, 'visible_modal_deny': true });
        setID(id);
    };

    return (
        <PageWrapper title="Danh sách yêu cầu chứng thư số tổ chức">
            <WrappedRequestCTSGroupSearchForm/>
            <Table columns={columns} onFetchData={fetch}/>
            <ModalUploadFile
                visible={modalImport.visible_modal_deny}
                handleCancel={handleModalImportCancel}
                handleImport={confirmImport}
                value={modalImport.text_deny}
                onChange={onChangeDataDeny}
                error={modalImport.error_text_deny}
                onchangeFileUpload={onChangeFile}
                filename={fileName}
            />
        </PageWrapper>
    );
};
