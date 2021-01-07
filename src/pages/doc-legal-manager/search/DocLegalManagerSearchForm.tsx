import React from "react";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import ButtonSearch from "../../../components/common/form/button/ButtonSearch";
import InputWithLabel from "../../../components/common/form/input-with-label/InputWithLabel";
import SelectWithLabel from "../../../components/common/form/input-with-label/SelectWithLabel";

interface Props extends FormComponentProps {}
const DocLegalManagerSearchForm: React.FC<Props> = props => {
    return (
        <Form>
            <div className="input-group">
                <InputWithLabel
                    form={props.form}
                    label=""
                    name="customer_code"
                    placeholder={"Mã khách hàng"}
                    wrapClass="col-md-2 nopadding-left"
                />
                <InputWithLabel
                    form={props.form}
                    label=""
                    name="code"
                    placeholder={"Mã số DN/CMND"}
                    wrapClass="col-md-2 nopadding-left"
                />
                <SelectWithLabel
                    options={{1:"Cấp mới", 2:"Gia hạn", 3:"Chuyển đổi"}}
                    name="object"
                    wrappedClass="col-md-2"
                    form={props.form}
                    label={""}
                    isRequired={false}
                    placeholder="Đối tượng"
                />
                <SelectWithLabel
                    options={{1:"Tổ chức", 2:"Cá nhân"}}
                    name="type_request"
                    wrappedClass="col-md-2"
                    form={props.form}
                    label={""}
                    isRequired={false}
                    placeholder="Loại yêu cầu"
                />
                <div className="form-group col-md-2 mt-1">
                    <ButtonSearch data={props.form.getFieldsValue()} />
                </div>
            </div>
        </Form>
    );
};

const WrappedDocLegalManagerSearchForm = Form.create<Props>({
    name: "WrappedDocLegalManagerSearchForm"
})(DocLegalManagerSearchForm);

export default WrappedDocLegalManagerSearchForm;
