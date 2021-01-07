import React, {useEffect, useState} from "react";
import PageWrapper from "../wrapper/PageWrapper";
import Table from "../../components/common/table/Table";
import {onFailAction, onSuccessAction} from "helpers/SwalCommon";
import {RouteComponentProps} from "react-router";
import {ContractManagerService} from "../../services/contract-manager/ContractManagerService";
import moment from "moment";
import WrappedContractManagerSearchForm from "./search/ContractManagerSearchForm";
import AntModal from "../../components/common/modal/AntModal";
import MenuDropAddendum from "../agency/form/btn-group/menu-drop-addendum/MenuDropAddendum";
import {Dropdown, Tag} from "antd";
import axios from "axios";
import {loading as loadingHelper} from "../../components/common/loading/Loading";

interface Props extends RouteComponentProps {
}

export const ContractManager: React.FC<Props> = props => {
    const [visibleModal, setVisibleModal] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [file, setFile] = useState("");
    const [isSign, setIsSign] = useState(false);
    const [idRecord, setIdRecord] = useState("");
    const [certSerial, setCertSerial] = useState("");
    const dataSign = {
        "signDate":"",
        "fieldName":"SignatureB [002]",
        "typeSign":"1",
        "page":"",
        "px":"",
        "py":"",
        "pw":"",
        "ph":""
    };
    // nút xem file
    const renderActionButton = (text, record, index) => {
        console.log(record)
        return (
            <div className="row justify-content-center">
                {(record.belong_to === 2 && record.type_contract_manager === 1) || record.type_contract_manager === 2 || (record.belong_to === 1 && record.agency.type === 1)
                    ? (<button title="Xem file" className="btn btn-outline-primary btn-sm w-100 ml-2 mr-2" onClick={() => onPreviewFile(record.id, record.type_contract_manager, false, '')}>Xem file</button>)
                    : ('')
                }
                {(record.belong_to === 1 && record.type_contract_manager === 1 && record.agency.type === 2)
                    ?
                    <Dropdown
                        overlay={
                            <MenuDropAddendum onClick={(index) => onPreviewFile(record.id, record.type_contract_manager, true, index)}
                                contract={true}
                                addendum1={!!(record.agency.product && record.agency.product.includes("1"))}
                                addendum2={!!(record.agency.product && record.agency.product.includes("2"))}
                                addendum3={!!(record.agency.product && record.agency.product.includes("3"))}
                            />
                        }
                        trigger={["click"]}
                        placement="bottomLeft"
                    >
                        <button className="btn btn-outline-primary btn-sm w-100 ml-2 mr-2">Xem file <i className="fas fa-angle-down"/></button>
                    </Dropdown> : ''
                }
            </div>
        );
    };
    //Click xem hợp đồng phụ lục
    const onPreviewFile = async (id, type, isAddendum, typeAddendum) => {
        try {
            setIdRecord(id);
            setVisibleModal(true);
            setLoadingModal(true);
            const result = await ContractManagerService.onPreviewFile(id, type, isAddendum, typeAddendum);
            setFile(result.base64);
            if (result.status === 200 && type === 1){
                getIsSign(id, typeAddendum);
            }
        } catch (error) {
            onFailAction("Có lỗi xảy ra!");
            setVisibleModal(false);
        } finally {
            setLoadingModal(false);
        }
    };
    //Check nút ký
    const getIsSign = async (id, typeAddendum) => {
        const result = await ContractManagerService.getIsSign(id, typeAddendum);
        if (result.status === 200){
            setIsSign(true)
        }else{
            setIsSign(false)
        }
    };
    //Đóng modal
    const onOkModal = () => {
        setVisibleModal(false);
        setIsSign(false);
    };
    //định dạng datetime
    const formatDateTime = (date: string) => {
        if (date) {
            return moment(date).format("DD/MM/YYYY");
        } else {
            return "";
        }
    };
    //Ký hợp đồng
    const onSignContract = async () => {
        if (!certSerial){
            onFailAction("Không tìm thấy chứng thư số");
            return false;
        }
        loadingHelper.runLoadingBlockUI();
        let  dataSigned:any = {};
        const dataToSign = await ContractManagerService.getDataSign(idRecord);
        for (let key in dataToSign) {
            const resultSigned = await SignFile(dataToSign, key);
            if (!resultSigned){
                onFailAction("Có lỗi xảy ra");
                return false;
            }
            dataSigned[key] = resultSigned;
        }
        await updateFileSigned(dataSigned);
        loadingHelper.stopRunLoading();
    };
    //Ký file
    const SignFile = async (dataToSign, value) =>{
        let dataSignContent = dataToSign[value];
        let allDataSign = {...dataSign, "CertSerial":certSerial, "fileData":dataSignContent};
        return await axios.post(`http://localhost:6706/api/sign/signpdf`, allDataSign)
        .then((response) => {
            const data = response.data;
            return  data.FileDataSigned;
        }).catch((error) => {
            onFailAction(error);
        });
    };
    //Update file đã ký
    const updateFileSigned = async (dataSigned) => {
        const result = await ContractManagerService.updateFileSigned({idRecord, dataSigned});
        if (result && result.status === 200){
            onSuccessAction("Ký thành công!", () => {
                window.location.reload();
            });
        } else {
            onFailAction("Có lỗi xảy ra !");
        }
    };
    //lấy cerial
    const getSerial = async () => {
        const result = await ContractManagerService.getSerial();
        setCertSerial(result);
    };
    useEffect(() => {
        getSerial();
        // eslint-disable-next-line
    }, []);
    const columns = [
        {
            title: "Mã đại lý/CTV",
            dataIndex: "",
            render: (e) => {
                if (Number(e.type_contract_manager) === 1) {
                    if (Number(e.belong_to) === 1) {
                        return e.agency.code;
                    }
                    if (Number(e.belong_to) === 2) {
                        return e.contributor.code;
                    }
                }else{
                    if (Number(e.belong_to) === 1) {
                        return e.owner_agency.code;
                    }
                    if (Number(e.belong_to) === 2) {
                        return e.owner_contributor.code;
                    }
                }
            }
        },
        {
            title: "Loại",
            dataIndex: "",
            render: (e) => {
                if (Number(e.type_contract_manager) === 1) {
                    return <Tag color="green">Hợp đồng đại lý/CTV</Tag>
                }else{
                    return <Tag color="red">Biên bản thanh lý</Tag>
                }
            }
        },
        {
            title: "Hình thức ký",
            dataIndex: "",
            render: (e) => {
                if (Number(e.type_contract_manager) === 1) {
                    if (Number(e.belong_to) === 1) {
                        if (Number(e.agency.type) === 1){
                            return <Tag color="green">Hợp đồng giấy</Tag>
                        } else {
                            return <Tag color="blue">Hợp đồng điện tử</Tag>
                        }
                    }else{
                        if (Number(e.contributor.type) === 1){
                            return  <Tag color="green">Hợp đồng giấy</Tag>
                        } else {
                            return <Tag color="blue">Hợp đồng điện tử</Tag>
                        }
                    }
                }else{
                    if (Number(e.file_type) === 1) {
                        return <Tag color="blue">Biên bản thanh lý điện tử</Tag>
                    }else{
                        return <Tag color="green">Biên bản thanh lý giấy</Tag>
                    }
                }
            }
        },
        {
            title: "Ngày hợp đồng",
            dataIndex: "contract_date",
            render: (text, record, index) => formatDateTime(text)
        },
        {
            title: "Người tạo",
            dataIndex: "user.fullname",
        },
        {
            title: "Bên A",
            dataIndex: "",
            render: (e) => {
                if (Number(e.type_contract_manager) === 1) {
                    if (e.belong_to === 1){
                        if (e.agency.type === 1){
                            return <Tag color="green">Đã ký</Tag>
                        } else {
                            if (e.newca_signed_status) {
                                return <Tag color="green">Đã ký</Tag>
                            }else{
                                return <Tag color="red">Chưa ký</Tag>
                            }
                        }
                    } else {
                        if (e.contributor.type === 1){
                            return <Tag color="green">Đã ký</Tag>
                        } else {
                            if (e.newca_signed_status) {
                                return <Tag color="green">Đã ký</Tag>
                            }else{
                                return <Tag color="red">Chưa ký</Tag>
                            }
                        }
                    }
                }else{
                    if (e.file_type === 1){
                        if (e.newca_sign_status) {
                            return <Tag color="green">Đã ký</Tag>
                        }else{
                            return <Tag color="red">Chưa ký</Tag>
                        }
                    }else{
                        return <Tag color="green">Đã ký</Tag>
                    }
                }
            }
        },
        {
            title: "Bên B",
            dataIndex: "",
            render: (e) => {
                if (Number(e.type_contract_manager) === 1) {
                    if (e.belong_to === 1){
                        if (e.agency.type === 1){
                            return <Tag color="green">Đã ký</Tag>
                        } else {
                            if (e.owner_signed_status) {
                                return <Tag color="green">Đã ký</Tag>
                            }else{
                                return <Tag color="red">Chưa ký</Tag>
                            }
                        }
                    } else {
                        if (e.contributor.type === 1){
                            return <Tag color="green">Đã ký</Tag>
                        } else {
                            if (e.owner_signed_status) {
                                return <Tag color="green">Đã ký</Tag>
                            }else{
                                return <Tag color="red">Chưa ký</Tag>
                            }
                        }
                    }
                    
                }else{
                    if (e.file_type === 1){
                        if (e.customer_sign_status) {
                            return <Tag color="green">Đã ký</Tag>
                        }else{
                            return <Tag color="red">Chưa ký</Tag>
                        }
                    }else{
                        return <Tag color="green">Đã ký</Tag>
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
            const result = await ContractManagerService.list(params);
            return result;
        } catch (error) {
            onFailAction(error.message);
        }
    };

    return (
        <PageWrapper title="Quản lý hợp đồng">
            <WrappedContractManagerSearchForm/>
            <Table columns={columns} onFetchData={fetch}/>
            <AntModal
                visible={visibleModal}
                loading={loadingModal}
                className="w-75 h-75"
                bodyStyle={{height: "900px"}}
                style={{top: "20px"}}
                onCLickOk={onOkModal}
                isClickSign={isSign}
                onClickSign={onSignContract}
            >
                <iframe
                    title="Quản lý hợp đồng"
                    src={`data:application/pdf;base64,${file}`}
                    height="100%"
                    width="100%"
                />
            </AntModal>
        </PageWrapper>
    );
};
