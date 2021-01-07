import React, {useEffect, useState} from "react";
import { Form } from "antd";
import SelectWithLabel from "../../../components/common/form/input-with-label/SelectWithLabel";
import { FormComponentProps } from "antd/lib/form";
import ButtonSearch from "../../../components/common/form/button/ButtonSearch";
import ButtonCreate from "../../../components/common/form/button/ButtonCreate";
import {UserServices} from "../../../services/user/UserServies";
import SelectDateSearch from "../../../components/common/form/input-with-label/SelectDateSearch";

interface Props extends FormComponentProps {}

const TransferBusinessEmployeeSearchForm: React.FC<Props> = props => {
    const [businessEmployeeTransfer, setBusinessEmployeeTransfer] = useState({});
    const [userCreated, setUserCreated] = useState([]);

    const getUserCreated = async (e) => {
        const service = new UserServices();
        const result = await service.getUserByType(e);
        if (result && Number(result.status) === 200) {
            setUserCreated(result.data);
        }
    };
    const fetchUserCreated = async  () => {
        const user = new UserServices();
        const userInfo = await user.getUserAuth();
        const type = userInfo.data.type;
        const list = await user.getUserByType(5);
        setBusinessEmployeeTransfer(list.data);

        getUserCreated(type)

    }

    useEffect(() => {
        fetchUserCreated();
        // eslint-disable-next-line
    }, []);

    return (
        <Form>
            <div className="input-group">
                <SelectWithLabel
                    options={businessEmployeeTransfer}
                    name="nvkd_chuyen_id"
                    wrappedClass="col-md-2 nopadding-left"
                    form={props.form}
                    placeholder="Nhân viên kinh doanh chuyển"
                    label=""
                />
                <SelectWithLabel
                    options={{1: "Có", 2: "Không"}}
                    name="is_lock_account"
                    wrappedClass="col-md-2 nopadding-left"
                    form={props.form}
                    placeholder="Yêu cầu khóa tài khoản"
                    label=""
                />

                <SelectWithLabel
                    options={userCreated}
                    name="created_by"
                    wrappedClass="col-md-2 nopadding-left"
                    form={props.form}
                    placeholder="Người yêu cầu"
                />
                <SelectDateSearch
                    name="receive_date"
                    form={props.form}
                    wrapClass="col-md-2 nopadding-left"
                    label=""
                    placeholder="Thời gian tạo"
                />
                <div className="form-group col-md-4 mt-1 nopadding-left">
                    <ButtonSearch data={props.form.getFieldsValue()} />
                    <ButtonCreate permission="" toUrl="/yeu-cau-chuyen-nguoi-quan-ly/them-moi" />
                </div>
            </div>
        </Form>
    );
};

const WrappedTransferBusinessEmployeeSearchForm = Form.create<Props>({
    name: "RequestTokenCTSSearchForm"
})(TransferBusinessEmployeeSearchForm);

export default WrappedTransferBusinessEmployeeSearchForm;
