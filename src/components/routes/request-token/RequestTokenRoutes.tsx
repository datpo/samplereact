import { RequestToken } from "../../../pages/request-token/RequestToken";
import WrappedRequestTokenCreate from "../../../pages/request-token/RequestTokenCreate";
import WrappedRequestTokenUpdate from "pages/request-token/RequestTokenUpdate";
import { REQUEST_TOKEN_PERMISSION } from "helpers/enum/request-token/RequestTokenEnums";
import WrappedRequestTokenPreview from "pages/request-token/RequestTokenPreview";

const REQUEST_TOKEN_ROUTES = [
  {
    component: RequestToken,
    link: "/yeu-cau-token",
    permission: REQUEST_TOKEN_PERMISSION.ALL,
    isExact: true
  },
  {
    component: WrappedRequestTokenCreate,
    link: "/yeu-cau-token/them-moi",
    permission: REQUEST_TOKEN_PERMISSION.ALL,
    isExact: true
  },
  {
    component: WrappedRequestTokenUpdate,
    link: "/yeu-cau-token/cap-nhat/:id",
    permission: REQUEST_TOKEN_PERMISSION.ALL,
    isExact: true
  },
  {
    component: WrappedRequestTokenPreview,
    link: "/yeu-cau-token/xem/:id",
    permission: REQUEST_TOKEN_PERMISSION.ALL,
    isExact: true
  }
];

export default REQUEST_TOKEN_ROUTES;
