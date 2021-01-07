import React, {useEffect} from "react";
import { Form } from "antd";
import SelectWithLabel from "../../../components/common/form/input-with-label/SelectWithLabel";
import { FormComponentProps } from "antd/lib/form";
import ButtonSearch from "../../../components/common/form/button/ButtonSearch";
import InputWithLabel from "../../../components/common/form/input-with-label/InputWithLabel";

interface Props extends FormComponentProps {}
const SearchForm: React.FC<Props> = props => {
    useEffect(() => {
        // eslint-disable-next-line
    }, []);
    return (
        <Form>
            <div className="input-group">
                <SelectWithLabel
                    options={{1: "Tổ chức", 2: "Cá nhân"}}
                    name="type"
                    wrappedClass="col-md-2 nopadding-left"
                    form={props.form}
                    placeholder="Loại khách hàng"
                    allowClear={true}
                />
                <InputWithLabel
                    form={props.form}
                    label=""
                    name="uid"
                    placeholder={"Mã khách hàng"}
                    wrapClass="col-md-2 nopadding-left"
                />
                <InputWithLabel
                    form={props.form}
                    label=""
                    name="code"
                    placeholder={"Mã định danh"}
                    wrapClass="col-md-2 nopadding-left"
                />
                <InputWithLabel
                    form={props.form}
                    label=""
                    name="fullname"
                    placeholder={"Tên khách hàng"}
                    wrapClass="col-md-2 nopadding-left"
                />
                <div className="form-group col-md-2 mt-1 nopadding-left">
                    <ButtonSearch data={props.form.getFieldsValue()} />
                </div>
            </div>
        </Form>
    );
};

const WrappedSearchForm = Form.create<Props>({
    name: "WrappedSearchForm"
})(SearchForm);

export default WrappedSearchForm;
