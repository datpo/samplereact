import React, { useEffect, useState } from "react";
import { match } from "react-router";
import PageWrapper from "../../wrapper/PageWrapper";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { History, Location } from "history";
import CollaboratorsFormReactive from "../create/form/CollaboratorsFormReactive";
import CollaFormCreateContractType from "../create/form/contract-type-row/CollaFormCreateContractType";
import { collaboratorsServices } from "../../../services/collaborators/CollaboratorsServies";
import moment from "moment";
import ButtonReactiveGroupCollaForm from "../create/form/button-group-save/ButtonReactiveGroupCollaForm";
import { onSuccessAction, onFailAction } from "../../../helpers/SwalCommon";
import _ from "lodash";
import { loading as blockui } from "../../../components/common/loading/Loading";
import ModalDisplayFile from "components/common/modal/display-file/ModalDisplayFile";

interface Props extends FormComponentProps {
  history: History;
  location: Location;
  match: match<{
    id: string;
  }>;
}

const CollaboratorsUpdate: React.FC<Props> = props => {
  const [loading, setLoading] = useState(true);
  const [fileLabel, setFileLabel] = useState("");
  const id = props.match.params.id;

  const [loadingModal, setLoadingModal] = useState(false);
  const [modalPassportFile, setModalPassportFile] = useState(false);
  const [filePassPort, setFilePassPort] = useState("");

  // eslint-disable-next-line
  useEffect(() => {
    const fetchModel = async () => {
      const result = await collaboratorsServices.getToUpdate(
        props.match.params.id
      );
      const colla = result.data;
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
        product: colla.product,
        relation_business: colla.relation_business,
        contract_date: ``,
        contract_number: '',
        discount: '',
        contract_type: ``
      });
      setFileLabel(colla.passport_file.name);
    };

    fetchModel();
    // eslint-disable-next-line
  }, []);

  const onDisplayfile = async () => {
    const formData = props.form.getFieldsValue();
    const data = await collaboratorsServices.previewContractFile(formData);
    return data;
  };

  const onDisplayToTrinhFile = async () => {
    const formData = props.form.getFieldsValue();
    const data = await collaboratorsServices.previewToTrinhFile(formData);
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
          blockui.runLoadingBlockUI();
          let data: any;
         
          data = await collaboratorsServices.confirmReactive(id, formData);
          if (data && data.status === 422) {
            _.forOwn(data.error, function(errors, key) {
              form.setFields({
                [key]: {
                  errors: [new Error(errors.toString())]
                }
              });
            });
          } else {
            onSuccessAction("Kích hoạt CTV thành công!", () => {
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
    <PageWrapper title="Kích hoạt lại CTV" loading={loading}>
      <Form>
        <CollaboratorsFormReactive
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
        />
      </Form>
      <ButtonReactiveGroupCollaForm onStore={onUpdate} />
    </PageWrapper>
  );
};

const CollaboratorsUpdateForm = Form.create<Props>({
  name: "CollaboratorsUpdate"
})(CollaboratorsUpdate);

export default CollaboratorsUpdateForm;
