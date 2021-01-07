import Home from "../../pages/home/Home";
import Agency from "../../pages/agency/Agency";
import {Signature} from "../../pages/signature/Signature";
import {RequestStopCustomer} from "../../pages/request-stop-customer/RequestStopCustomer";
import {RequestStopCustomerList} from "../../pages/request-stop-customer-list/RequestStopCustomerList";
import Logout from "../../pages/login/Logout";
import ChangePassword from "../../pages/change-password/ChangePassword"
import AgencyCreate from "../../pages/agency/AgencyCreate";
import AgencyUpdate from "../../pages/agency/AgencyUpdate";
import AgencyReActive from "../../pages/agency/AgencyReactive";
import AgencyApprove from "../../pages/agency/approve/AgencyPreview";
import {AgencyPermission} from "../../helpers/enum/PermissionEnums";
import {COLLABORATORS_ROUTE} from "./collaborators/CollaboratorsRoute";
import REQUEST_TOKEN_ROUTES from "./request-token/RequestTokenRoutes";
import REQUEST_TOKEN_CTS_ROUTES from "./request-token-cts/RequestTokenCTSRoutes";
import {SystemPermission} from "../../helpers/enum/SystemEnums";
import { REQUEST_STOP_COOP } from 'helpers/enum/request-token/RequestTokenEnums';
import TRANSFER_BUSINESS_EMPLOYEE_ROUTES from "./transfer-business-employee/TransferBusinessEmployeeRoutes";
import REQUEST_CTS_PERSONAL_ROUTES from "./request-cts-personal/RequestCTSPersonalRoutes";
import REQUEST_CERTIFICATE_GROUP_ROUTES from "./request-cts-group/RequestCertificateGroup";
import GEN_CERT_CTS_ROUTES from "./gen-cert-cts/GenCertCTSRoutes";
import REQUEST_CHANGE_INFO_ROUTES from "./request-change-info/RequestChangeInfo";
import CREATE_CERTIFICATE_PAPER_ROUTES from "./create-certificate-paper/CreateCertificatePaperRoute";
import CUSTOMER_ROUTES from "./customer/Customer";
import SUPPORT_ROUTES from "./support/Support";
import CONTRACT_MANAGER_ROUTE from "./contract-manager/ContractManagerRoute";
import CHANGE_INFO_CERT_ROUTES from "./customer/ChangeInfo";
import REQUEST_TRAINING_ROUTES from "./request-training/RequestTrainingRoutes";
import DOC_LEGAL_MANAGER_ROUTE from "./doc-legal-manager/DocLegalManagerRoute";
import RECONCILIATION from "./reconciliation/ReconciliationRoute";
import  Certificate  from "../datnt/Certificate";
import EditCert from "components/datnt/EditCert";
import DetailCert from "components/datnt/DetailCert";
import TemplateEmail from "components/datnt/mau-email/TemplateEmail";
import Update from "components/datnt/mau-email/update-mau-email/Update";
import AddEmail from "components/datnt/mau-email/khoi-tao-mau-email/AddEmail";
import HungDx from "components/datnt/hungdx/HungDx";

export const PRIVATE_ROUTERS_CONSTANT = [
    // ...COLLABORATORS_ROUTE,
    // ...REQUEST_TOKEN_ROUTES,
    // ...REQUEST_TOKEN_CTS_ROUTES,
    // ...TRANSFER_BUSINESS_EMPLOYEE_ROUTES,
    // ...REQUEST_CTS_PERSONAL_ROUTES,
    // ...REQUEST_CERTIFICATE_GROUP_ROUTES,
    // ...GEN_CERT_CTS_ROUTES,
    // ...REQUEST_CHANGE_INFO_ROUTES,
    // ...CREATE_CERTIFICATE_PAPER_ROUTES,
    // ...CUSTOMER_ROUTES,
    // ...SUPPORT_ROUTES,
    // ...CONTRACT_MANAGER_ROUTE,
	// ...CHANGE_INFO_CERT_ROUTES,
	// ...REQUEST_TRAINING_ROUTES,
    // ...DOC_LEGAL_MANAGER_ROUTE,
    // ...RECONCILIATION,
    {
        component: Agency,
        link: "/nhom-quyen",
        permission:"",
        isExact: true
    },
    {
        component: AgencyCreate,
        link: "/nhom-quyen/them-moi",
        permission: "",
        isExact: false
    },
    {
        component: AgencyUpdate,
        link: "/nhom-quyen/cap-nhat/:id",
        permission: AgencyPermission.UPDATE,
        isExact: false
    },
    {
        component: AgencyReActive,
        link: "/nhom-quyen/kich-hoat-lai/:id",
        isExact: false
    },
    {
        component: AgencyApprove,
        link: "/nhom-quyen/xem-chi-tiet/:id",
        isExact: false
    },
    {
        component: Logout,
        link: "/logout",
        isExact: true
    },
    {
        component: Home,
        link: "/home",
        isExact: true
    },
    {
        component: Signature,
        link: "/cau-hinh-cts",
        permission: SystemPermission.SIGN,
        isExact: false
    },
    {
        component: RequestStopCustomer,
        link: "/yeu-cau-dung-hop-tac",
        permission: SystemPermission.STOP,
        isExact: false
    },
    {
        component: RequestStopCustomerList,
        link: "/danh-sach-yeu-cau-dung-hop-tac",
        permission: REQUEST_STOP_COOP.ALL,
        isExact: false
    },
    {
        component: ChangePassword,
        link: "/doi-mat-khau",
        isExact: true
    },
    {
        component: Certificate,
        link: "/chung-thu-so",
        isExact: true,
        permission: ""
    },
    {
        component: DetailCert,
        link: "/chung-thu-so/detail",
        isExact: true,
        permission: ""
    },
    {
        component: EditCert,
        link: "/chung-thu-so/edit",
        isExact: true,
        permission: ""
    },
    {
        component: TemplateEmail,
        link: "/template-email",
        isExact: true,
        permission: ""
    },
    {
        component: Update,
        link: "/template-email/update",
        isExact: true,
        permission: ""
    },
    {
        component: AddEmail,
        link: "/template-email/add",
        isExact: true,
        permission: ""
    },
    {
        component: HungDx,
        link: "/hung-dx",
        isExact: true,
        permission: ""
    },
];

