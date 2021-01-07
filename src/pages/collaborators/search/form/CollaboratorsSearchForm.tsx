import React, { useState, useEffect } from "react";
import { Form } from "antd";
import SelectWithLabel from "../../../../components/common/form/input-with-label/SelectWithLabel";
import { STATUS_OPTIONS } from "../../../agency/enum/AgencyEnum";
import ButtonCreate from "../../../../components/common/form/button/ButtonCreate";
import ButtonSearch from "../../../../components/common/form/button/ButtonSearch";
import { FormComponentProps } from "antd/lib/form";
import InputWithoutLabel from "../../../../components/common/form/input-with-label/input/InputWithoutLabel";
import { AgencyService } from 'services/agency/AgencyServices';
import { CollaboratorsPermission } from 'helpers/enum/PermissionEnums';

interface Props extends FormComponentProps {}

const CollaboratorsSearchForm: React.FC<Props> = (props) => {
  const [managers, setManagers] = useState({});

  const getListManager = async() => {
    try {
      const agencyServices = new AgencyService();
      const user = await agencyServices.getManagerByAuth();
      setManagers(user.data);
    } catch (error) {}
  }
  
  useEffect(() => {
    getListManager();
    // eslint-disable-next-line
  }, []);

  return (
    <Form>
      <div className="input-group">
        <SelectWithLabel
          options={managers}
          name="manager"
          wrappedClass="col-md-2 nopadding-left"
          form={props.form}
          placeholder="Chọn người quản lý"
        />
        <SelectWithLabel
          options={STATUS_OPTIONS}
          name="status"
          wrappedClass="col-md-2 nopadding-left"
          form={props.form}
          placeholder="Chọn trạng thái"
        />
        <div className="col-md-2 nopadding-left">
          <InputWithoutLabel
            form={props.form}
            name="name"
            label="Mã, tên CTV"
            placeholder="Mã, tên CTV"
          />
        </div>
        <div className="col-md-2 nopadding-left">
          <InputWithoutLabel
            form={props.form}
            name="cmnd"
            label="CMND/Hộ chiếu"
            placeholder="CMND/Hộ chiếu"
          />
        </div>
        <div className="col-md-4 mt-1 nopadding-left">
          <ButtonSearch data={props.form.getFieldsValue()} />
          <ButtonCreate permission={CollaboratorsPermission.CREATE} toUrl="/quan-ly-ctv/them-moi" />
        </div>
      </div>
    </Form>
  );
};

const wrappedCollaSearchForm = Form.create<Props>({ name: "CollaSearchForm" })(
  CollaboratorsSearchForm
);

export default wrappedCollaSearchForm;
