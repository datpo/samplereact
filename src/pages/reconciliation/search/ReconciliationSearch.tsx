import React, {useEffect, useState} from "react";
import { Form } from "antd";
import SelectWithLabel from "../../../components/common/form/input-with-label/SelectWithLabel";
import { FormComponentProps } from "antd/lib/form";
import ButtonSearch from "../../../components/common/form/button/ButtonSearch";
import InputWithLabel from "../../../components/common/form/input-with-label/InputWithLabel";
import {UserServices} from "../../../services/user/UserServies";
import {AgencyService} from "../../../services/agency/AgencyServices";
import {MONTHS, TYPE_USER_ENUM, YEARS} from "../enum/ReconciliationEnum";
import SelectWithSearchField from "../../../components/common/form/select-with-search-field/SelectWithSearchField";

interface Props extends FormComponentProps {}
const ReconciliationSearchForm: React.FC<Props> = props => {
    const [owner, setOwner] = useState([]);
    const [userType, setUserType] = useState(0);

    const onChangeSelectedType = async (e) => {
        if(!e){
            setOwner([])
        }else {
            const userService = new UserServices();
            const userResult = await userService.getUserAuth();
            let sale_id = userResult.data.id;
            let type = 7;
            if (Number(e) === 2) type = 8;
            if(Number(e) === 3){
                props.form.setFieldsValue({
                    employee_name: userResult.data.fullname,
                })
            }
            getOwner(type, sale_id);
        }
        props.form.setFieldsValue({owner_id: undefined})

    };
    const getOwner = async (type, sale_id)  => {
        const agencyService = new AgencyService();
        const lst = await agencyService.getAgencyContributor(type, sale_id);
        if (lst) {
            const arr:any = [];
            lst.data.map(value => (arr[value.id] = value.fullname));
            setOwner(arr);
        }
    };
    const fetchUser = async  () => {
        const user = new UserServices();
        const userInfo = await user.getUserAuth();
        setUserType(userInfo.data.type);
    };
    useEffect(() => {
        fetchUser();
    }, []);
    return (
        <Form>
            <div className="input-group">
                {Number(userType) === 5 ? (
                    <React.Fragment>
                        <SelectWithLabel
                            options={TYPE_USER_ENUM}
                            name="belong_to"
                            wrappedClass="col-md-2 nopadding-left"
                            form={props.form}
                            placeholder="Chọn loại người dùng"
                            onChange={onChangeSelectedType}
                        />
                        {Number(props.form.getFieldValue('belong_to')) === 3 ? (
                            <InputWithLabel
                                wrapClass={'col-md-2 nopadding-left'}
                                name={'employee_name'}
                                label={""}
                                form={props.form}
                                isDisabled={true}
                            />

                        ):(
                            <React.Fragment>
                                <SelectWithLabel
                                    options={owner}
                                    name="owner_id"
                                    wrappedClass="col-md-2 nopadding-left"
                                    form={props.form}
                                    placeholder="Chọn đại lý/CTV/NVKD"
                                />
                                <InputWithLabel
                                    wrapClass={'col-md-2 nopadding-left'}
                                    name={'identity'}
                                    label={""}
                                    form={props.form}
                                    placeholder={"MST/CMND"}
                                />
                            </React.Fragment>
                        )}

                    </React.Fragment>
                ): ("")}
                <SelectWithSearchField
                    wrappedClass='col-md-2 nopadding-left'
                    options={
                        {
                            1: 'Chờ tạo kết luận',
                            2: 'Chờ đại lý/ CTV/NVKD  duyệt',
                            3: 'Đại lý/ CTV/NVKD từ chối',
                            4: 'Đại lý/ CTV/NVKD đã duyệt',
                            5: 'Newca đã duyệt',
                            6: 'Hoàn thành'
                        }
                    }
                    name='status'
                    form={props.form}
                    placeholder="Trạng thái"
                />
                <SelectWithSearchField
                    wrappedClass={"col-md-1 nopadding-left"}
                    options={MONTHS}
                    name={"month"}
                    form={props.form}
                    placeholder={"Tháng"}
                />
                <SelectWithSearchField
                    wrappedClass={"col-md-1 nopadding-left"}
                    options={YEARS}
                    name={"year"}
                    form={props.form}
                    placeholder={"Năm"}
                />
                <div className="form-group col-md-1 mt-1 nopadding-left">
                    <ButtonSearch data={props.form.getFieldsValue()} />
                </div>

            </div>
        </Form>
    );
};

const WrappedReconciliationSearchForm = Form.create<Props>({
    name: "ReconciliationSearchForm"
})(ReconciliationSearchForm);

export default WrappedReconciliationSearchForm;
