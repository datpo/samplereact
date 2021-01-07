import React, { useState } from "react";
import { Form } from "antd";
import AgencyInfoRow from "../../form/create/input-row/AgencyInfoRow";
import { WrappedFormUtils } from "antd/lib/form/Form";
import DeputyInfoRow from "../../form/create/input-row/DeputyInfoRow";
import OfficeInfoRow from "../../form/create/input-row/OfficeInfoRow";
import LeadershipInfoRow from "../../form/create/input-row/LeadershipInfoRow";
import ContractInfoRow from "../../form/create/input-row/ContractInfoRow";
import AgencyPreviewButtonGroup from "../button-group/AgencyPreviewButtonGroup";
import AntModal from "../../../../components/common/modal/AntModal";
import { AgencyService } from "../../../../services/agency/AgencyServices";
import { onFailAction } from "../../../../helpers/SwalCommon";

interface Props {
  form: WrappedFormUtils;
  agencyModel: any;
}

const AgencyApproveForm: React.FC<Props> = props => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);

  const onOkModal = () => {
    setVisibleModal(false);
  }

  const onClickWatchFile = () =>{
    setVisibleModal(true);
    setLoading(true);
    const agencyServices = new AgencyService();
    agencyServices.getGPKD(props.agencyModel.id).then((data)=>{
      setFile(data.file);
      setLoading(false);
    }).catch(()=>{
      onFailAction("Có lỗi xảy ra khi xem file");
    })
  }

  return (
    <Form>
      <AgencyInfoRow disable={true} form={props.form} />
      <DeputyInfoRow disable={true} form={props.form} />
      <OfficeInfoRow disable={true} form={props.form} />
      <LeadershipInfoRow disable={true} form={props.form} />
      <ContractInfoRow
        disable={true}
        form={props.form}
        file_gpkd={props.agencyModel.file_g_p_k_d}
        onClickDownloadFile={onClickWatchFile}
      />

      <AntModal
        visible={visibleModal}
        loading={loading}
        className="w-75 h-75"
        bodyStyle={{ height: "700px" }}
        style={{ top: "20px" }}
        onCLickOk={onOkModal}
      >
        <iframe
          title="Quản lý hợp đồng"
          src={`data:application/pdf;base64,${file}`}
          height="100%"
          width="100%"
        ></iframe>
      </AntModal>

      <AgencyPreviewButtonGroup id={props.agencyModel.id} form={props.form} />
    </Form>
  );
};

export default AgencyApproveForm;
