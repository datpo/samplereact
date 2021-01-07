import React, {useEffect} from "react";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import ButtonSearch from "../../../components/common/form/button/ButtonSearch";
import InputWithLabel from "../../../components/common/form/input-with-label/InputWithLabel";

interface Props extends FormComponentProps {}
const SearchFormDocument: React.FC<Props> = props => {

    useEffect(() => {
        // eslint-disable-next-line
    }, []);
    return (
        <Form>
            <div className="input-group">
                <InputWithLabel
                    form={props.form}
                    label=""
                    name="text_search"
                    placeholder={"Tên hoặc số tài liệu"}
                    wrapClass="col-md-4 nopadding-left"
                />
                <div className="form-group col-md-2 mt-1 nopadding-left">
                    <ButtonSearch data={props.form.getFieldsValue()} />
                </div>

            </div>
        </Form>
    );
};

const WrappedFormDocument = Form.create<Props>({
    name: "WrappedFormDocument"
})(SearchFormDocument);

export default WrappedFormDocument;
