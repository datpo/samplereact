import React from "react";
import PageWrapper from "../../wrapper/PageWrapper";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import CollaboratorsFormCreate from "./form/CollaboratorsFormCreate";
import CollaFormCreateContractType from "./form/contract-type-row/CollaFormCreateContractType";
import { collaboratorsServices } from "../../../services/collaborators/CollaboratorsServies";
import { loading } from "../../../components/common/loading/Loading";
import { onSuccessAction, onFailAction } from "../../../helpers/SwalCommon";
import _ from "lodash";
import ButtonSaveGroupCollaForm from "./form/button-group-save/ButtonSaveGroupCollaForm";
import { handleDateData } from './../../../helpers/NewCaCrmHelper';

interface Props extends FormComponentProps {
  history: any;
}

const objectDate = {
  1: 'passport_date',
  2: 'birthday',
  3: 'contract_date'
};
const CollaboratorsCreate: React.FC<Props> = props => {

  const onDisplayContractFile = async () => {
    const formData = props.form.getFieldsValue();
    const formDataConvert = handleDateData(formData, objectDate)
    const data = await collaboratorsServices.previewContractFile(formDataConvert);
    return data;
  };

  const onDisplayToTrinhFile = async () => {
    const formData = props.form.getFieldsValue();
    const formDataConvert = handleDateData(formData, objectDate)
    const data = await collaboratorsServices.previewToTrinhFile(formDataConvert);
    return data;
  };

  const onStore = type => {
    const { form } = props;
    props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        try {
          const formData = props.form.getFieldsValue();
          const formDataConvert = handleDateData(formData, objectDate)
          loading.runLoadingBlockUI();
          let data: any;
          if (type === 1) {
            data = await collaboratorsServices.draftStore(formDataConvert);
          } else {
            data = await collaboratorsServices.confirmStore(formDataConvert);
          }
          if (data && data.status === 422) {
            _.forOwn(data.error, function(errors, key) {
              form.setFields({
                [key]: {
                  errors: [new Error(errors.toString())]
                }
              });
            });
          } else {
            onSuccessAction("Lưu CTV thành công!", () => {
              props.history.push("/quan-ly-ctv");
            });
          }
        } catch (error) {
           onFailAction("Có lỗi xảy ra !");
        } finally {
          loading.stopRunLoading();
        }
      }
    });
  };

  return (
    <PageWrapper title="Thêm mới CTV">
      <Form>
        <CollaboratorsFormCreate form={props.form} />
        <CollaFormCreateContractType
          onClickContractFile={onDisplayContractFile}
          onClickToTrinhFile={onDisplayToTrinhFile}
          form={props.form}
        />
      </Form>
      <ButtonSaveGroupCollaForm onStore={onStore} />
    </PageWrapper>
  );
};

const WrappedCollaFormCreate = Form.create<Props>({
  name: "CollaFormCreate"
})(CollaboratorsCreate);

export default WrappedCollaFormCreate;
