import WrappedPreviewCTS from "../../../pages/info-certificate/preview/PreviewInfoCert";
import {InfoCertList} from "../../../pages/info-certificate/InfoCertList";


const GEN_CERT_CTS_ROUTES = [
    {
        component: InfoCertList,
        link: "/info-certificate",
        permission: "",
        isExact: true
    },
    {
        component: WrappedPreviewCTS,
        link: "/info-certificate/xem/:id",
        permission: "",
        isExact: true
    },
];

export default GEN_CERT_CTS_ROUTES;
