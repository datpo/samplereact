import React, { useEffect, useState } from "react";
import {Card, Form} from "antd";
import { FormComponentProps } from "antd/lib/form";
import InputWithLabel from "components/common/form/input-with-label/InputWithLabel";
import SelectWithLabel from "components/common/form/input-with-label/SelectWithLabel";
import {onFailAction} from "helpers/SwalCommon";
import { match } from "react-router";
import {GenCertServices} from "../../../services/gen-cert/GenCertServices";
import PageWrapper from "../../wrapper/PageWrapper";
import AntModal from "../../../components/common/modal/AntModal";
import ButtonOut from "../../../components/common/form/button/ButtonOut";
import {loading} from "../../../components/common/loading/Loading";
import {TextAreaWithLabel} from "../../../components/common/form/input-with-label/TextAreaWithLabel";
interface Props extends FormComponentProps {
    match: match<{ id: string }>;
    user: any;
    history: any;
}
export const PreviewInfoCert: React.FC<Props> = props => {
    const id = props.match.params.id;
    const [visibleModal, setVisibleModal] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);

    const [fileSigned, setFileSigned] = useState("");
    const [typeGen, setTypeGen] = useState(0);
    const [typeUser, setTypeUser] = useState(0);
    const [ownerId, setOwnerId] = useState(0);
    const [typeChange, setTypeChange] = useState(0);



    const fetchDataCert = async () => {
        loading.runLoadingBlockUI();
        const infoCert = await GenCertServices.previewInfoCert(id);
        setTypeGen(infoCert.data.object);
        setTypeUser(infoCert.data.customer_type);
        setOwnerId(infoCert.data.request_id);

        props.form.setFieldsValue({
            statusResult: "Success",
            subjectDNResult: infoCert.data.subjectDN,
            certificateSerialResult: infoCert.data.certificateSerial,
            certificateBeginResult: infoCert.data.certificateBegin,
            certificateEndResult: infoCert.data.certificateEnd,
            length_key: infoCert.data.keyLength,
        });
        if(Number(infoCert.data.object) === 1 || Number(infoCert.data.object) === 2 || Number(infoCert.data.object) === 4){
            if(Number(infoCert.data.customer_type) === 1){
                props.form.setFieldsValue({
                    identity_code: infoCert.data.requestcertificate.organization.code,
                    customer_idResult: infoCert.data.requestcertificate.organization.code,
                });
            }else{
                props.form.setFieldsValue({
                    identity_code: infoCert.data.requestcertificate.requestpersonal.passport,
                    customer_idResult: infoCert.data.requestcertificate.requestpersonal.passport,
                });
            }
            props.form.setFieldsValue({
                package_name: infoCert.data.requestcertificate.cateservicespackage.name,
                type_user: infoCert.data.customer_type.toString(),
                secret_code: infoCert.data.requestcertificate.secret_code,
                object: infoCert.data.object.toString(),
            });
        }
        if(Number(infoCert.data.object) === 3){
            setTypeChange(infoCert.data.request_change_info.type_change);
            if(Number(infoCert.data.customer_type) === 1){
                props.form.setFieldsValue({
                    package_name: infoCert.data.request_change_info.cert_change_organ.request.cateservicespackage.name,
                    secret_code: infoCert.data.request_change_info.cert_change_organ.secret_code,
                });
            }else {
                props.form.setFieldsValue({
                    package_name: infoCert.data.request_change_info.cert_change_per.request.cateservicespackage.name,
                    secret_code: infoCert.data.request_change_info.cert_change_per.secret_code,
                });
            }
            props.form.setFieldsValue({
                identity_code: infoCert.data.request_change_info.code,
                customer_idResult: infoCert.data.request_change_info.code,
                type_user: infoCert.data.customer_type.toString(),
                object: infoCert.data.object.toString(),
            });
        }
        loading.stopRunLoading();
    };
    useEffect(() => {
        fetchDataCert();
        // eslint-disable-next-line
    }, []);

    const onPreviewFileSigned = async () => {
        const {validateFields} = props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                try {
                    setVisibleModal(true);
                    setLoadingModal(true);
                    const data = await GenCertServices.getRequestDoc(ownerId, typeGen, typeUser);
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
    };


    return (

        <PageWrapper title="Thông tin chứng thư số">
            <Form>
                <Card className="m-r-15-i m-l-15-i" title={<label>Thông tin yêu cầu Gen Cert</label>} size="small">
                    <div className="input-group gen-backgroud">
                        <div className="input-group col-md-12">
                            <SelectWithLabel
                                options={{1: "Tổ chức", 2: "Cá nhân"}}
                                name="type_user"
                                wrappedClass="col-md-6 col-xs-12"
                                form={props.form}
                                label="Loại người dùng"
                                isRequired={true}
                                isDisabled={true}
                            />
                            <SelectWithLabel
                                options={{1: "Cấp mới", 2: "Gia hạn", 3: "Thay đổi thông tin", 4: "Chuyển đổi"}}
                                name="object"
                                wrappedClass="col-md-6 col-xs-12"
                                form={props.form}
                                label="Loại gen cert"
                                isRequired={true}
                                isDisabled={true}
                            />
                        </div>
                        <div className="input-group col-md-12 ">
                            <InputWithLabel
                                form={props.form}
                                label="Mã định danh"
                                name="identity_code"
                                isRequired={true}
                                wrapClass="col-md-6 col-xs-12"
                                maxLength={255}
                                isDisabled={true}
                            />
                            <InputWithLabel
                                form={props.form}
                                label="Mã bảo mật"
                                name="secret_code"
                                isRequired={true}
                                wrapClass="col-md-6 col-xs-12"
                                maxLength={255}
                                isDisabled={true}
                            />
                        </div>
                        <div className="input-group col-md-12 ">
                            <InputWithLabel
                                form={props.form}
                                label="Độ dài khóa"
                                name="length_key"
                                wrapClass="col-md-6 col-xs-12"
                                isDisabled={true}
                                isRequired={true}
                            />
                            <InputWithLabel
                                form={props.form}
                                label="Gói dịch vụ"
                                name="package_name"
                                wrapClass="col-md-6 col-xs-12"
                                isDisabled={true}
                                isRequired={true}
                            />
                        </div>
                        <div className="input-group button-result">
                            {Number(typeChange) === 2 ? (""):(
                                <div className="">
                                    <button onClick={onPreviewFileSigned} className="btn btn-primary btn-sm form-control">
                                        Xem file
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
                            )}
                        </div>
                        <fieldset className="fieldset1">
                            <legend className="legend1">Kết quả</legend>
                            <div className="row-result">
                                <label className="fname">Trạng thái:</label>
                                <InputWithLabel
                                    wrapClass={"col-md result-data"}
                                    name={"statusResult"}
                                    label={""}
                                    form={props.form}
                                    readonly={true}
                                />
                            </div>
                            <div className="row-result">
                                <label className="fname">Định danh:</label>
                                <InputWithLabel
                                    wrapClass={"col-md result-data"}
                                    name={"customer_idResult"}
                                    label={""}
                                    form={props.form}
                                    readonly={true}
                                />
                            </div>
                            <div className="row-result">
                                <label className="fname">Subject DN:</label>
                                <TextAreaWithLabel
                                    wrapClass={"col-md result-data"}
                                    name={"subjectDNResult"}
                                    label={""}
                                    form={props.form}
                                    readonly={true}
                                    rows={2}
                                />
                            </div>
                            <div className="row-result">
                                <label className="fname">Serial CTS:</label>
                                <InputWithLabel
                                    wrapClass={"col-md result-data"}
                                    name={"certificateSerialResult"}
                                    label={""}
                                    form={props.form}
                                    readonly={true}
                                />
                            </div>
                            <div className="row-result">
                                <label className="fname">Hiệu lực từ:</label>
                                <InputWithLabel
                                    wrapClass={"col-md result-data"}
                                    name={"certificateBeginResult"}
                                    label={""}
                                    form={props.form}
                                    readonly={true}
                                />
                            </div>
                            <div className="row-result">
                                <label className="fname">Đến:</label>
                                <InputWithLabel
                                    wrapClass={"col-md result-data"}
                                    name={"certificateEndResult"}
                                    label={""}
                                    form={props.form}
                                    readonly={true}

                                />
                            </div>
                        </fieldset>
                        <div className="input-group button-result">
                            <div className="">
                                <ButtonOut
                                    onClick={() => {
                                        props.history.push("/info-certificate");

                                    }}
                                    className={"btn btn-default btn-sm"}
                                />
                            </div>

                        </div>

                    </div>

                </Card>


            </Form>

        </PageWrapper>
    );
};

const WrappedPreviewCTS = Form.create<Props>({
    name: "PreviewInfoCert"
})(PreviewInfoCert);

export default WrappedPreviewCTS;
