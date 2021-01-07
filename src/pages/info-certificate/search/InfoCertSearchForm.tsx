import React, {useEffect, useState} from "react";
import { Form } from "antd";
import SelectWithLabel from "../../../components/common/form/input-with-label/SelectWithLabel";
import { FormComponentProps } from "antd/lib/form";
import ButtonSearch from "../../../components/common/form/button/ButtonSearch";
import InputWithLabel from "../../../components/common/form/input-with-label/InputWithLabel";
import SelectDateSearch from "../../../components/common/form/input-with-label/SelectDateSearch";
import _ from "lodash";
import {GenCertServices} from "../../../services/gen-cert/GenCertServices";

interface Props extends FormComponentProps {}
const InfoCertSearchForm: React.FC<Props> = props => {
    const [cateServicePackage, setCateServicePackage] = useState({});
    const fetchCateServicePackage = async () => {
        const data = await GenCertServices.getListCateServicePackage();
        setCateServicePackage(_.mapValues(_.keyBy(data.data, "id"), "name"));
    };
    useEffect(() => {
        fetchCateServicePackage();
        // eslint-disable-next-line
    },[]);
    return (
        <Form>
            <div className="input-group">
                <InputWithLabel
                    form={props.form}
                    label=""
                    name="ma-dinh-danh"
                    placeholder={"Mã định danh"}
                    wrapClass="col-md-2"
                />
                <InputWithLabel
                    form={props.form}
                    label=""
                    name="secret_code"
                    placeholder={"Mã bảo mật"}
                    wrapClass="col-md-2"
                />
                <SelectWithLabel
                    options={cateServicePackage}
                    name="package_id_search"
                    wrappedClass="col-md-2"
                    form={props.form}
                    placeholder="Gói dịch vụ"
                />
                <SelectDateSearch
                    name="created_at_search"
                    form={props.form}
                    wrapClass="col-md-2 "
                    label=""
                    placeholder="Thời gian tạo"
                />
                <div className="form-group col-md-2 mt-1 ">
                    <ButtonSearch data={props.form.getFieldsValue()} />
                </div>
            </div>
        </Form>
    );
};

const WrappedGenCertSearchForm = Form.create<Props>({
    name: "GenCertSearchForm"
})(InfoCertSearchForm);

export default WrappedGenCertSearchForm;
