import React, { useEffect, useState } from "react";
import PageWrapper from "../wrapper/PageWrapper";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import SelectWithLabel from "components/common/form/input-with-label/SelectWithLabel";
import RadioWithLabel from "components/common/form/input-with-label/RadioWithLabel";
import { TextAreaWithLabel } from "components/common/form/input-with-label/TextAreaWithLabel";
import ButtonOnSave from "components/common/form/button/ButtonOnSave";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import { loading } from "components/common/loading/Loading";
import _ from "lodash";
import { onSuccessAction, onFailAction } from "helpers/SwalCommon";
import {UserServices} from "../../services/user/UserServies";
import TableTransfer from "../../components/common/table/Table-transfer";
import {TransferBusinessEmployeeServices} from "../../services/transfer-business-employee/TransferBusinessEmployeeServices";

interface Props extends FormComponentProps {
    user: any;
    history: any;
}
const TransferBusinessEmployeeCreate: React.FC<Props> = props => {
    const [businessEmployeeTransfer, setBusinessEmployeeTransfer] = useState({});
    const [businessEmployeeReceive, setBusinessEmployeeReceive] = useState({});
    const [data, setData] = useState({});

    const fetchBusinessEmployee = async () => {
        const userService = new UserServices();
        const list = await userService.getUserByType(5);
        setBusinessEmployeeReceive(list.data);
        setBusinessEmployeeTransfer(list.data)
    };

    const storeTransfer  = async () =>{
        const { validateFields } = props.form;
        validateFields(async (errors, values) => {
            if (!errors) {
                try {
                    loading.runLoadingBlockUI();
                    const data = await TransferBusinessEmployeeServices.store({ ...values });
                    if (data && Number(data.status) === 422) {
                        _.forOwn(data.error, function(errors, key) {
                            props.form.setFields({
                                [key]: {
                                    errors: [new Error(errors.toString())]
                                }
                            });
                        });
                    } else if (data && Number(data.status) === 200) {
                        onSuccessAction("Yêu cầu chuyển người quản lý thành công!", () => {
                            props.history.push("/yeu-cau-chuyen-nguoi-quan-ly/");
                        });
                    }
                } catch (error) {
                    onFailAction("Có lỗi xảy ra khi yêu cầu chuyển!");
                } finally {
                    loading.stopRunLoading();
                }
            }else {
                onFailAction("Bạn chưa điền đủ thông tin!");
            }
        });
    };

    useEffect(() => {
        fetchBusinessEmployee();
        // eslint-disable-next-line
    }, []);

    const renderActionSelect = (text, record, index) => {
        return (

            <SelectWithLabel
                options={businessEmployeeReceive}
                name={"nvkd_tiep_nhan_simple_" + record.id + "_"+ record.type}
                wrappedClass="select-receive"
                form={props.form}
                placeholder="Chọn nhân viên kinh doanh tiếp nhận"
                label=""
                rules={[
                    {
                        validator: function(rule, value, callback) {
                            if (value && value ===  props.form.getFieldValue('nvkd_chuyen_id')) {
                                callback("NVKD tiếp nhận phải khác NVKD chuyển.");
                            } else {
                                callback();
                            }
                        },
                        message: "NVKD tiếp nhận phải khác NVKD chuyển."
                    }
                ]}
            />
        );
    };


    const columns = [
        { title: "Loại",
            dataIndex: "",
            render: (e) => {
                if (e) {
                    if(Number(e.type) === 1){
                        return <p>Đại Lý</p>;
                    }else{
                        return <p>Cộng tác viên</p>;
                    }
                }
            }
        },
        {
            title: 'Mã số thuế/Chứng minh thư',
            dataIndex: "code"
        },
        {
            title: "Tên đại lý/Cộng tác viên",
            dataIndex: "fullname"},
        {
            title: "NVKD tiếp nhận",
            render: renderActionSelect,
        },
    ];

    const onChange = async value => {
        const userService = new UserServices();
        const data = await userService.getUserByBusinessEmployee(value);
        setData(data)
        return data;
    };
    return (
        <PageWrapper title="Yêu cầu thay đổi người quản lý">
            <Form>
                <div className="input-group">
                    <SelectWithLabel
                        options={businessEmployeeTransfer}
                        name="nvkd_chuyen_id"
                        wrappedClass="col-md-4"
                        form={props.form}
                        placeholder="Chọn nhân viên kinh doanh chuyển"
                        label="Nhân viên kinh doanh chuyển"
                        isRequired={true}
                        onChange={onChange}
                    />
                    <RadioWithLabel
                        options={{ 1: "Chuyển tất cả", 2: "Chuyển đơn lẻ" }}
                        label="Hình thức chuyển"
                        name="hinh_thuc_chuyen"
                        wrappedClass="col-md-3"
                        form={props.form}
                        isRequired={true}
                    />
                    {props.form.getFieldValue("hinh_thuc_chuyen") === "1" ? (
                        <React.Fragment>
                            <SelectWithLabel
                                options={businessEmployeeReceive}
                                name="nvkd_tiep_nhan_id"
                                wrappedClass="col-md-4"
                                form={props.form}
                                placeholder="Chọn nhân viên kinh doanh tiếp nhận"
                                label="Nhân viên kinh doanh tiếp nhận"
                                isRequired={true}
                                rules={[
                                    {
                                        validator: function(rule, value, callback) {
                                            if (value && value === props.form.getFieldValue('nvkd_chuyen_id')) {
                                                callback("NVKD tiếp nhận phải khác NVKD chuyển.");
                                            } else {
                                                callback();
                                            }
                                        },
                                        message: "NVKD tiếp nhận phải khác NVKD chuyển."
                                    }
                                ]}
                            />
                        </React.Fragment>
                    ) : (
                        ""
                    )}
                </div>
                <div className="input-group">
                    {props.form.getFieldValue("hinh_thuc_chuyen") === "2" ? (
                        <React.Fragment>
                            <TableTransfer columns={columns} data={data} />
                        </React.Fragment>
                    ) : (
                        ""
                    )}



                </div>
                <div className="input-group">
                    <RadioWithLabel
                        options={{ 1: "Có", 2: "Không" }}
                        label="Yêu cầu khóa tài khoản NVKD chuyển"
                        name="is_lock_account"
                        wrappedClass="col-md-3"
                        form={props.form}
                        isRequired={true}
                    />
                </div>
                <div className="input-group">
                    <TextAreaWithLabel
                        form={props.form}
                        label="Ghi chú"
                        name="note"
                        wrapClass="col-md"
                        rows={4}
                    />
                </div>
            </Form>

            <div className="input-group d-flex justify-content-center p-5">
                <div className="">
                    <ButtonOnSave
                        onClick={() => {
                            storeTransfer();
                        }}
                        label="Xác nhận chuyển"
                        className={"btn btn-success btn-sm"}
                    />
                </div>

                <div className="">
                    <ButtonCancel
                        onClick={() => {
                            props.history.push("/yeu-cau-chuyen-nguoi-quan-ly");
                        }}
                        className={"btn btn-default btn-sm"}
                    />
                </div>
            </div>
        </PageWrapper>
    );
};

const WrappedTransferBusinessEmployeeCreate = Form.create<Props>({
    name: "TransferBusinessEmployeeCreate"
})(TransferBusinessEmployeeCreate);

export default WrappedTransferBusinessEmployeeCreate;
