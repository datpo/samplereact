import React, {useEffect, useState} from "react";
import { Form } from "antd";
import SelectWithLabel from "../../common/form/input-with-label/SelectWithLabel";
import { FormComponentProps } from "antd/lib/form";
import InputWithoutLabel from "../../common/form/input-with-label/input/InputWithoutLabel";
import ButtonSearch from "../../common/form/button/ButtonSearch";
import ButtonCreate from "../../common/form/button/ButtonCreate";
import {UserServices} from "../../../services/user/UserServies";

interface Props extends FormComponentProps {}
const TYPE_HTKD = 6;
const RequestTokenSearchForm: React.FC<Props> = props => {
    const [userType, setUserType] = useState(0);
    const fetchUser = async  () => {
        const user = new UserServices();
        const userInfo = await user.getUserAuth();
        const type = userInfo.data.type;
        setUserType(type);

    }
    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line
    }, []);

  return (
    <Form>
      <div className="input-group">
        <div className="form-group col-md-3 nopadding-left">
          <InputWithoutLabel
            form={props.form}
            name="ten"
            label="Mã, tên đại lý"
            placeholder="Mã, tên đại lý"
          />
        </div>
        <div className="form-group col-md-3 nopadding-left">
          <InputWithoutLabel
            form={props.form}
            name="ma_so_thue"
            label="Mã số thuế"
            placeholder="Mã số thuế"
          />
        </div>
        <SelectWithLabel
          options={{
            1: "Nháp",
            2: "Chờ kế toán duyệt",
            3: "Kế toán từ chối",
            4: "Kế toán đã duyệt",
          }}
          name="trang-thai"
          wrappedClass="col-md-2 nopadding-left"
          form={props.form}
          placeholder="Chọn trạng thái"
        />

        <div className="form-group col-md-4 mt-1">
          <ButtonSearch data={props.form.getFieldsValue()} />
            {userType === TYPE_HTKD ? ("") : (
                <ButtonCreate permission="" toUrl="/yeu-cau-token/them-moi" />
            )}

        </div>
      </div>
    </Form>
  );
};

const WrappedRequestSearchForm = Form.create<Props>({
  name: "RequestTokenSearchForm"
})(RequestTokenSearchForm);

export default WrappedRequestSearchForm;
