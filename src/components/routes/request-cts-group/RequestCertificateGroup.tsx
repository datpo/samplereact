import {RequestCertificateGroup} from "../../../pages/request-cts-group/RequestCertificateGroup";
import WrappedCertificateGroupUpdate from "../../../pages/request-cts-group/RequestCertificateGroupUpdate";
import WrappedCertificateGroupPreview from "../../../pages/request-cts-group/RequestCertificateGroupPreview";
import WrappedCertificateGroupCreate from "../../../pages/request-cts-group/RequestCertificateGroupCreate";

const REQUEST_CTS_PERSONAL_ROUTES = [
    {
        component: RequestCertificateGroup,
        link: "/yeu-cau-cts-to-chuc",
        permission: "request-digital-certificate",
        isExact: true
    },
    {
        component: WrappedCertificateGroupCreate,
        link: "/yeu-cau-cts-to-chuc/them-moi",
        permission: "request-digital-certificate",
        isExact: true
    },
    {
        component: WrappedCertificateGroupUpdate,
        link: "/yeu-cau-cts-to-chuc/cap-nhat/:id",
        permission: "request-digital-certificate",
        isExact: true
    },
    {
        component: WrappedCertificateGroupPreview,
        link: "/yeu-cau-cts-to-chuc/xem/:id",
        permission: "request-digital-certificate",
        isExact: true
    }
];

export default REQUEST_CTS_PERSONAL_ROUTES;
