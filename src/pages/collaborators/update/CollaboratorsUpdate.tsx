import React, { useEffect, useState } from "react";
import { match } from "react-router";
import PageWrapper from "../../wrapper/PageWrapper";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { History, Location } from "history";
import CollaboratorsFormCreate from "../create/form/CollaboratorsFormCreate";
import CollaFormCreateContractType from "../create/form/contract-type-row/CollaFormCreateContractType";
import { collaboratorsServices } from "../../../services/collaborators/CollaboratorsServies";
import moment from "moment";
import ButtonSaveGroupCollaForm from "../create/form/button-group-save/ButtonSaveGroupCollaForm";
import { onSuccessAction, onFailAction } from "../../../helpers/SwalCommon";
import _ from "lodash";
import { loading as blockui } from "../../../components/common/loading/Loading";
import ModalDisplayFile from "components/common/modal/display-file/ModalDisplayFile";
import InputWithLabel from './../../../components/common/form/input-with-label/InputWithLabel';
import { handleDateData } from './../../../helpers/NewCaCrmHelper';

interface Props extends FormComponentProps {
  history: History;
  location: Location;
  match: match<{
    id: string;
  }>;
}
const objectDate = {
  1: 'passport_date',
  2: 'birthday',
  3: 'contract_date'
};
const CollaboratorsUpdate: React.FC<Props> = props => {
  const [loading, setLoading] = useState(true);
  const [fileLabel, setFileLabel] = useState("");
  const id = props.match.params.id;

  const [loadingModal, setLoadingModal] = useState(false);
  const [modalPassportFile, setModalPassportFile] = useState(false);
  const [filePassPort, setFilePassPort] = useState("");
  const [fileContract, setFileContract] = useState("");

  const [reason, setReason] = useState({
    reason_manager: '',
    reason_htkd: '',
    status: "",
  });
  // eslint-disable-next-line
  useEffect(() => {

    const fetchModel = async () => {
      const result = await collaboratorsServices.getToUpdate(
        props.match.params.id
      );
      const colla = result.data;
      setReason({
        ...reason,
        reason_manager: colla.history_deny_manager ? colla.history_deny_manager.content: '',
        reason_htkd: colla.history_deny_manager ? colla.history_deny_manager.content: '',
        status: colla.status ? String(colla.status) : '',
      });
      setLoading(false);
      props.form.setFieldsValue({
        name: colla.fullname,
        code: colla.code,
        passport: colla.passport,
        passport_place: colla.passport_place,
        passport_date: moment(colla.passport_date),
        birthday: moment(colla.birthday),
        email: colla.email,
        address: colla.address,
        phone: colla.phone,
        job: colla.job,
        sortname: colla.sortname,
        cooperate_capacity: colla.cooperate_capacity,
        competitive_area: colla.competitive_area,
        is_cooperate: colla.is_cooperate,
        supply_capacity: colla.supply_capacity,
        contract_date: moment(colla.contract_file.contract_date),
        contract_number: colla.contract_file.code,
        discount: colla.discount_rate.value,
        contract_type: `${colla.type}`,
        relation_business: colla.relation_business,
        product:colla.product,
      });
      setFileLabel(colla.passport_file.name);
      setFileContract(colla.contract_file);
    };

    fetchModel();
    // eslint-disable-next-line
  }, []);

  const onDisplayfile = async () => {
    // const formData = props.form.getFieldsValue();
    // const formDataConvert = handleDateData(formData, objectDate)
    // const data = await collaboratorsServices.previewContractFile(formDataConvert);
    const data = await collaboratorsServices.getDocument(id, 2);
    return data;
  };

  const onDisplayToTrinhFile = async () => {
    const formData = props.form.getFieldsValue();
    const formDataConvert = handleDateData(formData, objectDate)
    const data = await collaboratorsServices.previewToTrinhFile(formDataConvert);
    return data;
  };

  const onDownloadFile = async () => {
    try {
      setModalPassportFile(true);
      setLoadingModal(true);
      const file = await collaboratorsServices.getFilePassport(id);
      setFilePassPort(file);
    } finally {
      setLoadingModal(false);
    }
  };

  const onOkModalPassPort = () => {
    setModalPassportFile(false);
  };

  const onUpdate = type => {
    const { form } = props;
    props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        try {
          const formData = props.form.getFieldsValue();
          const formDataConvert = handleDateData(formData, objectDate)
          blockui.runLoadingBlockUI();
          let data: any;
          if (type === 1) {
            data = await collaboratorsServices.draftUpdate(id, formDataConvert);
          } else {
            data = await collaboratorsServices.confirmUpdate(id, formDataConvert);
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
            onSuccessAction("Cập nhật CTV thành công!", () => {
              props.history.push("/quan-ly-ctv");
            });
          }
        } catch (error) {
          onFailAction("Có lỗi xảy ra !");
        } finally {
          blockui.stopRunLoading();
        }
      }
    });
  };

  return (
    <PageWrapper title="Cập nhật CTV" loading={loading}>
      <Form>
      {reason.reason_manager && reason.status === "5" ? (
          <InputWithLabel
            form={props.form}
            label="Lý do từ chối của giám đốc"
            name="reason_manager"
            wrapClass="col-md-12"
            defaultValue={reason.reason_manager}
            isDisabled={true}
          />
        ) : (
          ""
        )}
        {reason.reason_htkd && reason.status === "3" ? (
          <InputWithLabel
            form={props.form}
            label="Lý do từ chối của HTKD"
            name="reason_manager"
            wrapClass="col-md-12"
            defaultValue={reason.reason_htkd}
            isDisabled={true}
          />
        ) : (
          ""
        )}
        <CollaboratorsFormCreate
          form={props.form}
          defaultFileLabel={fileLabel}
          onClickDownloadFile={onDownloadFile}
          isUpdateForm={true}
        />
        <ModalDisplayFile
          titleModal="File CMND/Hộ chiếu"
          visibleModal={modalPassportFile}
          loadingModal={loadingModal}
          fileBase64={filePassPort}
          onOkModal={onOkModalPassPort}
        />
        <CollaFormCreateContractType
          onClickContractFile={onDisplayfile}
          onClickToTrinhFile={onDisplayToTrinhFile}
          form={props.form}
          contract={fileContract}
        />
      </Form>
      <ButtonSaveGroupCollaForm onStore={onUpdate} />
    </PageWrapper>
  );
};

const CollaboratorsUpdateForm = Form.create<Props>({
  name: "CollaboratorsUpdate"
})(CollaboratorsUpdate);

export default CollaboratorsUpdateForm;
