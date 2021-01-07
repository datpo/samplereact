import React, {useEffect, useState} from "react";
import { Form } from "antd";
import SelectWithLabel from "../../../components/common/form/input-with-label/SelectWithLabel";
import { FormComponentProps } from "antd/lib/form";
import ButtonSearch from "../../../components/common/form/button/ButtonSearch";
import ButtonCreate from "../../../components/common/form/button/ButtonCreate";
import {UserServices} from "../../../services/user/UserServies";
import InputWithLabel from "../../../components/common/form/input-with-label/InputWithLabel";
import SelectDateSearch from "../../../components/common/form/input-with-label/SelectDateSearch";
import {AgencyService} from "../../../services/agency/AgencyServices";
import {TypeUser} from "../../../helpers/enum/request-token/RequestTokenEnums";
import { checkPermission } from "helpers/NewCaCrmHelper";

const per_create = 'create-request-training'
interface Props extends FormComponentProps {}

const RequestTokenTrainingSearchForm: React.FC<Props> = props => {
    const [userType, setUserType] = useState(0);
    const [userCreated, setUserCreated] = useState([]);

    const getOwnerForStaff = async (type)  => {
        const agencyService = new AgencyService();
        const lst = await agencyService.getAgencyContributorForStaff(type);
        if (lst) {
            const arr:any = [];
            lst.data.map(value => (arr[value.id] = value.fullname));
            setUserCreated(arr);
        }
    };
    const onChangeSelectedType = async (e) => {
        if(!e){
            setUserCreated([])
        }else {
            const userService = new UserServices();
            const userResult = await userService.getUserAuth();
            const typeUser = userResult.data.type;
            let type = 7;
            if (Number(e) === 2) type = 8;
            if(Number(typeUser) === 6){
                getOwnerForStaff(type)
            }
        }
        props.form.setFieldsValue({owner_id_search:undefined})

    };
    const fetchUserCreated = async  () => {
        const user = new UserServices();
        const userInfo = await user.getUserAuth();
        const type = userInfo.data.type;
        setUserType(type)
    };
    useEffect(() => {
        fetchUserCreated();
        // eslint-disable-next-line
    }, []);
    return (
        <Form>
            <div className="input-group">
                {Number(userType) === 6 ? (
                    <React.Fragment>
                        <div className="input-group">
                            <SelectWithLabel
                                options={TypeUser.TYPEUSER}
                                name="belong_to"
                                wrappedClass="col-md-2 nopadding-left"
                                form={props.form}
                                placeholder="Chọn loại người dùng"
                                onChange={onChangeSelectedType}
                            />
                            <SelectWithLabel
                                options={userCreated}
                                name="owner_id_search"
                                wrappedClass="col-md-2 nopadding-left"
                                form={props.form}
                                placeholder="Người yêu cầu"
                            />
                            <InputWithLabel
                                form={props.form}
                                label=""
                                name="mst_cmnd_search"
                                placeholder={"MST/Số CMND"}
                                wrapClass="col-md-2 nopadding-left"
                            />
                        </div>

                    </React.Fragment>
                ):("")}
                <div className="input-group">
                    <SelectDateSearch
                        name="training_date_search"
                        form={props.form}
                        wrapClass="col-md-2 nopadding-left"
                        label=""
                        placeholder="Thời gian đào tạo"
                    />
                    <SelectDateSearch
                        name="created_at_search"
                        form={props.form}
                        wrapClass="col-md-2 nopadding-left"
                        label=""
                        placeholder="Thời gian tạo"
                    />
                    <SelectWithLabel
                        options={{
                            1: "Nháp",
                            2: "Chờ HTKD duyệt",
                            3: "HTKD từ chối",
                            4: "Chờ giám đốc duyệt",
                            5: "Giám đốc từ chối",
                            6: "Hoàn thành",
                        }}
                        name="status_search"
                        wrappedClass="col-md-2 nopadding-left"
                        form={props.form}
                        placeholder="Chọn trạng thái"
                    />
                    <div className="form-group col-md-4 mt-1 nopadding-left">
                        <ButtonSearch data={props.form.getFieldsValue()} />
                        {(Number(userType) === 7 || Number(userType) === 8) && checkPermission(per_create) ?  (
                            <ButtonCreate permission="" toUrl="/yeu-cau-dao-tao/them-moi" />

                        ) : (
                            ""
                        )}
                    </div>
                </div>

            </div>
        </Form>
    );
};

const WrappedRequestTrainingSearchForm = Form.create<Props>({
    name: "RequestTokenTrainingSearchForm"
})(RequestTokenTrainingSearchForm);

export default WrappedRequestTrainingSearchForm;
