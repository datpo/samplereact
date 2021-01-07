import React from "react";
import ButtonCancel from "../../../../components/common/form/button/ButtonCancel";
import ButtonOnSave from "../../../../components/common/form/button/ButtonOnSave";
import ButtonDecline from "../../../../components/common/form/button/ButtonDecline";
import { AgencyEnum } from "../../enum/AgencyEnum";
import { UserEnum } from "../../../../components/../helpers/enum/UserEnums";

interface Props {
  onAcceptAgency: () => void;
  onClickDecline: () => void;
  agencyStatus: any;
  user:any;
}

function AgencyApproveButtonGroupSave(props: Props) {
  return (
    <div className="input-group d-flex justify-content-center p-5">
      {props.agencyStatus === AgencyEnum.STATUS_WAITING_APPROVE && props.user.type === UserEnum.TYPE_BUSINESS_SUPPORT ? (
        <React.Fragment>
          <div className="">
            <ButtonOnSave label="Duyệt" onClick={props.onAcceptAgency} className="btn btn-success btn-sm" />
          </div>
          <div className="">
            <ButtonDecline label="Từ chối" onClick={props.onClickDecline} className="btn btn-danger btn-sm" />
          </div>
        </React.Fragment>
      ) : (
        ""
      )}
      <div className="cancel">
        <ButtonCancel toURL="/quan-ly-dai-ly" className="btn btn-default btn-sm"/>
      </div>
    </div>
  );
}

export default AgencyApproveButtonGroupSave;
