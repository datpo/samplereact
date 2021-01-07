import React, { useState, useEffect } from "react";
import PageWrapper from "../../wrapper/PageWrapper";
import CollaboratorsFormCreate from "../create/form/CollaboratorsFormCreate";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { collaboratorsServices } from "../../../services/collaborators/CollaboratorsServies";
import moment from "moment";
import { match } from "react-router";
import CollaFormCreateContractType from "../create/form/contract-type-row/CollaFormCreateContractType";
import AgencyApproveFormModalReason from "../../agency/approve/form/modal/AgencyApproveFormModalReason";
import ButtonCancel from "../../../components/common/form/button/ButtonCancel";
import ButtonDecline from "../../../components/common/form/button/ButtonDecline";
import ButtonOnSave from "../../../components/common/form/button/ButtonOnSave";
import { AgencyEnum } from "../../agency/enum/AgencyEnum";
import { UserEnum } from "../../../helpers/enum/UserEnums";
import { onSuccessAction, onFailAction } from "../../../helpers/SwalCommon";
import { History } from "history";
import { loading as blockui } from "../../../components/common/loading/Loading";
import ModalDisplayFile from "components/common/modal/display-file/ModalDisplayFile";
import InputWithLabel from './../../../components/common/form/input-with-label/InputWithLabel';

interface Props extends FormComponentProps {
  history: History;
  location: Location;
  match: match<{
    id: string;
  }>;
  user: any;
}

const CollaboratorsPreview: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);
  const [fileLabel, setFileLabel] = useState("");
  const [loadingButtonModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [collaStatus, setCollaStatus] = useState(0);

  const [loadingModal, setLoadingModal] = useState(false);
  const [modalPassportFile, setModalPassportFile] = useState(false);
  const [filePassPort, setFilePassPort] = useState("");

  const [reason, setReason] = useState({
    reason_manager: '',
    reason_htkd: '',
    status: "",
  });



  const id = props.match.params.id;

  useEffect(() => {
    const fetchModel = async () => {
      setLoading(true);
      const result = await collaboratorsServices.getToPreview(id);
      const colla = result.data;
      setLoading(false);

      setReason({
        ...reason,      
        reason_manager: colla.history_deny_manager ? colla.history_deny_manager.content: '',
        reason_htkd: colla.history_deny_manager ? colla.history_deny_manager.content: '',
        status: colla.status ? String(colla.status) : '',
      });

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
        sortname: colla.sortname,
        job: colla.job,
        cooperate_capacity: colla.cooperate_capacity,
        competitive_area: colla.competitive_area,
        is_cooperate: colla.is_cooperate,
        supply_capacity: colla.supply_capacity,
        contract_date: colla.contract_file.contract_date
          ? moment(colla.contract_file.contract_date)
          : null,
        contract_number: colla.contract_file.code,
        discount: colla.discount_rate.value,
        contract_type: `${colla.type}`,
        relation_business: colla.relation_business,
        product: colla.product,
      });
      setCollaStatus(colla.status);
      setFileLabel(colla.passport_file.name);
    };
    fetchModel();
    // eslint-disable-next-line
  }, []);

  const onDisplayDocument = async (type) => {
    const data = await collaboratorsServices.getDocument(id, type);
    return data;
  };

  const onCancelModal = () => {
    setModalVisible(false);
  };

  const onClickDecline = () => {
    setModalVisible(true);
  };

  const onOkModal = async (value) => {
    try {
      blockui.runLoadingBlockUI();
      await collaboratorsServices.decline({ reason: value }, id);
      onSuccessAction("Từ chối đại lý thành công!", () =>
        props.history.push("/quan-ly-ctv")
      );
      setModalVisible(false);
    } catch (error) {
      onFailAction("Có lỗi xảy ra khi từ chối!");
    } finally {
      blockui.stopRunLoading();
    }
  };

  const onApproveCollaborators = async () => {
    try {
      blockui.runLoadingBlockUI();
      await collaboratorsServices.confirm(id);
      onSuccessAction("Duyệt CTV lý thành công!", () =>
        props.history.push("/quan-ly-ctv")
      );
      setModalVisible(false);
    } catch (error) {
      onFailAction("Có lỗi xảy ra khi duyệt hồ sơ!");
    } finally {
      blockui.stopRunLoading();
    }
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

  return (
    <PageWrapper title="Xem chi tiết CTV" loading={loading}>
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
          disable={true}
          onClickDownloadFile={onDownloadFile}
        />
        <CollaFormCreateContractType
          onClickContractFile={() => onDisplayDocument(2)}
          onClickToTrinhFile={() => onDisplayDocument(1)}
          form={props.form}
          disabled={true}
          id = {id}
        />
      </Form>
      <ModalDisplayFile
        titleModal="File CMND/Hộ chiếu"
        visibleModal={modalPassportFile}
        loadingModal={loadingModal}
        fileBase64={filePassPort}
        onOkModal={onOkModalPassPort}
      />
      <AgencyApproveFormModalReason
        modalVisible={modalVisible}
        onCancelModelDecline={onCancelModal}
        onOkModalDecline={onOkModal}
        loading={loadingButtonModal}
      />
      <div className="input-group pt-2d-flex justify-content-center p-5">
        {collaStatus === AgencyEnum.STATUS_WAITING_APPROVE &&
        props.user.type === UserEnum.TYPE_BUSINESS_SUPPORT ? (
          <React.Fragment>
            <div className="">
              <ButtonOnSave label="Duyệt" onClick={onApproveCollaborators} />
            </div>
            <div className="">
              <ButtonDecline label="Từ chối" onClick={onClickDecline} />
            </div>
          </React.Fragment>
        ) : (
          ""
        )}
        <div className="">
          <ButtonCancel toURL="/quan-ly-ctv" />
        </div>
      </div>
    </PageWrapper>
  );
};

const CollaboratorsPreviewForm = Form.create<Props>({
  name: "CollaFormCreate",
})(CollaboratorsPreview);

export default CollaboratorsPreviewForm;
