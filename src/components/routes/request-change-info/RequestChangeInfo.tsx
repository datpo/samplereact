import {CHANGE_INFO} from "../../../helpers/enum/PermissionEnums";
import {RequestChangeInfo} from "../../../pages/request-change-info/RequestChangeInfo";
import RequestChangeInfoUpdate from "../../../pages/request-change-info/RequestChangeInfoUpdate";
import RequestChangeInfoPreview from "../../../pages/request-change-info/RequestChangeInfoPreview";
import RequestChangeInfoCreate from "../../../pages/request-change-info/RequestChangeInfoCreate";

import RequestChangeInfoAgencyUpdate from "../../../pages/request-change-info/RequestChangeInfoAgencyUpdate";
import RequestChangeInfoAgencyPreview from "../../../pages/request-change-info/RequestChangeInfoAgencyPreview";
import RequestChangeInfoAgencyCreate from "../../../pages/request-change-info/RequestChangeInfoAgencyCreate";

const REQUEST_CHANGE_INFO_ROUTES = [
    {
        component: RequestChangeInfo,
        link: "/yeu-cau-thay-doi-thong-tin",
        permission: CHANGE_INFO.ALL,
        isExact: true
    },
    {
        component: RequestChangeInfoCreate,
        link: "/yeu-cau-thay-doi-thong-tin/them-moi",
        permission: CHANGE_INFO.ALL,
        isExact: true
    },
    {
        component: RequestChangeInfoUpdate,
        link: "/yeu-cau-thay-doi-thong-tin/cap-nhat/:id",
        permission: CHANGE_INFO.ALL,
        isExact: true
    },
    {
        component: RequestChangeInfoPreview,
        link: "/yeu-cau-thay-doi-thong-tin/xem/:id",
        permission: CHANGE_INFO.ALL,
        isExact: true
    },
    {
        component: RequestChangeInfoAgencyCreate,
        link: "/yeu-cau-thay-doi-thong-tin/dai-ly/them-moi",
        permission: CHANGE_INFO.ALL,
        isExact: true
    },
    {
        component: RequestChangeInfoAgencyUpdate,
        link: "/yeu-cau-thay-doi-thong-tin/dai-ly/cap-nhat/:id",
        permission: CHANGE_INFO.ALL,
        isExact: true
    },
    {
        component: RequestChangeInfoAgencyPreview,
        link: "/yeu-cau-thay-doi-thong-tin/dai-ly/xem/:id",
        permission: CHANGE_INFO.ALL,
        isExact: true
    }
];

export default REQUEST_CHANGE_INFO_ROUTES;
