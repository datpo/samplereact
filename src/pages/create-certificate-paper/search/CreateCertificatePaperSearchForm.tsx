import React from "react";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import ButtonSearch from "../../../components/common/form/button/ButtonSearch";
import InputWithLabel from "../../../components/common/form/input-with-label/InputWithLabel";

interface Props extends FormComponentProps {}
const CreateCertificatePaperSearchForm: React.FC<Props> = props => {
    return (
        <Form>
            <div className="input-group">
                <InputWithLabel
                    form={props.form}
                    label=""
                    name="code"
                    placeholder={"Mã định danh"}
                    wrapClass="col-md-2"
                />
                <div className="form-group col-md-2 mt-1 nopadding-left">
                    <ButtonSearch data={props.form.getFieldsValue()} />
                </div>
            </div>
        </Form>
    );
};

const WrappedRequestCTSGroupSearchForm = Form.create<Props>({
    name: "WrappedRequestCTSGroupSearchForm"
})(CreateCertificatePaperSearchForm);

export default WrappedRequestCTSGroupSearchForm;
