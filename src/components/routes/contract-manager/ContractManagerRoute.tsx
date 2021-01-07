import {CONTRACT_MANAGER} from "../../../helpers/enum/PermissionEnums";
import {ContractManager} from "../../../pages/contract-manager/ContractManager";

const CONTRACT_MANAGER_ROUTE = [
    {
        component: ContractManager,
        link: "/quan-ly-hop-dong",
        permission: CONTRACT_MANAGER.ALL,
        isExact: true
    },
];

export default CONTRACT_MANAGER_ROUTE;