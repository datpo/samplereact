import WrappedRequestTrainingCreate from "../../../pages/request-training/create/RequestTrainingCreate";
import {RequestTraining} from "../../../pages/request-training/list/RequestTrainingList";
import WrappedRequestTrainingPreview from "../../../pages/request-training/preview/RequestTrainingPreview";
import WrappedRequestTrainingUpdate from "../../../pages/request-training/update/RequestTrainingUpdate";

const REQUEST_TRAINING_ROUTES = [
    {
        component: RequestTraining,
        link: "/yeu-cau-dao-tao",
        permission: "request-training",
        isExact: true
    },
    {
        component: WrappedRequestTrainingCreate,
        link: "/yeu-cau-dao-tao/them-moi",
        permission: "",
        isExact: true
    },
    {
        component: WrappedRequestTrainingUpdate,
        link: "/yeu-cau-dao-tao/cap-nhat/:id",
        permission: "",
        isExact: true
    },
    {
        component: WrappedRequestTrainingPreview,
        link: "/yeu-cau-dao-tao/xem/:id",
        permission: "",
        isExact: true
    }
];

export default REQUEST_TRAINING_ROUTES;
