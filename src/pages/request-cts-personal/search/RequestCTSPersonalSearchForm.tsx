import React, {useEffect, useState} from "react";
import { Form } from "antd";
import SelectWithLabel from "../../../components/common/form/input-with-label/SelectWithLabel";
import { FormComponentProps } from "antd/lib/form";
import ButtonSearch from "../../../components/common/form/button/ButtonSearch";
import ButtonCreate from "../../../components/common/form/button/ButtonCreate";
import InputWithLabel from "../../../components/common/form/input-with-label/InputWithLabel";
import SelectDateSearch from "../../../components/common/form/input-with-label/SelectDateSearch";
import {RequestDigitalCertificatePersonalServices} from "../../../services/request-digital-certificate-personal/RequestDigitalCertificatePersonalServices";
import _ from "lodash";
import {UserServices} from "../../../services/user/UserServies";

interface Props extends FormComponentProps {}
const TYPE_BUSINESS_SUPPORT = 6;
const RequestCTSPersonalSearchForm: React.FC<Props> = props => {
    const [cateServicePackage, setCateServicePackage] = useState({});
    const [userType, setUserType] = useState(0);
    // const fetchCateServicePackage = async () => {
    //     const data = await RequestDigitalCertificatePersonalServices.getListCateServicePackagePersonal(type_search,type);
    //     setCateServicePackage(_.mapValues(_.keyBy(data.data, "id"), "name"));
    // };
    const fetchUser = async  () => {
        const user = new UserServices();
        const userInfo = await user.getUserAuth();
        const type = userInfo.data.type;
        setUserType(type);
    }
    useEffect(() => {
        //fetchCateServicePackage();
        fetchUser();
        // eslint-disable-next-line
    }, []);
    const onchangeObject = async (e) => {
        props.form.setFieldsValue({package_id_search: undefined})
        const type_search = 2
        const type = e
        if (e) {
            const data = await RequestDigitalCertificatePersonalServices.getListCateServicePackagePersonal(type_search,type)
            setCateServicePackage(_.mapValues(_.keyBy(data.data, "id"), "name"));
        }
    }
    return (
        <Form>
            <div className="input-group">
                <InputWithLabel
                    form={props.form}
                    label=""
                    name="fullname_search"
                    placeholder={"Tên khách hàng"}
                    wrapClass="col-md-3 nopadding-left"
                />

                <SelectWithLabel
                    options={{1: "Cấp mới", 2: "Gia hạn", 3: "Chuyển đổi"}}
                    name="object_search"
                    wrappedClass="col-md-3 nopadding-left"
                    form={props.form}
                    placeholder="Đối tượng"
                    onChange={onchangeObject}
                />
                <SelectWithLabel
                    options={cateServicePackage}
                    name="package_id_search"
                    wrappedClass="col-md-2 nopadding-left"
                    form={props.form}
                    placeholder="Gói dịch vụ"
                />
                <div className="form-group col-md-2-4 mt-1 nopadding-left">
                    <ButtonSearch data={props.form.getFieldsValue()} />
                    {userType === TYPE_BUSINESS_SUPPORT ? ("") : (
                        <ButtonCreate permission="" toUrl="/yeu-cau-cts-ca-nhan/them-moi" />
                    )}
                </div>

            </div>
            <div className="input-group">
                <InputWithLabel
                    form={props.form}
                    label=""
                    name="passport_search"
                    placeholder={"Số CMND/Hộ chiếu"}
                    wrapClass="col-md-3 nopadding-left"
                />
                <SelectWithLabel
                    wrappedClass='col-md-3 nopadding-left'
                    options={
                        {
                            1: 'Nháp',
                            2: 'Chờ duyệt',
                            3: 'Nghiệp vụ từ chối',
                            4: 'Nghiệp vụ đã duyệt',
                            5: 'Hoàn thành'
                        }
                    }
                    name='status_search'
                    form={props.form}
                    placeholder="Trạng thái"
                />
                <SelectDateSearch
                    name="created_at_search"
                    form={props.form}
                    wrapClass="col-md-2 nopadding-left"
                    label=""
                    placeholder="Thời gian tạo"
                />
            </div>
        </Form>
    );
};

const WrappedRequestCTSPersonalSearchForm = Form.create<Props>({
    name: "RequestCTSPersonalSearchForm"
})(RequestCTSPersonalSearchForm);

export default WrappedRequestCTSPersonalSearchForm;
