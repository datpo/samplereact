import {TransferBusinessEmployee} from "../../../pages/transfer-business-employee/TransferBusinessEmployee";
import WrappedTransferBusinessEmployeeCreate from "../../../pages/transfer-business-employee/TransferBusinessEmployeeCreate";
import WrappedTransferBusinessEmployeePreview
    from "../../../pages/transfer-business-employee/TransferBusinessEmployeePreview";

const TRANSFER_BUSINESS_EMPLOYEE_ROUTES = [
    {
        component: TransferBusinessEmployee,
        link: "/yeu-cau-chuyen-nguoi-quan-ly",
        permission: "",
        isExact: true
    },
    {
        component: WrappedTransferBusinessEmployeeCreate,
        link: "/yeu-cau-chuyen-nguoi-quan-ly/them-moi",
        permission: "",
        isExact: true
    },
    {
        component: WrappedTransferBusinessEmployeePreview,
        link: "/yeu-cau-chuyen-nguoi-quan-ly/xem-chi-tiet/:id",
        permission: "",
        isExact: true
    },
];

export default TRANSFER_BUSINESS_EMPLOYEE_ROUTES;
