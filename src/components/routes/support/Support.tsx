import {Document} from "../../../pages/support/Document";
import {Software} from "../../../pages/support/Software";

const SUPPORT_ROUTES = [
    {
        component: Document,
        link: "/ho-tro-tai-lieu",
        permission: '',
        isExact: true
    },
    {
        component: Software,
        link: "/ho-tro-phan-mem",
        permission: '',
        isExact: true
    }
];

export default SUPPORT_ROUTES;
