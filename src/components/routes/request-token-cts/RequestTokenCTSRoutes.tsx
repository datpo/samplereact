import {RequestTokenCTS} from "../../../pages/request-token-cts/RequestTokenCTS";
import WrappedRequestTokenCTSCreate from "../../../pages/request-token-cts/RequestTokenCTSCreate";
import WrappedRequestTokenCTSUpdate from "../../../pages/request-token-cts/RequestTokenCTSUpdate";
import WrappedRequestTokenCTSPreview from "../../../pages/request-token-cts/RequestTokenCTSPreview";

const REQUEST_TOKEN_CTS_ROUTES = [
    {
        component: RequestTokenCTS,
        link: "/yeu-cau-token-cts",
        permission: "",
        isExact: true
    },
    {
        component: WrappedRequestTokenCTSCreate,
        link: "/yeu-cau-token-cts/them-moi",
        permission: "",
        isExact: true
    },
    {
        component: WrappedRequestTokenCTSUpdate,
        link: "/yeu-cau-token-cts/cap-nhat/:id",
        permission: "",
        isExact: true
    },
    {
        component: WrappedRequestTokenCTSPreview,
        link: "/yeu-cau-token-cts/xem/:id",
        permission: "",
        isExact: true
    }
];

export default REQUEST_TOKEN_CTS_ROUTES;
