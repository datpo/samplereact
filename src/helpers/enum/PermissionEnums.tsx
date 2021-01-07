export enum AgencyPermission {
  CREATE = "agency-create",
  UPDATE = "agency-update",
  LIST = "agency-list",
  DELETE = "agency-delete",
  STOP = "agency-stop-coop",
  REACTIVE = "reactive-customer-agency",
  VIEW = "view-detail-agency",
}

export enum CollaboratorsPermission {
  CONFIRM = "contributor-confirm",
  CREATE = "contributor-create",
  UPDATE = "contributor-update",
  LIST = "contributor-list",
  DELETE = "contributor-delete",
  STOP = "contributor-stop-coop",
  REACTIVE = "reactive-customer-contributor",
  VIEW = "view-detail-contributor",
}
export enum CHANGE_MANAGER_CUSTOMER {
    ALL = "request-change-manager-customer",
}

export enum CHANGE_INFO {
    ALL = "request-change-info",
}
export enum REQUEST_DIGITAL_CERTIFICATE_PERMISSION {
  ALL = "request-digital-certificate"
}
export enum REQUEST_GEN_TOKEN_CERTIFICATE_PERMISSION {
  ALL = "request-gen-token-certificate"
}
export enum CREATE_CERTIFICATE_PAPER {
    ALL = "create-certificate-paper"
}
export enum CONTRACT_MANAGER {
    ALL = "contract-manager-sale"
}
export enum DOC_LEGAL_MANAGER {
    ALL = "doc-legal-manager-sale"
}