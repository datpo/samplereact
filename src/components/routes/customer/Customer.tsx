import {List} from "../../../pages/customer/List";
import WrappedChangeInfoOrganization from "../../../pages/customer/ChangeInfoOrganization";
import WrappedChangeInfoPersonal from "../../../pages/customer/ChangeInfoPersonal";
import WrappedPreviewPersonal from "../../../pages/customer/PreviewPersonal";
import WrappedPreviewOrganization from "../../../pages/customer/PreviewOrganization";

const CUSTOMER_ROUTES = [
    {
        component: List,
        link: "/danh-sach-khach-hang",
        permission: '',
        isExact: true
    },
    {
        component: WrappedChangeInfoPersonal,
        link: "/danh-sach-khach-hang/thay-doi-thong-tin-ca-nhan/:id",
        permission: '',
        isExact: true
    },
    {
        component: WrappedChangeInfoOrganization,
        link: "/danh-sach-khach-hang/thay-doi-thong-tin-to-chuc/:id",
        permission: '',
        isExact: true
    },
    {
        component: WrappedPreviewPersonal,
        link: "/danh-sach-khach-hang/chi-tiet-ca-nhan/:id",
        permission: '',
        isExact: true
    },
    {
        component: WrappedPreviewOrganization,
        link: "/danh-sach-khach-hang/chi-tiet-to-chuc/:id",
        permission: '',
        isExact: true
    }
];

export default CUSTOMER_ROUTES;
