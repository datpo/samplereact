import {DOC_LEGAL_MANAGER} from "../../../helpers/enum/PermissionEnums";
import {DocLegalManager} from "../../../pages/doc-legal-manager/DocLegalManager";

const DOC_LEGAL_MANAGER_ROUTE = [
    {
        component: DocLegalManager,
        link: "/quan-ly-ho-so-phap-ly",
        permission: DOC_LEGAL_MANAGER.ALL,
        isExact: true
    },
];

export default DOC_LEGAL_MANAGER_ROUTE;