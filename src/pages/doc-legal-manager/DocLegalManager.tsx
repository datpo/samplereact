import React, {useState} from "react";
import PageWrapper from "../wrapper/PageWrapper";
import Table from "../../components/common/table/Table";
import {onFailAction, onSuccessAction} from "helpers/SwalCommon";
import {RouteComponentProps} from "react-router";
import {DocLegalManagerService} from "../../services/doc-legal-manager/DocLegalManagerService";
import DocLegalManagerSearchForm from "./search/DocLegalManagerSearchForm";
import MenuDropDoc from "./MenuDropDoc";
import {Dropdown, Tag, Tooltip} from "antd";
import {loading} from "../../components/common/loading/Loading";
import BaseServices from "../../services/base/BaseServices";
import ModalUploadFile from "./ModalUploadFile";
import { formatDateTime } from "helpers/NewCaCrmHelper";

interface Props extends RouteComponentProps {
}

export const DocLegalManager: React.FC<Props> = props => {
    const [file, setFile] = useState("");
    const [id, setId] = useState("");
    const [fileDoc1, setFileDoc1] = useState(false);
    const [fileDoc2, setFileDoc2] = useState(false);
    const [fileDoc3, setFileDoc3] = useState(false);
    const [fileDoc4, setFileDoc4] = useState(false);
    const [fileDoc5, setFileDoc5] = useState(false);
    const [fileDoc6, setFileDoc6] = useState(false);
    const [fileDoc7, setFileDoc7] = useState(false);
    const [fileDoc8, setFileDoc8] = useState(false);
    const [fileDoc9, setFileDoc9] = useState(false);
    const [fileDoc10, setFileDoc10] = useState(false);
    const [fileDoc11, setFileDoc11] = useState(false);
    const [fileDoc12, setFileDoc12] = useState(false);
    const [fileDoc13, setFileDoc13] = useState(false);
    // nút xem file
    const renderActionViewFile = (text, record, index) => {
        let listDoc: Array<number> = [];
        record.list_document.forEach(function (value) {
            listDoc.push(value.type);
        });
        return (
            <div className="row justify-content-center">
                <Dropdown
                    overlay={
                        <MenuDropDoc onClick={(index) => onPreviewFile(record.id, index)} link={file} dataDoc={listDoc}/>
                    }
                    trigger={["click"]}
                    placement="bottomLeft"
                >
                    <button className="btn btn-outline-primary btn-sm w-100 ml-2 mr-2">Xem file <i className="fas fa-angle-down"/></button>
                </Dropdown>
            </div>
        );
    };
    // nút tác vụ
    const renderActionButton = (text, record, index) => {
        let listDoc: Array<number> = [];
        record.list_document.forEach(function (value) {
            listDoc.push(value.type);
        });
        return (
            <div className="row justify-content-center">
                {record.list_document[0].status === 3 ?
                    <button type="button" title="Tải lại hồ sơ" className="text-primary ml-2" onClick={()=>onClickUpload(record.id, listDoc)}><i className="fas fa-upload fa-lg"/></button> : ""
                }
            </div>
        );
    };
    //Click xem file
    const onPreviewFile = async (id, type) => {
        try {
            let token = localStorage.getItem("currentUser");
            if (token){
                let obj = JSON.parse(token);
                let link = `${process.env.REACT_APP_BASE_API_URL}qlbh/quan-ly-ho-so/previewFile/${id}/${type}?token=${obj.token}`;
                setFile(link);
            }
        } catch (error) {
            onFailAction("Có lỗi xảy ra!");
        }
    };
    //Tải lại file
    const [modalImport, setModalImport] = useState({
        visible_modal_deny : false,
        loading: false,
        title_modal: "",
        base64: "",
        type_file: "",
        text_deny: "",
        error_text_deny: "",
    });
    const [fileName1, setFileName1] = useState("");
    const [fileName2, setFileName2] = useState("");
    const [fileName3, setFileName3] = useState("");
    const [fileName4, setFileName4] = useState("");
    const [fileName5, setFileName5] = useState("");
    const [fileName6, setFileName6] = useState("");
    const [fileName7, setFileName7] = useState("");
    const [fileName8, setFileName8] = useState("");
    const [fileName9, setFileName9] = useState("");
    const [fileName10, setFileName10] = useState("");
    const [fileName11, setFileName11] = useState("");
    const [fileName12, setFileName12] = useState("");
    const [fileName13, setFileName13] = useState("");
    const handleModalImportCancel = () => {
        setModalImport({...modalImport, 'visible_modal_deny':false, 'error_text_deny':""});
        setFileDoc1(false);
        setFileDoc2(false);
        setFileDoc3(false);
        setFileDoc4(false);
        setFileDoc5(false);
        setFileDoc6(false);
        setFileDoc7(false);
        setFileDoc8(false);
        setFileDoc9(false);
        setFileDoc10(false);
        setFileDoc11(false);
        setFileDoc12(false);
        setFileDoc13(false);
        setFileName1("");
        setFileName2("");
        setFileName3("");
        setFileName4("");
        setFileName5("");
        setFileName6("");
        setFileName7("");
        setFileName8("");
        setFileName9("");
        setFileName10("");
        setFileName11("");
        setFileName12("");
        setFileName13("");
    };
    const confirmImport = async () => {
        if (!fileName1&&!fileName2&&!fileName3&&!fileName4&&!fileName5&&!fileName6&&!fileName7&&!fileName8&&!fileName9&&!fileName10&&!fileName11&&!fileName12&&!fileName13) {
            setModalImport({...modalImport, 'error_text_deny': "Bạn chưa tải file hồ sơ lên" });
            return false;
        }
        const data = {file1:fileName1,file2:fileName2,file3:fileName3,file4:fileName4,file5:fileName5,file6:fileName6,file7:fileName7,file8:fileName8,file9:fileName9,file10:fileName10,file11:fileName11,file12:fileName12,file13:fileName13, id: id};
        const result = await DocLegalManagerService.uploadFile(data);
        await setModalImport({...modalImport, 'visible_modal_deny': false });
        if (result && Number(result.status) === 200) {
            onSuccessAction("Tải thành công!", window.location.reload());
        } else {
            onFailAction(result.error, () => {
                props.history.push("/quan-ly-ho-so-phap-ly");
                setFileName1("");
            });
        }
    };
    const onChangeFile = async e => {
        const files = e.target.files[0];
        const name = e.target.name;
        if (files) {
            if (files.type !== "application/pdf") {
                setModalImport({...modalImport, 'error_text_deny': "Chỉ chấp nhận định dạng file PDF" });
                return false;
            }
            const fileSize = files.size/1024/1024;
            if(fileSize>2){
                setModalImport({...modalImport, 'error_text_deny': "Giới hạn dung lượng 2MB" });
                return false;
            }else {
                const formData = new FormData();
                formData.append("file", files);
                loading.runLoadingBlockUI();
                const fileData = await BaseServices.axiosUpLoadFile(formData);
                if(fileData){
                    if (name === "1") setFileName1(fileData.file);
                    if (name === "2") setFileName2(fileData.file);
                    if (name === "3") setFileName3(fileData.file);
                    if (name === "4") setFileName4(fileData.file);
                    if (name === "5") setFileName5(fileData.file);
                    if (name === "6") setFileName6(fileData.file);
                    if (name === "7") setFileName7(fileData.file);
                    if (name === "8") setFileName8(fileData.file);
                    if (name === "9") setFileName9(fileData.file);
                    if (name === "10") setFileName10(fileData.file);
                    if (name === "11") setFileName11(fileData.file);
                    if (name === "12") setFileName12(fileData.file);
                    if (name === "13") setFileName13(fileData.file);
                }
                loading.stopRunLoading();
            }
            
        } else {
            if (name === "1") setFileName1("");
            if (name === "2") setFileName2("");
            if (name === "3") setFileName3("");
            if (name === "4") setFileName4("");
            if (name === "5") setFileName5("");
            if (name === "6") setFileName6("");
            if (name === "7") setFileName7("");
            if (name === "8") setFileName8("");
            if (name === "9") setFileName9("");
            if (name === "10") setFileName10("");
            if (name === "11") setFileName11("");
            if (name === "12") setFileName11("");
            if (name === "13") setFileName11("");
        }
    };
    const onClickUpload = async (id,listDoc) => {
        setModalImport({...modalImport, 'visible_modal_deny': true });
        setId(id);
        if (listDoc.includes(1)) setFileDoc1(true);
        if (listDoc.includes(2)) setFileDoc2(true);
        if (listDoc.includes(3)) setFileDoc3(true);
        if (listDoc.includes(4)) setFileDoc4(true);
        if (listDoc.includes(5)) setFileDoc5(true);
        if (listDoc.includes(6)) setFileDoc6(true);
        if (listDoc.includes(7)) setFileDoc7(true);
        if (listDoc.includes(8)) setFileDoc8(true);
        if (listDoc.includes(9)) setFileDoc9(true);
        if (listDoc.includes(10)) setFileDoc10(true);
        if (listDoc.includes(11)) setFileDoc11(true);
        if (listDoc.includes(12)) setFileDoc12(true);
        if (listDoc.includes(13)) setFileDoc13(true);
    };
    const columns = [
        {
            title: "Mã khách hàng",
            dataIndex: "",
            render: (e) => {
                if (e.type_request === 1){
                    return e.organization.uid;
                } else {
                    return e.requestpersonal.uid;
                }
            }
        },
        {
            title: 'Mã yêu cầu',
            dataIndex: "code"
        },
        {
            title: "Mã DN/CMND",
            dataIndex: "",
            render: (e) => {
                if (e.type_request === 1){
                    return e.organization.code;
                } else {
                    return e.requestpersonal.passport;
                }
            }
        },
        {
            title: "Loại yêu cầu",
            dataIndex: "",
            render: (e) => {
                if (e.object === 1){
                    return <Tag color="green">Cấp mới</Tag>
                }
                if (e.object === 2){
                    return <Tag color="blue">Gia hạn</Tag>
                }
                if (e.object === 3){
                    return <Tag color="red">Chuyển đổi</Tag>
                }
            }
        },
        {
            title: "Đối tượng",
            dataIndex: "",
            render: (e) => {
                if (e.type_request === 1){
                    return <Tag color="green">Tổ chức</Tag>
                }
                if (e.type_request === 2){
                    return <Tag color="blue">Cá nhân</Tag>
                }
            }
        },
        {
            title: "Trạng thái",
            dataIndex: "",
            render: (e) => {
                if (e.list_document[0].status === 1){
                    return <Tag color="orange">Chờ xác nhận</Tag>
                }
                if (e.list_document[0].status === 2){
                    return <Tag color="green">Hợp lệ</Tag>
                }
                if (e.list_document[0].status === 3){
                    return (
                        <Tooltip title={e.list_document[0].reason} placement="topLeft">
                            <Tag color="magenta">Không hợp lệ</Tag>
                        </Tooltip>
                    )
                }
            }
        },
        {
          title: "Loại hồ sơ",
            dataIndex: "",
            render: (e) => {
                if (e.type_docurment === 1){
                    return <Tag color="orange">Điện tử</Tag>
                }
                if (e.type_docurment === 2){
                    return <Tag color="green">Giấy</Tag>
                }
                if (e.type_docurment === 3){
                    return <Tag color="magenta">Scan</Tag>
                }
            }
        },
        {
            title: "File",
            render: renderActionViewFile
        },
        {
            title: "Ngày cập nhật hồ sơ",
            className: "text-center",
            render: (e) => {
                if (e.update_profile_at){
                    return formatDateTime(e.update_profile_at)
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
            return await DocLegalManagerService.list(params);
        } catch (error) {
            onFailAction(error.message);
        }
    };

    return (
        <PageWrapper title="Quản lý hồ sơ pháp lý">
            <DocLegalManagerSearchForm/>
            <Table columns={columns} onFetchData={fetch}/>
            <ModalUploadFile
                visible={modalImport.visible_modal_deny}
                handleCancel={handleModalImportCancel}
                handleImport={confirmImport}
                value={modalImport.text_deny}
                error={modalImport.error_text_deny}
                onchangeFileUpload={onChangeFile}
                filename1={fileName1}
                filename2={fileName2}
                filename3={fileName3}
                filename4={fileName4}
                filename5={fileName5}
                filename6={fileName6}
                filename7={fileName7}
                filename8={fileName8}
                filename9={fileName9}
                filename10={fileName10}
                filename11={fileName11}
                filename12={fileName12}
                filename13={fileName13}
                fileDoc1={fileDoc1}
                fileDoc2={fileDoc2}
                fileDoc3={fileDoc3}
                fileDoc4={fileDoc4}
                fileDoc5={fileDoc5}
                fileDoc6={fileDoc6}
                fileDoc7={fileDoc7}
                fileDoc8={fileDoc8}
                fileDoc9={fileDoc9}
                fileDoc10={fileDoc10}
                fileDoc11={fileDoc11}
                fileDoc12={fileDoc12}
                fileDoc13={fileDoc13}
            />
        </PageWrapper>
    );
};
