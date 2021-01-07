import React, { useEffect, useState } from "react";
import PageWrapper from "../wrapper/PageWrapper";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import SelectWithLabel from "components/common/form/input-with-label/SelectWithLabel";
import RadioWithLabel from "components/common/form/input-with-label/RadioWithLabel";
import { TextAreaWithLabel } from "components/common/form/input-with-label/TextAreaWithLabel";
import ButtonCancel from "components/common/form/button/ButtonCancel";
import {UserServices} from "../../services/user/UserServies";
import TableTransfer from "../../components/common/table/Table-transfer";
import { match } from "react-router";
import {TransferBusinessEmployeeServices} from "../../services/transfer-business-employee/TransferBusinessEmployeeServices";

interface Props extends FormComponentProps {
    user: any;
    history: any;
    match: match<{ id: string }>;
}
const TransferBusinessEmployeePreview: React.FC<Props> = props => {

    const id = props.match.params.id;

    const [businessEmployeeTransfer, setBusinessEmployeeTransfer] = useState({});
    const [businessEmployeeReceive, setBusinessEmployeeReceive] = useState({});
    const [data, setData] = useState({});

    const fetchTransfer = async () => {
        const transferData = await TransferBusinessEmployeeServices.previewTransfer(id);
        const list = await TransferBusinessEmployeeServices.listOwnerChanged(id);
        setData(list)
        if(transferData.data.hinh_thuc_chuyen === 1){
            props.form.setFieldsValue({
                nvkd_tiep_nhan_id: transferData.data.nvkd_tiep_nhan_id.toString(),
            });
        }
        props.form.setFieldsValue({
            nvkd_chuyen_id: transferData.data.nvkd_chuyen_id.toString(),
            hinh_thuc_chuyen: transferData.data.hinh_thuc_chuyen.toString(),
            is_lock_account: transferData.data.is_lock_account.toString(),
            note: transferData.data.note,
        });
    };


    const fetchBusinessEmployee = async () => {
        const userService = new UserServices();
        const list = await userService.getUserByType(5);
        setBusinessEmployeeReceive(list.data);
        setBusinessEmployeeTransfer(list.data)
    };

    useEffect(() => {
        fetchBusinessEmployee();
        fetchTransfer();
        // eslint-disable-next-line
    }, []);


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
            dataIndex: '',
            render: (e) => {
                if (e) {
                    if(Number(e.belong_to) === 1){
                        return <p>{e.owner.tax_code}</p>;
                    }else{
                        return <p>{e.owner.passport}</p>;
                    }
                }
            }
        },
        {
            title: "Tên đại lý/Cộng tác viên",
            dataIndex: "owner.fullname"
        },
        {
            title: "NVKD tiếp nhận",
            dataIndex: "userreceive.fullname",
        },
    ];



    return (
        <PageWrapper title="Chi tiết yêu cầu thay đổi người quản lý">
            <Form>
                <div className="input-group">
                    <SelectWithLabel
                        options={businessEmployeeTransfer}
                        name="nvkd_chuyen_id"
                        wrappedClass="col-md-4"
                        form={props.form}
                        placeholder="Chọn nhân viên kinh doanh chuyển"
                        label="Nhân viên kinh doanh chuyển"
                        isDisabled={true}
                    />
                    <RadioWithLabel
                        options={{ 1: "Chuyển tất cả", 2: "Chuyển đơn lẻ" }}
                        label="Hình thức chuyển"
                        name="hinh_thuc_chuyen"
                        wrappedClass="col-md-3"
                        form={props.form}
                        isDisabled={true}
                    />
                    {Number(props.form.getFieldValue('hinh_thuc_chuyen')) === 2 ? (
                        ""):(<SelectWithLabel
                        options={businessEmployeeReceive}
                        name="nvkd_tiep_nhan_id"
                        wrappedClass="col-md-4"
                        form={props.form}
                        placeholder="Chọn nhân viên kinh doanh tiếp nhận"
                        label="Nhân viên kinh doanh tiếp nhận"
                        isDisabled={true}
                    />)
                    }
                </div>
                <div className="input-group">

                    <TableTransfer columns={columns} data={data} />

                </div>
                <div className="input-group">
                    <RadioWithLabel
                        options={{ 1: "Có", 2: "Không" }}
                        label="Yêu cầu khóa tài khoản"
                        name="is_lock_account"
                        wrappedClass="col-md-3"
                        form={props.form}
                        isDisabled={true}
                    />
                </div>
                <div className="input-group">
                    <TextAreaWithLabel
                        form={props.form}
                        label="Ghi chú"
                        name="note"
                        wrapClass="col-md"
                        rows={4}
                        isDisabled={true}
                    />
                </div>
            </Form>

            <div className="input-group d-flex justify-content-center p-5">

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

const WrappedTransferBusinessEmployeePreview = Form.create<Props>({
    name: "TransferBusinessEmployeePreview"
})(TransferBusinessEmployeePreview);

export default WrappedTransferBusinessEmployeePreview;
