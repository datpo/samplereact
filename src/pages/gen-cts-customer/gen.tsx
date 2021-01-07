import React, {useState} from "react";
import {FormComponentProps} from "antd/lib/form";
import {loading} from "../../components/common/loading/Loading";
import {onFailAction, onSuccessAction} from "../../helpers/SwalCommon";
import axios from "axios";
import ModalEnterPin from "../../components/common/form/ModalEnterPin";
import {Card, Form} from "antd";
import SelectWithLabel from "../../components/common/form/input-with-label/SelectWithLabel";
import InputWithLabel from "../../components/common/form/input-with-label/InputWithLabel";
import ButtonOnSave from "../../components/common/form/button/ButtonOnSave";
import SignModal from "../../components/common/modal/sign-file/SignModal";
import {GenCertServices} from "../../services/gen-cert/GenCertServices";
import {TextAreaWithLabel} from "../../components/common/form/input-with-label/TextAreaWithLabel";
import InputWithoutLabel from "../../components/common/form/input-with-label/input/InputWithoutLabel";
import AntModal from "../../components/common/modal/AntModal";
import ButtonOut from "../../components/common/form/button/ButtonOut";

interface Props extends FormComponentProps {
    history: any;
}

export const GenPage: React.FC<Props> = props => {
    const [file, setFile] = useState("");
    const [serialNumber, setSerialNumber] = useState(0);
    const [pin, setPin] = useState("");
    const [typeToken , setTypeToken ] = useState("");
    const [typeTokenGenBase64 , setTypeTokenGenBase64 ] = useState("");
    const [serialToken , setSerialToken ] = useState("");
    const [certSerial , setcertSerial ] = useState("");
    const [statusConnect, setStatusConnect] = useState(false);
    const [statusGen, setStatusGen] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [disableBtConnect, setDisableBtConnect] = useState(false);
    const [disableBtInstall,  setDisableBtInstall] = useState(false);
    const [disableBtSign,  setDisableBtSign] = useState(false);
    const [uid, setUid] = useState("");
    const [serialCertInfo, setSerialCertInfo] = useState("");
    const [serialCertInfoCertificate, setSerialCertInfoCertificate] = useState("");
    const [typeChange, setTypeChange] = useState(0);
    const [fileSigned, setFileSigned] = useState("");
    const [idRequest, setIdRequest] = useState(0);
    const [statusSign, setStatusSign] = useState(false);
    const [dateEnd, setDateEnd] = useState("");
    const [packageID, setPackageID] = useState(0);
    const [packageName, setPackageName] = useState("");
    const [sttSignFile, setSttSignFile] = useState(0);
    const [sttFile02, setSttFile02] = useState(false);
    const [disableField, setDisableField] = useState(false);
    const [cnName, setCNName] = useState("");
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [tokenOldNew, setTokenOldNew] = useState(0);

    const onChangeTypeUser = (e) =>{
        if(!e){
            props.form.setFieldsValue({
                length_key: ''
            });
        }else {
            if(Number(e) === 1){
                props.form.setFieldsValue({
                    length_key: 2048
                })
            }else if(Number(e) === 2){
                props.form.setFieldsValue({
                    length_key: 1024
                })
            }
        }
    };
    const onChangeSecret = async (e) => {
        if(!e.target.value){
            props.form.setFieldsValue({
                secret_code: "",
                package_id: "",
                package_name: "",
            });
        }else {
            const requestCert = await GenCertServices.getRequestBySecretCode(e.target.value);
            if(requestCert.status === 0){
                onFailAction("Yêu cầu không tồn tại!!!", () =>{
                    props.form.setFieldsValue({
                        secret_code: "",
                        package_id: "",
                        package_name: "",
                    });
                });
            }else {
                props.form.setFieldsValue({
                    package_id: requestCert.data.package_id,
                    package_name: requestCert.data.cateservicespackage.name,
                });
            }
        }
    };
    const checkUSBToken = async () => {
        const { validateFields } = props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                let identity_code = values.identity_code.trim() ;
                let secret_code = values.secret_code.trim();
                let object = values.object;
                let type_user = values.type_user;
                let iden = "";
                let idenChange = '';
                if(Number(object) === 1 || Number(object) === 2 || Number(object) === 4){
                    const requestCert = await GenCertServices.getRequestBySecretCode(secret_code);
                        if (Number(requestCert.data.object) === 2){
                            setTokenOldNew(requestCert.data.token_type);
                            setSerialCertInfoCertificate(requestCert.data.serial_cts);
                        }
                        setCNName(requestCert.owner.fullname);
                        setProvince(requestCert.data.province.fullname);
                        setDistrict(requestCert.data.district.fullname);
                    let arrAll:any = [];
                    requestCert.data.list_document.forEach(function (values) {
                        arrAll[values.id] = values.type;
                    });
                    arrAll.forEach(function(item, index, array) {
                        if(Number(item) === 7){
                            setSttFile02(true);
                        }
                    });
                    if (Number(requestCert.data.status) === 5){
                        onFailAction("Yêu cầu không phù hợp!!!", () =>{
                            props.form.setFieldsValue({
                                secret_code: "",
                                package_id: "",
                                package_name: "",
                            });
                        });
                    }
                    let objectRequestCert = requestCert.data.object;
                    if(Number(requestCert.data.object) === 3){
                        objectRequestCert = 4;
                    }

                    if(Number(requestCert.status) === 0){
                        onFailAction("Yêu cầu không tồn tại!!!", () =>{
                            props.form.setFieldsValue({
                                secret_code: "",
                                package_id: "",
                                package_name: "",
                            });
                        });
                    }else {
                        setPackageID(requestCert.data.cateservicespackage.id);
                        setPackageName(requestCert.data.cateservicespackage.name);
                        setIdRequest(requestCert.data.id);

                        if(Number(requestCert.data.type_request) === 1){
                            iden = requestCert.owner.code;
                        }else {
                            iden = requestCert.owner.passport;
                        }
                        if(iden !== identity_code){
                            onFailAction("Mã định danh và mã bảo mật không phù hợp!!!", () =>{
                                props.form.setFieldsValue({
                                    secret_code: "",
                                    package_id: "",
                                    package_name: "",
                                });
                            });
                        }
                        if(Number(objectRequestCert) !== Number(object)){
                            onFailAction("Yêu cầu không phù hợp !!!", ()=>{
                                props.form.setFieldsValue({
                                    secret_code: "",
                                    package_id: "",
                                    package_name: "",
                                });
                            });
                        }
                        if(Number(requestCert.data.type_request) !== Number(type_user)){
                            onFailAction("Yêu cầu không phù hợp với loại người dùng!!!", ()=>{
                                props.form.setFieldsValue({
                                    secret_code: "",
                                    package_id: "",
                                    package_name: "",
                                });
                            });
                        }
                        props.form.setFieldsValue({
                            package_id: requestCert.data.package_id,
                            package_name: requestCert.data.cateservicespackage.name,
                        });

                    }
                    if(Number(requestCert.status) === 200 && iden === identity_code && Number(objectRequestCert) === Number(object) && Number(requestCert.data.type_request) === Number(type_user)){
                        try {
                            loading.runLoadingBlockUI();
                            const result = await GenCertServices.checkPlugin();
                            if(result.Code !== 100){
                                onFailAction("Bạn chưa cắm usb token !");
                            }else {
                                setTypeToken(result.TypeCode);
                                setSerialToken(result.SerialNumber);
                                setSerialNumber(result.SerialNumber);
                                let typeToken = "Token "+result.TypeCode;
                                setTypeTokenGenBase64(typeToken);
                                const checkTokenCode = await GenCertServices.getTokenByCode(result.SerialNumber);
                                if(!checkTokenCode.data){
                                    onFailAction("USB token không tồn tại trên hệ thống!!!");
                                }else {
                                    if(Number(checkTokenCode.data.type) === 1){
                                        onFailAction("Loại token không phù hợp!!!");
                                    }else {
                                        if(Number(props.form.getFieldValue("object")) === 1 || Number(props.form.getFieldValue("object")) === 4) {
                                            if (Number(checkTokenCode.data.cts_status) === 1) {
                                                setStatusConnect(false);
                                                onFailAction("USB đã tồn tại chứng thư số!!!");
                                            } else {
                                                submitPin();
                                            }
                                        }
                                        if(Number(props.form.getFieldValue("object")) === 2){
                                            if (Number(requestCert.data.token_type) === 2){
                                                if(Number(checkTokenCode.data.cts_status) === 1){
                                                    submitPin();
                                                }else if(Number(checkTokenCode.data.cts_status) === 1 && Number(checkTokenCode.data.certificate_status) === 2){
                                                    submitPin();
                                                }else {
                                                    setStatusConnect(false);
                                                    onFailAction("USB chưa tồn tại chứng thư số!!!");
                                                }
                                            }else {
                                                if (Number(checkTokenCode.data.cts_status) === 1) {
                                                    setStatusConnect(false);
                                                    onFailAction("USB đã tồn tại chứng thư số!!!");
                                                } else {
                                                    submitPin();
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                        }catch (error) {
                            onFailAction("Bạn chưa cài phần mềm NewCA plugin !");
                        }finally {
                            loading.stopRunLoading();
                        }
                    }
                }
                if(Number(object) === 3){
                    const requestChange = await GenCertServices.getRequestChange(secret_code, type_user);
                    if (Number(requestChange.requestChangeOwner.status) === 2){
                        onFailAction("Yêu cầu không phù hợp!!!", () =>{
                            props.form.setFieldsValue({
                                secret_code: "",
                                package_id: "",
                                package_name: "",
                            })
                        });
                    }
                    if(Number(requestChange.status) === 0){
                        onFailAction("Yêu cầu không tồn tại!!!", () =>{
                            props.form.setFieldsValue({
                                secret_code: "",
                                package_id: "",
                                package_name: "",
                            })
                        });
                    }else {
                        setPackageID(requestChange.requestChangeOwner.request.cateservicespackage.id);
                        setPackageName(requestChange.requestChangeOwner.request.cateservicespackage.name);
                        setIdRequest(requestChange.requestChange.id);
                        setUid(requestChange.requestChange.uid);
                        setSerialCertInfo(requestChange.certOldInfo.certificateSerial);
                        setTypeChange(requestChange.requestChange.type_change);
                        idenChange = requestChange.requestChange.code;
                        const reqCert = await GenCertServices.getRequestToGenCus(requestChange.requestChangeOwner.request_id);

                        if(idenChange !== identity_code){
                            onFailAction("Mã định danh và mã bảo mật không phù hợp!!!", () =>{
                                props.form.setFieldsValue({
                                    secret_code: "",
                                    package_id: "",
                                    package_name: "",
                                })
                            });
                        }
                        if(Number(requestChange.requestChange.type) !== Number(type_user)){
                            onFailAction("Yêu cầu không phù hợp với loại người dùng!!!", ()=>{
                                props.form.setFieldsValue({
                                    secret_code: "",
                                    package_id: "",
                                    package_name: "",
                                })
                            });
                        }
                        props.form.setFieldsValue({
                            package_id: reqCert.data.package_id,
                            package_name: reqCert.data.cateservicespackage.name,
                        });
                    }
                    if(Number(requestChange.status) === 200 && idenChange === identity_code && Number(requestChange.requestChange.type) === Number(type_user)){
                        try {
                            loading.runLoadingBlockUI();
                            const result = await GenCertServices.checkPlugin();
                            if(result.Code !== 100){
                                onFailAction("Bạn chưa cắm USB token!!!");
                            }else {
                                setTypeToken(result.TypeCode);
                                setSerialToken(result.SerialNumber);
                                setSerialNumber(result.SerialNumber);
                                const checkTokenCode = await GenCertServices.getTokenByCode(result.SerialNumber);
                                if(!checkTokenCode.data){
                                    onFailAction("USB token không tồn tại trên hệ thống!!!");
                                }else {
                                    if(Number(checkTokenCode.data.type) === 1){
                                        onFailAction("Loại token không phù hợp!!!");
                                    }else {
                                            if(Number(checkTokenCode.data.cts_status) === 1){
                                                submitPin();
                                            }else {
                                                setStatusConnect(false);
                                                onFailAction("USB chưa tồn tại chứng thư số!!!");
                                            }
                                    }
                                }
                            }
                        }catch (error) {
                            onFailAction("Bạn chưa cài phần mềm NewCA plugin !");
                        }finally {
                            loading.stopRunLoading();
                        }
                    }

                }
            }else {
                onFailAction("Bạn chưa điền đủ thông tin!");
            }
        })

    };
    const [modalPin, setModalPin] = useState({
        visible_modal_pin : false,
        loading: false,
        title_modal: "",
        base64: "",
        type_file: "",
        pin: "",
        error_pin: "",
    });
    const handleModalConnectCancel = () => {
        setModalPin({...modalPin, 'visible_modal_pin':false})
    };
    const confirmPin = async () => {
        if (modalPin.pin.trim() === "") {
            setModalPin({...modalPin, 'error_pin': "Mã pin không được trống" });
            return false;
        }
        const { validateFields } = props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                const pin = modalPin.pin;
                const keylength  = values.length_key;
                const type_user  = values.type_user;
                const object  = values.object;
                const identity_code = values.identity_code.trim();
                const secret_code = values.secret_code.trim();
                setPin(pin);
                if(Number(object) === 1 || Number(object) === 4){
                    loading.runLoadingBlockUI();
                        const result = await GenCertServices.genCsr(pin, keylength , typeToken, serialToken, identity_code, cnName, '', district, province, 'VN');
                    if(result.Code === 100){
                        loading.runLoadingBlockUI();
                        await GenCertServices.saveCSR(type_user, object,secret_code,result.CKID, result.Base64CSR);
                        onSuccessAction("Kết nối USB Token thành công!");
                        setDisableBtConnect(true);
                        setStatusConnect(true);
                        setDisableField(true);
                        loading.stopRunLoading();
                    }
                    if(Number(result.Code) === 1003){
                        onFailAction("Mã pin không chính xác, vui lòng kiểm tra lại mã pin!", () =>
                        {
                            submitPin()
                        });
                        loading.stopRunLoading();
                    }
                    if(Number(result.Code) === 1007){
                        onFailAction("Đã tồn tại chứng thư số trong USB Token ");
                        loading.stopRunLoading();
                    }
                    await setModalPin({...modalPin, 'visible_modal_pin': false });
                }
                if(Number(object) === 2){
                    if (Number(tokenOldNew) === 2){
                        loading.runLoadingBlockUI();
                        const serialData = await GenCertServices.getSerialCert(serialNumber);
                        const serialcert = serialData.data.serial;
                        const identityCert = serialData.data.tax_code;
                        setSerialCertInfoCertificate(serialData.data.serial);
                        if(identity_code !== identityCert){
                            onFailAction("Chứng thư số tồn tại trong USB chưa đúng", () => {
                                props.history.push("/gen-cts-customer");
                            })
                        }else {
                            loading.runLoadingBlockUI();
                            const result = await GenCertServices.genCsrRenew(identity_code, pin, typeToken, keylength, serialToken, serialcert, cnName, '', district, province, 'VN');
                            if(result.Code === 100){
                                loading.runLoadingBlockUI();
                                await GenCertServices.saveCSR(type_user, object, secret_code,result.CKID, result.Base64CSR);
                                onSuccessAction("Kết nối USB Token thành công!");
                                setDisableBtConnect(true);
                                setStatusConnect(true);
                                setDisableField(true);
                                loading.stopRunLoading();
                            }
                            if(Number(result.Code) === 1003){
                                onFailAction("Mã pin không chính xác, vui lòng kiểm tra lại mã pin!", () =>
                                {
                                    submitPin()
                                });
                                loading.stopRunLoading();
                            }
                            if(Number(result.Code) === 1008){
                                onFailAction("Khởi tạo thất bại", () =>
                                {
                                    submitPin()
                                });
                                loading.stopRunLoading();
                            }
                            await setModalPin({...modalPin, 'visible_modal_pin': false });
                        }
                    }else {
                        loading.runLoadingBlockUI();
                        const result = await GenCertServices.genCsr(pin, keylength , typeToken, serialToken, identity_code, cnName, '', district, province, 'VN');
                        if(result.Code === 100){
                            loading.runLoadingBlockUI();
                            await GenCertServices.saveCSR(type_user, object,secret_code,result.CKID, result.Base64CSR);
                            onSuccessAction("Kết nối USB Token thành công!");
                            setDisableBtConnect(true);
                            setStatusConnect(true);
                            setDisableField(true);
                            loading.stopRunLoading();
                        }
                        if(Number(result.Code) === 1003){
                            onFailAction("Mã pin không chính xác, vui lòng kiểm tra lại mã pin!", () =>
                            {
                                submitPin()
                            });
                            loading.stopRunLoading();
                        }
                        if(Number(result.Code) === 1007){
                            onFailAction("Đã tồn tại chứng thư số trong USB Token ");
                            loading.stopRunLoading();
                        }
                        await setModalPin({...modalPin, 'visible_modal_pin': false });
                    }

                }
                if(Number(object) === 3){
                    loading.runLoadingBlockUI();
                    const serialData = await GenCertServices.getSerialCert(serialNumber);
                    const serialcert = serialData.data.serial;
                    const certInfo = await GenCertServices.getCertInfoBySerial(serialcert);
                    setDateEnd(certInfo.data.certificateEnd);
                    setSerialCertInfoCertificate(serialData.data.serial);
                    if(certInfo.data.customer_code !== uid || serialcert !== serialCertInfo){
                        onFailAction("Chứng thư số tồn tại trong USB chưa đúng", () => {
                            props.history.push("/gen-cts-customer");
                        })
                    }else {
                        loading.runLoadingBlockUI();
                        const result = await GenCertServices.genCsrRenew(identity_code, pin, typeToken, keylength, serialToken, serialcert, cnName, '', district, province, 'VN');
                        if(result.Code === 100){
                            loading.runLoadingBlockUI();
                            await GenCertServices.saveCSR(type_user, object, secret_code,result.CKID, result.Base64CSR);
                            onSuccessAction("Kết nối USB Token thành công!");
                            setDisableBtConnect(true);
                            setStatusConnect(true);
                            setDisableField(true);
                            loading.stopRunLoading();
                        }
                        if(Number(result.Code) === 1003){
                            onFailAction("Mã pin không chính xác, vui lòng kiểm tra lại mã pin!", () =>
                            {
                                submitPin()
                            });
                            loading.stopRunLoading();
                        }
                        await setModalPin({...modalPin, 'visible_modal_pin': false });
                    }
                }
            }else {
                onFailAction("Bạn chưa điền đủ thông tin!");
            }
        });
    };
    const onChangeDataPin = ({ target: { value } }) => {
        setModalPin({...modalPin, 'pin': value});
    };

    const submitPin = () => {
        setModalPin({...modalPin, 'visible_modal_pin': true });
    };
    const install = () => {
        const { validateFields } = props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                const type_user  = values.type_user;
                const object  = values.object;
                const identity_code = values.identity_code.trim();
                const secret_code = values.secret_code.trim();
                try {
                    loading.runLoadingBlockUI();
                    const data = await GenCertServices.genUSBToken(type_user,object, secret_code, serialNumber, dateEnd, typeTokenGenBase64);
                    const certificateBase64 = data.certificateBase64;
                    const keyLength = props.form.getFieldValue("length_key");
                    const issuerDN = '';
                    if (Number(data && data.status) === 200) {
                    loading.runLoadingBlockUI();
                    const install = await GenCertServices.installCert(pin, typeToken, serialNumber, certificateBase64);
                    const serialCert = install.CertSerialNumber;
                    const subjectDN = install.SubjectDN;
                    const dateFrom = install.CertStart;
                    const dateTo = install.CertEnd;
                    setcertSerial(serialCert);
                    if(Number(install.Code) === 100){
                        props.form.setFieldsValue({
                            statusResult: install.Message,
                            customer_idResult: identity_code,
                            subjectDNResult: install.SubjectDN,
                            certificateSerialResult: install.CertSerialNumber,
                            certificateBeginResult: install.CertStart,
                            certificateEndResult : install.CertEnd,
                        });
                        const saveInfoCertificate = await GenCertServices.saveInfoCertificate(object, type_user, secret_code, serialNumber, certificateBase64, keyLength, subjectDN, issuerDN, dateFrom, dateTo, serialCert);
                        if(Number(saveInfoCertificate.status) === 200){
                            setDisableBtInstall(true)
                            setStatusGen(true);
                            if(Number(object) === 1 || Number(object) === 4){
                                if(!sttFile02){
                                    await GenCertServices.saveDocument(7,object, type_user, secret_code, serialCert);
                                }
                            }
                            if(Number(object) === 2){
                                if(!sttFile02){
                                    await GenCertServices.saveDocument(7,object, type_user, secret_code, serialCert);
                                }
                                if (Number(tokenOldNew) === 1){
                                    await GenCertServices.deleteCertExtend(serialCertInfoCertificate);
                                }
                                await GenCertServices.deleteCertInfo(serialCertInfoCertificate);
                            }
                            if(Number(object) === 3){
                                await GenCertServices.deleteCertInfo(serialCertInfoCertificate);
                                if(Number(type_user) === 1 && Number(typeChange) === 1){
                                    await GenCertServices.saveDocument(12,object, type_user, secret_code, serialCert);
                                }
                                if(Number(type_user) === 2 && Number(typeChange) === 1){
                                    await GenCertServices.saveDocument(13,object, type_user, secret_code, serialCert);
                                }
                            }
                            onSuccessAction("Gen chứng thư số thành công");
                        }else {
                            onFailAction("Có lỗi xảy ra trong quá trình lưu thông tin chứng thư số");
                        }
                    }else {
                        onFailAction("Có lỗi xảy ra trong quá trình cài đặt !");
                    }

                }else {
                    loading.stopRunLoading();
                    onFailAction("Có lỗi xảy ra trong quá trình cài đặt !");
                }
                } catch (error) {
                    onFailAction("Có lỗi xảy ra khi lưu !");
                } finally {
                    loading.stopRunLoading();
                }
            }else {
                onFailAction("Bạn chưa điền đủ thông tin!");
            }
        });
    };

    const onSignFile = () => {
        const { validateFields } = props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                const type_user  = values.type_user;
                const object  = values.object;
                const secret_code = values.secret_code.trim();
                try {
                    setVisibleModal(true);
                    setLoadingModal(true);
                    const data = await GenCertServices.getFileToSign(object, type_user, secret_code);
                    setSttSignFile(data.sttSign);
                    setFile(data.base64);
                } catch (error) {
                    onFailAction("Có lỗi xảy ra khi xem file!");
                    setVisibleModal(false);
                } finally {
                    setLoadingModal(false);
                }
            }else {
                onFailAction("Bạn chưa điền đủ thông tin!");
            }
        });
    };
    const dataSign = {
        "fieldName":"SignatureB [002]",
        "signDate":null,
        "TypeSign":"1",
        "page": "4",
        "px": "86",
        "py": "61",
        "pw": "180",
        "ph": "10"
    };
    const onOkModal = () => {
        setVisibleModal(false);
        const { validateFields } = props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                const type_user  = values.type_user;
                const object  = values.object;
                const identity_code = values.identity_code.trim();
                const secret_code = values.secret_code.trim();
                try {
                    let allDataSign = {...dataSign, "certSerial":certSerial, "fileData":file};
                    onSign(allDataSign, object, secret_code, type_user, identity_code);
                } catch (error) {
                    onFailAction("Có lỗi xảy ra khi xem file!");
                } finally {
                }
            }else {
                onFailAction("Bạn chưa điền đủ thông tin!");
            }
        });
    };
    const onCancelModal = () => {
        window.location.reload();
    };
    const onSign = (allDataSign, type_gen, secret_code, type_user, identity_code) => {
        axios.post(`http://localhost:6706/api/sign/signpdf`, allDataSign)
            .then((response) => {
                const data = response.data;
                if (!data.FileDataSigned) {
                    onFailAction('Có lỗi xảy ra trong quá trình ký!');
                    return ;
                }
                updateSignedContract({...data, "type_gen": type_gen, "type_user":type_user, "secret_code": secret_code, "identity_code": identity_code});
            })
            .catch((error) => {
                onFailAction(error);
            });
    };
    const updateSignedContract = async (data) => {
        const result = await GenCertServices.updateSignFile(data);
        if (result && result.status === 200){
            onSuccessAction("Ký thành công!");
            setStatusSign(true);
            setDisableBtSign(true);
        } else {
            onFailAction("Có lỗi xảy ra !");
        }
    };
    const onPreviewFileSigned = async () => {
        const {validateFields} = props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                const type_user  = values.type_user;
                const object  = values.object;
                try {
                    setVisibleModal(true);
                    setLoadingModal(true);
                    const data = await GenCertServices.getRequestDocCus(idRequest, object, type_user);
                    setFileSigned(data.base64);
                } catch (error) {
                    onFailAction("Có lỗi xảy ra khi xem trước file!");
                    setVisibleModal(false);
                } finally {
                    setLoadingModal(false);
                }
            }else {
                onFailAction("Bạn chưa điền đủ thông tin!");
            }
        });
    };
    const onOkModalSigned = () => {
        setVisibleModal(false);
        window.location.reload()
    };

    const dowloadPlugin = async () =>{
        try{
            const link = `${process.env.REACT_APP_BASE_API_URL}gen-cts-customer/get-file-plugin`;
            window.open(link);
        }catch (error){
            onFailAction("Có lỗi xảy ra!");
        }
    };

    return(
        <div>
            <nav className="navbar navbar-light bg-light">
                <div className="row">
                    <div className="col-md-5">
                        <a className="navbar-brand" href="/#">
                            <img src="/images/logo.jpg" width="20%" alt="logo"/>
                        </a>
                    </div>
                </div>
            </nav>
            <div className="col-md-12 text-center mt-3">
                <Form>
                    <ModalEnterPin
                        visible={modalPin.visible_modal_pin}
                        handleCancel={handleModalConnectCancel}
                        handleDeny={confirmPin}
                        value={modalPin.pin}
                        onChange={onChangeDataPin}
                        error={modalPin.error_pin}
                    />
                    <Card className="m-r-15-i m-l-15-i mx-auto nopadding-top" title={<label>Thông tin yêu cầu Gen Cert</label>} size="small">
                        <div>

                        </div>
                        <div className="input-group gen-backgroud mx-auto">
                            <div className="input-group mx-auto">

                                <div className="input-group col-md-12">
                                    <label className="col-md-4 fname2">Loại người dùng:<span className="text-danger ml-1">*</span></label>
                                    <SelectWithLabel
                                        options={{1: "Tổ chức", 2: "Cá nhân"}}
                                        name="type_user"
                                        wrappedClass="col-md-6 col-xs-12"
                                        form={props.form}
                                        label=""
                                        isRequired={true}
                                        isDisabled={disableField}
                                        error={"Loại người dùng không được bỏ trống"}
                                        onChange={onChangeTypeUser}
                                    />
                                        <div className={"col-md-2"}>
                                        <p>Tải plugin
                                        <a href ="#/" className="pointer text-primary col-md-2 col-xs-12" style={{float: "right"}} title="Tải xuống plugin" onClick={() => dowloadPlugin()}>
                                            <i className=" fa fa-download fa-lg"></i>
                                        </a>
                                        </p>
                                    </div>
                                </div>
                                <div className="input-group col-md-12">
                                    <label className="col-md-4 fname2">Loại gen cert:<span className="text-danger ml-1">*</span></label>
                                    <SelectWithLabel
                                        options={{1: "Cấp mới", 2: "Gia hạn", 3: "Thay đổi thông tin", 4: "Chuyển đổi"}}
                                        name="object"
                                        wrappedClass="col-md-6 col-xs-12"
                                        form={props.form}
                                        label=""
                                        isDisabled={disableField}
                                        isRequired={true}
                                        error={"Loại gen cert không được bỏ trống"}
                                    />
                                </div>
                                <div className="input-group col-md-12">
                                    <label className="col-md-4 fname2">Mã định danh:<span className="text-danger ml-1">*</span></label>
                                    <InputWithoutLabel
                                        form={props.form}
                                        name="identity_code"
                                        wrapClass="col-md-6 col-xs-12"
                                        maxLength={255}
                                        isRequired={true}
                                        isDisabled={disableField}
                                        label={""}
                                        error={"Mã định danh không được bỏ trống"}
                                    />
                                </div>
                                <div className="input-group col-md-12">
                                    <label className="col-md-4 fname2">Mã bảo mật:<span className="text-danger ml-1">*</span></label>
                                    <InputWithoutLabel
                                        form={props.form}
                                        name="secret_code"
                                        isDisabled={disableField}
                                        wrapClass="col-md-6 col-xs-12"
                                        maxLength={255}
                                        isRequired={true}
                                        label={""}
                                        error={"Mã bảo mật không được bỏ trống"}
                                        onBlur={onChangeSecret}
                                    />
                                </div>
                                <div className="input-group col-md-12">
                                    <label className="col-md-4 fname2">Độ dài khóa:<span className="text-danger ml-1">*</span></label>
                                    <InputWithLabel
                                        form={props.form}
                                        label=""
                                        name="length_key"
                                        wrapClass="col-md-6 col-xs-12"
                                        isDisabled={true}
                                        defaultValue={packageName}
                                    />

                                </div>
                                <div className="input-group col-md-12">
                                    <label className="col-md-4 fname2">Tên gói dịch vụ:<span className="text-danger ml-1">*</span></label>
                                    <InputWithLabel
                                        form={props.form}
                                        label=""
                                        name="package_name"
                                        wrapClass="col-md-6 col-xs-12"
                                        isDisabled={true}
                                        defaultValue={packageName}
                                    />
                                    <InputWithLabel
                                        form={props.form}
                                        label=""
                                        name="package_id"
                                        wrapClass="col-md"
                                        hidden={true}
                                        defaultValue={packageID}
                                    />
                                </div>
                            </div>
                            <div className="input-group button-result2">
                                <div className="" hidden={statusSign ? true : false} >
                                    <ButtonOnSave
                                        onClick={() => {
                                            checkUSBToken();
                                        }}
                                        label="Kết nối Token"
                                        className={"btn btn-primary btn-sm"}
                                        isDisabled={disableBtConnect}
                                    />
                                </div>
                                {statusConnect  ? (
                                    <div className="" hidden={statusSign ? true : false}>
                                        {""}
                                        <ButtonOnSave
                                            onClick={() => {
                                                install();
                                            }}
                                            label="Cài đặt"
                                            className={"btn btn-success btn-sm"}
                                            isDisabled={disableBtInstall}
                                        />{""}
                                    </div>
                                ) : (
                                    ""
                                )}
                                {statusGen && Number(props.form.getFieldValue("object")) === 1  && sttFile02 ? (
                                    <div className="">
                                        <ButtonOut
                                            onClick={() => {
                                                window.location.reload();
                                                }}
                                            className={"btn btn-secondary btn-sm"}
                                        />
                                        </div>
                                ): ("")}
                                {statusGen && Number(props.form.getFieldValue("object")) === 4  && sttFile02 ? (
                                    <div className="">
                                        <ButtonOut
                                            onClick={() => {
                                                window.location.reload();
                                                }}
                                            className={"btn btn-secondary btn-sm"}
                                        />
                                        </div>
                                ): ("")}
                                {statusGen && Number(props.form.getFieldValue("object")) === 2  && sttFile02 ? (
                                    <div className="">
                                        <ButtonOut
                                            onClick={() => {
                                                window.location.reload();
                                                }}
                                            className={"btn btn-secondary btn-sm"}
                                        />
                                        </div>
                                ): ("")}

                                {statusGen && Number(props.form.getFieldValue("object")) === 1 && !sttFile02 ?(
                                    <div className="" hidden={statusSign ? true : false}>
                                        <ButtonOnSave
                                            onClick={() => {
                                                onSignFile();
                                            }}
                                            label="Ký mẫu DK-02"
                                            className={"btn btn-success btn-sm"}
                                            isDisabled={disableBtSign}
                                        />
                                        <SignModal
                                            visible={visibleModal}
                                            loading={loadingModal}
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
                                        </SignModal>

                                    </div>
                                ): ("")}
                                {statusGen && Number(props.form.getFieldValue("object")) === 4 && !sttFile02 ?(
                                    <div className="" hidden={statusSign ? true : false}>
                                        <ButtonOnSave
                                            onClick={() => {
                                                onSignFile();
                                            }}
                                            label="Ký mẫu DK-02"
                                            className={"btn btn-success btn-sm"}
                                            isDisabled={disableBtSign}
                                        />
                                        <SignModal
                                            visible={visibleModal}
                                            loading={loadingModal}
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
                                        </SignModal>

                                    </div>
                                ): ("")}
                                {statusGen && Number(props.form.getFieldValue("object")) === 2 && !sttFile02 ?(
                                    <div className="" hidden={statusSign ? true : false}>
                                        <ButtonOnSave
                                            onClick={() => {
                                                onSignFile();
                                            }}
                                            label="Ký mẫu DK-02"
                                            className={"btn btn-success btn-sm"}
                                            isDisabled={disableBtSign}
                                        />
                                        <SignModal
                                            visible={visibleModal}
                                            loading={loadingModal}
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
                                        </SignModal>

                                    </div>
                                ): ("")}
                                {statusGen && Number(typeChange) === 2 && Number(props.form.getFieldValue("object")) === 3 ?(
                                    <div className="">
                                        <ButtonOut
                                            onClick={() => {
                                                window.location.reload();
                                            }}
                                            className={"btn btn-secondary btn-sm"}
                                        />
                                    </div>
                                ): ("")}
                                {statusGen && Number(typeChange) === 1 && Number(props.form.getFieldValue("type_user")) === 1 && Number(props.form.getFieldValue("object")) === 3?(
                                    <div className="" hidden={statusSign ? true : false}>
                                        <ButtonOnSave
                                            onClick={() => {
                                                onSignFile();
                                            }}
                                            label="Ký mẫu DC-01.01"
                                            className={"btn btn-success btn-sm"}
                                            isDisabled={disableBtSign}
                                        />
                                        {Number(sttSignFile) === 2 ?(
                                            <SignModal
                                                visible={visibleModal}
                                                loading={loadingModal}
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
                                            </SignModal>
                                        ):(
                                            <SignModal
                                                visible={visibleModal}
                                                loading={loadingModal}
                                                className="w-75 h-75"
                                                bodyStyle={{ height: "700px" }}
                                                style={{ top: "20px" }}
                                                onClickCancel={onCancelModal}
                                            >
                                                <iframe
                                                    title="Quản lý hợp đồng"
                                                    src={`data:application/pdf;base64,${file}`}
                                                    height="100%"
                                                    width="100%"
                                                ></iframe>
                                            </SignModal>
                                        )}


                                    </div>
                                ): ("")}
                                {statusGen && Number(typeChange) === 1 && Number(props.form.getFieldValue("type_user")) === 2 && Number(props.form.getFieldValue("object")) === 3?(
                                    <div className="" hidden={statusSign ? true : false}>
                                        <ButtonOnSave
                                            onClick={() => {
                                                onSignFile();
                                            }}
                                            label="Ký mẫu DC-01.02"
                                            className={"btn btn-success btn-sm"}
                                            isDisabled={disableBtSign}
                                        />
                                        {Number(sttSignFile) === 2 ?(
                                            <SignModal
                                                visible={visibleModal}
                                                loading={loadingModal}
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
                                            </SignModal>
                                        ):(
                                            <SignModal
                                                visible={visibleModal}
                                                loading={loadingModal}
                                                className="w-75 h-75"
                                                bodyStyle={{ height: "700px" }}
                                                style={{ top: "20px" }}
                                                onClickCancel={onCancelModal}
                                            >
                                                <iframe
                                                    title="Quản lý hợp đồng"
                                                    src={`data:application/pdf;base64,${file}`}
                                                    height="100%"
                                                    width="100%"
                                                ></iframe>
                                            </SignModal>
                                            )}

                                    </div>
                                ): ("")}
                                {statusSign? (
                                    <div className="">
                                        <button onClick={onPreviewFileSigned} className="btn btn-primary btn-sm form-control">
                                            File đã ký
                                        </button>
                                        <AntModal
                                            visible={visibleModal}
                                            loading={loadingModal}
                                            className="w-75 h-75"
                                            bodyStyle={{height: "700px"}}
                                            style={{top: "20px"}}
                                            onCLickOk={onOkModalSigned}
                                        >
                                            <iframe
                                                title="Quản lý hợp đồng"
                                                src={`data:application/pdf;base64,${fileSigned}`}
                                                height="100%"
                                                width="100%"
                                            />
                                        </AntModal>

                                    </div>
                                ) : ("")}

                            </div>
                            <fieldset className="fieldset2">
                                <legend className="legend2">Kết quả</legend>
                                <div className="row-result2">
                                    <label className="col-md-3 fname2">Trạng thái:</label>
                                    <InputWithLabel
                                        wrapClass={"col-md result-data"}
                                        name={"statusResult"}
                                        label={""}
                                        form={props.form}
                                        readonly={true}
                                    />
                                </div>
                                <div className="row-result2">
                                    <label className="col-md-3 fname2">Định danh:</label>
                                    <InputWithLabel
                                        wrapClass={"col-md result-data"}
                                        name={"customer_idResult"}
                                        label={""}
                                        form={props.form}
                                        readonly={true}
                                    />
                                </div>
                                <div className="row-result2">
                                    <label className="col-md-3 fname2">Subject DN:</label>
                                    <TextAreaWithLabel
                                        wrapClass={"col-md result-data"}
                                        name={"subjectDNResult"}
                                        label={""}
                                        form={props.form}
                                        readonly={true}
                                        rows={2}
                                    />
                                </div>
                                <div className="row-result2">
                                    <label className="col-md-3 fname2">Serial CTS:</label>
                                    <InputWithLabel
                                        wrapClass={"col-md result-data"}
                                        name={"certificateSerialResult"}
                                        label={""}
                                        form={props.form}
                                        readonly={true}
                                    />
                                </div>
                                <div className="row-result2">
                                    <label className="col-md-3 fname2">Hiệu lực từ:</label>
                                    <InputWithLabel
                                        wrapClass={"col-md result-data"}
                                        name={"certificateBeginResult"}
                                        label={""}
                                        form={props.form}
                                        readonly={true}
                                    />
                                </div>
                                <div className="row-result2">
                                    <label className="col-md-3 fname2">Đến:</label>
                                    <InputWithLabel
                                        wrapClass={"col-md result-data"}
                                        name={"certificateEndResult"}
                                        label={""}
                                        form={props.form}
                                        readonly={true}
                                    />
                                </div>
                            </fieldset>
                        </div>

                    </Card>
                </Form>
            </div>
        </div>
    );
};
const WrappedGenPage = Form.create<Props>({
    name: "GenPage"
})(GenPage);

export default WrappedGenPage;