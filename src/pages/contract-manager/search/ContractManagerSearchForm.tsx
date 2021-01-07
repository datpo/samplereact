import React, {useEffect, useState} from "react";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import ButtonSearch from "../../../components/common/form/button/ButtonSearch";
import InputWithLabel from "../../../components/common/form/input-with-label/InputWithLabel";
import SelectWithLabel from "../../../components/common/form/input-with-label/SelectWithLabel";
import {AgencyService} from "../../../services/agency/AgencyServices";
interface Props extends FormComponentProps {}

const ContractManagerSearchForm: React.FC<Props> = props => {
    const [userList, setUserList] = useState({});
    const getListUser = async () => {
        const agencyServices = new AgencyService();
        const user = await agencyServices.getManagerByAuth();
        setUserList(user.data)
    };
    useEffect(() => {
        getListUser();
        // eslint-disable-next-line
    }, []);
    return (
        <Form>
            <div className="input-group">
                <InputWithLabel
                    form={props.form}
                    label=""
                    name="code"
                    placeholder={"Mã đại lý/CTV"}
                    wrapClass="col-md-2 nopadding-left"
                />
                <SelectWithLabel
                    options={{1:"Giấy", 2:"Điện tử"}}
                    name="type_sign"
                    wrappedClass="col-md-2"
                    form={props.form}
                    label={""}
                    isRequired={false}
                    placeholder={"Hình thức ký"}
                />
                <SelectWithLabel
                    options={{1:"Hợp đồng đại lý/CTV", 2:"Biên bản thanh lý"}}
                    name="type_contract"
                    wrappedClass="col-md-2"
                    form={props.form}
                    label={""}
                    isRequired={false}
                    placeholder={"Loại hợp đồng"}
                />
                {userList ?
                    <SelectWithLabel
                    options={userList}
                    name="created_by"
                    wrappedClass="col-md-2"
                    form={props.form}
                    label={""}
                    isRequired={false}
                    placeholder={"Người quản lý"}
                    />
                    : null
                }
                <div className="form-group col-md-2 mt-1">
                    <ButtonSearch data={props.form.getFieldsValue()} />
                </div>
            </div>
        </Form>
    );
};

const WrappedContractManagerSearchForm = Form.create<Props>({
    name: "WrappedContractManagerSearchForm"
})(ContractManagerSearchForm);

export default WrappedContractManagerSearchForm;
