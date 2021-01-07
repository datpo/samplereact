import React, {useState} from "react";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { AgencyService } from './../../services/agency/AgencyServices';
import { UserServices } from './../../services/user/UserServies';
import SelectWithLabel from './../../components/common/form/input-with-label/SelectWithLabel';
import ButtonSearch from "components/common/form/button/ButtonSearch";
import { TypeToken } from "helpers/enum/request-token/RequestTokenEnums";
import { OPTION } from "./Enum";

interface Props extends FormComponentProps {}

const RequestTokenCTSSearchForm: React.FC<Props> = props => {
    const [agency, setAgency] = useState([]);
    const getAgency = async (type, sale_id)  => {
        const agencyService = new AgencyService();
        const lst = await agencyService.getAgencyContributorForStaff(type);
        if (lst) {
            const arr:any = [];
            lst.data.map(value => (arr[value.id] = value.fullname));
            setAgency(arr);
        }
    };
    const onChangeSelectedType = async (e) => {
        const userService = new UserServices();
        const userResult = await userService.getUserAuth();
        let sale_id = userResult.data.id;
        let type = 7;
        if (e === 2) type = 8;
        getAgency(type, sale_id);
        props.form.setFieldsValue({owner_id: null})
    };
  
    return (
        <Form>
            <div className="input-group">
                <SelectWithLabel
                    options={TypeToken.TYPEAGENCY}
                    name="belong_to"
                    wrappedClass="col-md-2 nopadding-left"
                    form={props.form}
                    placeholder="Chọn loại người dùng"
                    onChange={onChangeSelectedType}
                    isRequired={false}
                />
                <SelectWithLabel
                    options={agency}
                    name="owner_id"
                    wrappedClass="col-md-3 nopadding-left"
                    form={props.form}
                    placeholder="Chọn đại lý/cộng tác viên"
                />
                <SelectWithLabel
                    options={OPTION.STATUS}
                    name="status"
                    wrappedClass="col-md-2 nopadding-left"
                    form={props.form}
                    placeholder="Chọn trạng thái"
                />
                <div className="form-group col-md-5 mt-1">
                    <ButtonSearch data={props.form.getFieldsValue()} />
                </div>
            </div>
        </Form>
    );
};

const WrappedRequestCTSSearchForm = Form.create<Props>({
    name: "RequestTokenCTSSearchForm"
})(RequestTokenCTSSearchForm);

export default WrappedRequestCTSSearchForm;
