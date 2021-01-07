import React, {useState} from "react";
import PageWrapper from "../wrapper/PageWrapper";
import Table from "../../components/common/table/Table";
import { onFailAction, onSuccessAction } from "helpers/SwalCommon";
import { reloadPage } from "helpers/NewCaCrmHelper";
import TableActionButton from "components/common/table/action-button/TableActionButton";
import { Tag } from "antd";
import WrappedReconciliationSearchForm from "./search/ReconciliationSearch";
import ModalDeny from "../../components/common/form/ModalDeny";
import {FormComponentProps} from "antd/lib/form";
import {History, Location, LocationState} from "history";
import {ReconciliationServices} from "../../services/reconciliation/ReconciliationServices";
import moment from "moment";
import {STATUS_CROSS_ENUM} from "./enum/ReconciliationEnum";
import {authenticationService} from "../../services/authentication/AuthenticationService";
import AntModal from "../../components/common/modal/AntModal";
import axios from "axios";

interface Props extends FormComponentProps {
    location: Location;
    history: History<LocationState>;
}
export const Reconciliation: React.FC<Props> = props => {
    const [visibleModal, setVisibleModal] = useState(false);
    const [file, setFile] = useState("");
    const [loading, setLoading] = useState(false);


    const dataSign = {
        "fieldName":"SignatureB [002]",
        "signDate":null,
        "TypeSign":1,
        "page": 4,
        "px": 86,
        "py": 61,
        "pw": 180,
        "ph": 10
    };
    const approveAndSign = async (id) => {
        try {
            const certSerial = await ReconciliationServices.getCertSerial(id);
            const fileSign = await ReconciliationServices.getFile(id);
            let allDataSign = {...dataSign, "CertSerial":certSerial.certSerial, "FileData":fileSign.base64};
            onSign(allDataSign, id);
        } catch (error) {
            onFailAction("Có lỗi xảy ra trong quá duyệt!");
        }
    };
    const onSign = (allDataSign, id) => {
        axios.post(`http://localhost:6706/api/sign/signpdf`, allDataSign)
            .then((response) => {
                const data = response.data;
                if (!data.FileDataSigned) {
                    onFailAction('Không tìm thấy chứng thư số.');
                    return ;
                }
                updateSignedContract({...data, id: id}, id);
            })
            .catch((error) => {
                onFailAction(error);
            });
    };
    const updateSignedContract = async (data, id) => {
        const { location, history } = props;
        const result = await ReconciliationServices.updateSignedFile(data);
        if (result && result.status === 200){
            const approve = await ReconciliationServices.approve(id);
            if(Number(approve.status) === 200){
                reloadPage(location, history);
                onSuccessAction("Duyệt đối soát thành công!");
            }
        } else {
            onFailAction("Có lỗi xảy ra !");
        }
    };
    const [modalDeny, setModalDeny] = useState({
        visible_modal_deny : false,
        loading: false,
        title_modal: "",
        base64: "",
        type_file: "",
        reason: "",
        error_reason: "",
        id: 0,
    });
    const handleModalDenyCancel = () => {
        setModalDeny({...modalDeny, 'visible_modal_deny':false})
    };
    const confirmDeny = async () => {
        if (modalDeny.reason.trim() === "") {
            setModalDeny({...modalDeny, 'error_reason': "Lý do từ chối không được trống" });
            return false;
        }
        const data = {reason:modalDeny.reason, id:modalDeny.id};

        const result = await ReconciliationServices.deny(data);
        await setModalDeny({...modalDeny, 'visible_modal_deny': false });

        if (result && Number(result.status) === 200) {
            onSuccessAction("Từ chối đối soát thành công!", () => {
                props.history.push("/danh-sach-doi-soat");
            });
        } else if (result && Number(result.status) === 422) {
            onFailAction("Có lỗi xảy ra trong quá trình từ chối!");
        } else {
            onFailAction(result.error);
        }
    };
    const onChangeDataDeny = ({ target: { value } }) => {
        setModalDeny({...modalDeny, 'reason': value});
    };

    const submitDeny = (id) => {
        setModalDeny({...modalDeny, 'visible_modal_deny': true, 'id': id });
    };
    const formatDateTime = (date: string) => {
        if (date) {
            return moment(date).format("DD/MM/YYYY");
        } else {
            return "";
        }
    };
    const onOkModal = () => {
        setVisibleModal(false);
    };
    const onClickWatchFile = (id) =>{
        setVisibleModal(true);
        setLoading(true);

        ReconciliationServices.getFile(id).then((data)=>{
            setFile(data.base64);
            setLoading(false);
        }).catch(()=>{
            onFailAction("Có lỗi xảy ra khi xem file");
        })
    };
    const renderWatchFile = (text, record, index) => {
        return (
            <button className="btn btn-outline-primary form-control" onClick={()=>onClickWatchFile(record.id)}>Xem file</button>
        );
    };

    const renderActionButton = (text, record, index) => {
        return (
            <TableActionButton
                onClickApprove={ () => approveAndSign(record.id)}
                onClickDeny={() => submitDeny(record.id)}
                permissionApprove={checkActionButton(record)}
                permissionDeny={checkActionButton(record)}
            />

        );
    };
    const checkActionButton = (record: any): any => {
        if(authenticationService.currentUserValue.typeUser === 7){
            if(Number(record.status) === 2 && Number(record.belong_to) === 1){
                return true;
            }else {
                return false;
            }
        }
        if(authenticationService.currentUserValue.typeUser === 8 ){
            return false;
        }
        if(authenticationService.currentUserValue.typeUser === 5 ){
            if(Number(record.status) === 2 && (Number(record.belong_to) === 3 || Number(record.belong_to) === 2)){
                return true;
            }else {
                return false;
            }
        }
    };
    const renderStatusColumn = (text, record, index) => {
        return (
            <Tag color={`${STATUS_CROSS_ENUM[text].class}`}>
                {STATUS_CROSS_ENUM[text].label}
            </Tag>
        );
    };
    const columns = [
        {
            title: "Tên đại lý/CTV",
            dataIndex: '',
            render: (e) => {
                if (e){
                    if(Number(e.belong_to) === 1){
                        return <p>{e.agency.fullname}</p>
                    }
                    if(Number(e.belong_to) === 2){
                        return <p>{e.contributor.fullname}</p>
                    }
                    if(Number(e.belong_to) === 3){
                        return <p>{e.employee.fullname}</p>
                    }
                }
            }
        },
        {
            title: "MST/CMND",
            dataIndex: '',
            render: (e) => {
                if (e){
                    if(Number(e.belong_to) === 1){
                        return <p>{e.agency.tax_code}</p>
                    }
                    if(Number(e.belong_to) === 2){
                        return <p>{e.contributor.passport}</p>
                    }
                    if(Number(e.belong_to) === 3){
                        return <p>{e.employee.tax_code}</p>
                    }
                }
            }
        },
        {
            title: "Người quản lý",
            dataIndex: '',
            render: (e) => {
                if (e){
                    if(Number(e.belong_to) === 1 || Number(e.belong_to) === 2){
                        return <p>{e.user_manager.fullname}</p>
                    }
                    if(Number(e.belong_to) === 3){
                        return <p>{e.employee.fullname}</p>
                    }
                }
            }
        },
        {
            title: "Loại người dùng",
            dataIndex: '',
            render: (e) => {
                if (e){
                    if(Number(e.belong_to) === 1){
                        return <p>Đại lý</p>
                    }
                    if(Number(e.belong_to) === 2){
                        return <p>Cộng tác viên</p>
                    }
                    if(Number(e.belong_to) === 3){
                        return <p>NVKD</p>
                    }
                }
            },
        },
        {
            title: "Tháng",
            dataIndex: 'month',
        },
        {
            title: "Năm",
            dataIndex: 'year',
        },
        {
            title: "Trạng thái",
            dataIndex: 'status',
            render: renderStatusColumn
        },
        {
            title: "Ngày tạo",
            dataIndex: 'created_at',
            render: (text, record, index) => formatDateTime(text)
        },
        {
            title: "File đối soát",
            dataIndex: '',
            render: renderWatchFile,
        },
        {
            title: "Tác vụ",
            render: renderActionButton
        }
    ];

    const fetch = async (params = {}) => {
        try {
            if(Number(authenticationService.currentUserValue.typeUser) === 7 || Number(authenticationService.currentUserValue.typeUser) === 8){
                const data = await ReconciliationServices.index(params);
                return data;
            }
            if(Number(authenticationService.currentUserValue.typeUser) === 5){
                const data = await ReconciliationServices.indexStaff(params);
                return data;
            }
        } catch (error) {
            onFailAction(error.message);
        }
    };
    return (
        <PageWrapper title="Danh sách đối soát NEWCA">
            <ModalDeny
                visible={modalDeny.visible_modal_deny}
                handleCancel={handleModalDenyCancel}
                handleDeny={confirmDeny}
                value={modalDeny.reason}
                onChange={onChangeDataDeny}
                error={modalDeny.error_reason}
            />
            <AntModal
                visible={visibleModal}
                loading={loading}
                className="w-75 h-75"
                bodyStyle={{ height: "700px" }}
                style={{ top: "20px" }}
                onCLickOk={onOkModal}
            >
                <iframe
                    title="Quản lý hợp đồng"
                    src={`data:application/pdf;base64,${file}`}
                    height="100%"
                    width="100%"
                ></iframe>
            </AntModal>
            <WrappedReconciliationSearchForm />
            <Table columns={columns} onFetchData={fetch} />
        </PageWrapper>
    );
};
