import {CREATE_CERTIFICATE_PAPER} from "../../../helpers/enum/PermissionEnums";
import {CreateCertificatePaper} from "../../../pages/create-certificate-paper/CreateCertificatePaper";

const CREATE_CERTIFICATE_PAPER_ROUTES = [
    {
        component: CreateCertificatePaper,
        link: "/giay-chung-nhan",
        permission: CREATE_CERTIFICATE_PAPER.ALL,
        isExact: true
    },
];

export default CREATE_CERTIFICATE_PAPER_ROUTES;