import {RequestCTSPersonal} from "../../../pages/request-cts-personal/RequestCTSPersonal";
import WrappedRequestCTSPersonalUpdate from "../../../pages/request-cts-personal/RequestCTSPersonalUpdate";
import WrappedRequestCTSPersonalPreview from "../../../pages/request-cts-personal/RequestCTSPersonalPreview";
import WrappedRequestCTSPersonalCreate from "../../../pages/request-cts-personal/RequestCTSPersonalCreate";

const REQUEST_CTS_PERSONAL_ROUTES = [
    {
        component: RequestCTSPersonal,
        link: "/yeu-cau-cts-ca-nhan",
        permission: "request-digital-certificate",
        isExact: true
    },
    {
        component: WrappedRequestCTSPersonalCreate,
        link: "/yeu-cau-cts-ca-nhan/them-moi",
        permission: "request-digital-certificate",
        isExact: true
    },
    {
        component: WrappedRequestCTSPersonalUpdate,
        link: "/yeu-cau-cts-ca-nhan/cap-nhat/:id",
        permission: "request-digital-certificate",
        isExact: true
    },
    {
        component: WrappedRequestCTSPersonalPreview,
        link: "/yeu-cau-cts-ca-nhan/xem/:id",
        permission: "request-digital-certificate",
        isExact: true
    },
];

export default REQUEST_CTS_PERSONAL_ROUTES;
