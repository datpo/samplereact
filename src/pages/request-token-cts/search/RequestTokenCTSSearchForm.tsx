import React, {useEffect, useState} from "react";
import { Form } from "antd";
import SelectWithLabel from "../../../components/common/form/input-with-label/SelectWithLabel";
import { FormComponentProps } from "antd/lib/form";
import ButtonSearch from "../../../components/common/form/button/ButtonSearch";
import ButtonCreate from "../../../components/common/form/button/ButtonCreate";
import {TypeToken} from "../../../helpers/enum/request-token/RequestTokenEnums";
import {AgencyService} from "../../../services/agency/AgencyServices";
import {UserServices} from "../../../services/user/UserServies";
import SelectDateSearch from "../../../components/common/form/input-with-label/SelectDateSearch";

interface Props extends FormComponentProps {}

const RequestTokenCTSSearchForm: React.FC<Props> = props => {
    const [owner, setOwner] = useState([]);
    const [userType, setUserType] = useState(0);

    const getOwner = async (type, sale_id)  => {
        const agencyService = new AgencyService();
        const lst = await agencyService.getAgencyContributor(type, sale_id);
        if (lst) {
            const arr:any = [];
            lst.data.map(value => (arr[value.id] = value.fullname));
            setOwner(arr);
        }
    };
    const getOwnerForStaff = async (type)  => {
        const agencyService = new AgencyService();
        const lst = await agencyService.getAgencyContributorForStaff(type);
        if (lst) {
            const arr:any = [];
            lst.data.map(value => (arr[value.id] = value.fullname));
            setOwner(arr);
        }
    };
    const onChangeSelectedType = async (e) => {
        if(!e){
            setOwner([])
        }else {
            const userService = new UserServices();
            const userResult = await userService.getUserAuth();
            const typeUser = userResult.data.type;
            let sale_id = userResult.data.id;
            let type = 7;
            if (Number(e) === 2) type = 8;
            if (Number(e) === 3) type = 5;
            if(typeUser === TYPE_BUSINESS_SUPPORT){
                  getOwnerForStaff(type)
            }else {
                getOwner(type, sale_id);
            }
        }
        props.form.setFieldsValue({owner_id: undefined})

    };

    const fetchUserCreated = async  () => {
        const user = new UserServices();
        const userInfo = await user.getUserAuth();

        const type = userInfo.data.type;
        setUserType(type);
    };
    useEffect(() => {
        fetchUserCreated();
        // eslint-disable-next-line
    }, []);
    const TYPE_NVKD = 5;
    const TYPE_BUSINESS_SUPPORT = 6;
    return (
        <Form>
            <div className="input-group">
                {userType === TYPE_NVKD || userType === TYPE_BUSINESS_SUPPORT ?(
                    <SelectWithLabel
                        options={TypeToken.TYPEAGENCY}
                        name="belong_to"
                        wrappedClass="col-md-2 nopadding-left"
                        form={props.form}
                        placeholder="Chọn loại người dùng"
                        onChange={onChangeSelectedType}
                    />
                ) : (
                    ""
                )}
                {userType === TYPE_NVKD || userType === TYPE_BUSINESS_SUPPORT ? (
                    <SelectWithLabel
                        options={owner}
                        name="owner_id"
                        wrappedClass="col-md-2 nopadding-left"
                        form={props.form}
                        placeholder="Chọn đại lý/CTV/NVKD"
                    />
                ) : (
                    ""
                )}
                {userType === TYPE_BUSINESS_SUPPORT ?(
                    <SelectWithLabel
                        options={{
                            2: "Chờ kế toán duyệt",
                            3: "Kế toán từ chối",
                            4: "Hoàn thành",
                            5: "Chờ HTKD duyệt",
                            6: "HTKD từ chối",
                            7: "Đã xuất token",
                        }}
                        name="status"
                        wrappedClass="col-md-2 nopadding-left"
                        form={props.form}
                        placeholder="Chọn trạng thái"
                    />
                ):(
                    <SelectWithLabel
                        options={{
                            1: "Nháp",
                            2: "Chờ kế toán duyệt",
                            3: "Kế toán từ chối",
                            4: "Hoàn thành",
                            5: "Chờ HTKD duyệt",
                            6: "HTKD từ chối",
                            7: "Đã xuất token",
                        }}
                        name="status"
                        wrappedClass="col-md-2 nopadding-left"
                        form={props.form}
                        placeholder="Chọn trạng thái"
                    />
                )}
                <SelectDateSearch
                    name="date_search"
                    form={props.form}
                    wrapClass="col-md-2 nopadding-left"
                    label=""
                    placeholder="Thời gian tạo"
                />
                <div className="form-group col-md-4 mt-1 nopadding-left">
                    <ButtonSearch data={props.form.getFieldsValue()} />
                {userType !== TYPE_BUSINESS_SUPPORT ? (
                        <ButtonCreate permission="create-request-document" toUrl="/yeu-cau-token-cts/them-moi" />
                ) : (
                    ""
                )}
                 </div>

            </div>
        </Form>
    );
};

const WrappedRequestCTSSearchForm = Form.create<Props>({
    name: "RequestTokenCTSSearchForm"
})(RequestTokenCTSSearchForm);

export default WrappedRequestCTSSearchForm;
