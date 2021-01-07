import React from "react";
import ButtonOnSave from "../../../../../components/common/form/button/ButtonOnSave";
import ButtonCancel from "../../../../../components/common/form/button/ButtonCancel";

interface Props {
  onStore: (type: number) => void;
}

const ButtonSaveGroupCollaForm: React.FC<Props> = (props) => {
  return (
    <div className="input-group d-flex justify-content-center p-5">
      <div className="">
        <ButtonOnSave onClick={() => props.onStore(1)} label="Lưu nháp" className="btn btn-primary btn-sm" />
      </div>
      <div className="">
        <ButtonOnSave onClick={() => props.onStore(2)} label="Trình duyệt" className="btn btn-success btn-sm" />
      </div>
      <div className="">
        <ButtonCancel toURL="/quan-ly-ctv" className="btn btn-default btn-sm margintop"/>
      </div>
    </div>
  );
};

export default ButtonSaveGroupCollaForm;
