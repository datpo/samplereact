import React from "react";
import ActionButton from "../../../../components/common/form/button/action/ActionButton";

interface Props {
  onClickUpdate?: any;
  onClickUpload?: any;
  onClickGenCert?: any;
  onClickReActive?: any;
  onClickDelete?: any;
  onClickPreviewButton?: any;
  onClickConfirmButton?: any;
  onClickRequestStopButton?: any;
  onConfirmDestroy?: any;
  permissionDelete?: boolean;
  permissionUpdate?: string;
  permissionGenCert?: string;
  permissionUpload?: string;
  permissionConfirm?: string;
  permissionRequestStop?: string;
  mesDelete?: string;
  mesStop?: string;
  mesConfrim?: string;
  mesConfirmDestroy?: string;
  onClickChangeInfoCustomer?: any;
  onClickDownload?: any;
  onClickDownloadPlugin?: any;
  onClickDownloadCertificate?: any;
  permissionDownloadCert? : boolean;
  onClickApprove?: any;
  permissionApprove? : boolean;
  onClickDeny?: any;
  permissionDeny? : boolean;
}

export default function TableActionButton(props: Props) {
  return (
    <div className="row justify-content-center">
      {props.onClickPreviewButton ? (
        <ActionButton
          type="primary"
          icon="fa-eye"
          onClick={
            props.onClickPreviewButton ? props.onClickPreviewButton : () => {}
          }
          title="Xem chi tiết"
        />
      ) : (
        ""
      )}
      {props.onClickApprove && props.permissionApprove ? (
          <ActionButton
              type="primary"
              icon="fa-check-circle"
              onClick={
                props.onClickApprove ? props.onClickApprove : () => {}
              }
              title="Duyệt"
          />
      ) : (
          ""
      )}
      {props.onClickDeny && props.permissionDeny ? (
          <ActionButton
              type="danger"
              icon="fa-ban"
              onClick={
                props.onClickDeny ? props.onClickDeny : () => {}
              }
              title="Từ chối"
          />
      ) : (
          ""
      )}
      {props.onClickUpdate ? (
        <ActionButton
          type="primary"
          icon="fa-edit"
          onClick={props.onClickUpdate ? props.onClickUpdate : () => {}}
          title="Cập nhật"
        />
      ) : (
        ""
      )}
      {props.onClickUpload ? (
        <ActionButton
          type="primary"
          icon="fa-upload"
          onClick={props.onClickUpload ? props.onClickUpload : () => {}}
          title="Tải file hồ sơ"
        />
      ) : (
        ""
      )}
      {props.onClickReActive ? (
        <ActionButton
          type="primary"
          icon="fa-sync-alt"
          onClick={props.onClickReActive ? props.onClickReActive : () => {}}
          title="Kích hoạt lại"
        />
      ) : (
        ""
      )}
      {props.onClickGenCert ? (
        <ActionButton
          type="primary"
          icon="fa-sync"
          onClick={props.onClickGenCert ? props.onClickGenCert : () => {}}
          title="Gen Cert"
        />
      ) : (
        ""
      )}
      {props.onClickDelete ? (
        <ActionButton
          type="danger"
          icon="fa-trash-alt"
          onClick={props.onClickDelete ? props.onClickDelete : () => {}}
          title="Xóa"
          customMessage={props.mesDelete}
          isDeleteButton={true}
          // permission={props.permissionDelete}
        />
      ) : (
        ""
      )}

      {props.permissionConfirm ? (
        <ActionButton
          type="primary"
          icon="fa-check-circle"
          onClick={
            props.onClickConfirmButton ? props.onClickConfirmButton : () => {}
          }
          title="Duyệt"
          isDeleteButton={true}
          customMessage={props.mesConfrim}
        />
      ) : (
        ""
      )}

      {props.onConfirmDestroy ? (
        <ActionButton
          type="primary"
          icon="fa-check-circle"
          onClick={
            props.onConfirmDestroy ? props.onConfirmDestroy : () => {}
          }
          title="Duyệt"
          isDeleteButton={true}
          customMessage={props.mesConfirmDestroy}
        />
      ) : (
        ""
      )}

      {props.onClickRequestStopButton ? (
        <ActionButton
          type="primary"
          icon="fas fa-user-lock"
          onClick={
            props.onClickRequestStopButton ? props.onClickRequestStopButton : () => {}
          }
          title="Dừng hợp tác"
        />
      ) : (
        ""
      )}

    {props.onClickChangeInfoCustomer ? (
        <ActionButton
          type="primary"
          icon="fas fa-sync"
          onClick={
            props.onClickChangeInfoCustomer ? props.onClickChangeInfoCustomer : () => {}
          }
          title="Thay đổi thông tin"
        />
      ) : (
        ""
      )}

      {props.onClickDownload ? (
        <ActionButton
          type="primary"
          icon="fa-download"
          onClick={props.onClickDownload ? props.onClickDownload : () => {}}
          title="Tải xuống"
        />
      ) : (
        ""
      )}
      {props.onClickDownloadPlugin ? (
        <ActionButton
          type="primary"
          icon="fa-download"
          onClick={props.onClickDownloadPlugin ? props.onClickDownloadPlugin : () => {}}
          title="Tải xuống plugin"
        />
      ) : (
        ""
      )}
      {props.permissionDownloadCert === true && props.onClickDownloadCertificate ? (
          <a href ="#/" className="pointer text-primary" title="Tải xuống chứng thư số" onClick={props.onClickDownloadCertificate ? props.onClickDownloadCertificate : () => {}}>
            <i className="ml-2 fa fa-download fa-lg"></i>
          </a>
      ) : (
        ""
      )}
    </div>
  );
}
