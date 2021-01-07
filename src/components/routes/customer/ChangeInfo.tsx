import {List} from "../../../pages/change-info-cert/List";
import WrappedChangeInfoOrganization from "../../../pages/change-info-cert/ChangeInfoOrganization";
import WrappedChangeInfoPersonal from "../../../pages/change-info-cert/ChangeInfoPersonal";
import WrappedPreviewPersonal from "../../../pages/change-info-cert/PreviewPersonal";
import WrappedPreviewOrganization from "../../../pages/change-info-cert/PreviewOrganization";

const CHANGE_INFO_CERT_ROUTES = [
    {
        component: List,
        link: "/danh-sach-dieu-chinh-thong-tin",
        permission: '',
        isExact: true
    },
    {
        component: WrappedChangeInfoPersonal,
        link: "/danh-sach-dieu-chinh-thong-tin/cap-nhat-ca-nhan/:id",
        permission: '',
        isExact: true
    },
    {
        component: WrappedChangeInfoOrganization,
        link: "/danh-sach-dieu-chinh-thong-tin/cap-nhat-to-chuc/:id",
        permission: '',
        isExact: true
    },
    {
        component: WrappedPreviewPersonal,
        link: "/danh-sach-dieu-chinh-thong-tin/chi-tiet-ca-nhan/:id",
        permission: '',
        isExact: true
    },
    {
        component: WrappedPreviewOrganization,
        link: "/danh-sach-dieu-chinh-thong-tin/chi-tiet-to-chuc/:id",
        permission: '',
        isExact: true
    }
];

export default CHANGE_INFO_CERT_ROUTES;
