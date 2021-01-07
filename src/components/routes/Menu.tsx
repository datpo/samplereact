import {
    AgencyPermission,
    CHANGE_MANAGER_CUSTOMER,
    CollaboratorsPermission,
    CHANGE_INFO,
    REQUEST_DIGITAL_CERTIFICATE_PERMISSION, REQUEST_GEN_TOKEN_CERTIFICATE_PERMISSION, CREATE_CERTIFICATE_PAPER,
    CONTRACT_MANAGER, DOC_LEGAL_MANAGER
} from "../../helpers/enum/PermissionEnums";
import {
    REQUEST_STOP_COOP,
    REQUEST_TOKEN_PERMISSION
} from "helpers/enum/request-token/RequestTokenEnums";
import {SystemPermission} from "../../helpers/enum/SystemEnums";

export const MENU_CONSTANT = [
    {
        link: "manager-co-operate",
        icon: "setting",
        displayName: "Hệ Thống",
        key: "system",
        permission: "",
        childMenu: [
            {
                link: "/nhom-quyen",
                childIcon: "key",
                displayName: "Nhóm Quyền",
                permission: "",
                key: "agency"
            },
            {
                link: "/template-email",
                childIcon: "inbox",
                displayName: "Mẫu Email",
                permission: "",
                key: "ctv"
            },
            {
                link: "/chung-thu-so",
                childIcon: "reconciliation",
                displayName: "Chứng thư số",
                permission: "",
                key: ""
            },
            {
                link: "/hung-dx",
                childIcon: "reconciliation",
                displayName: "Hưng DX",
                permission: "",
                key: ""
            }
            
        ]
    },
    // {
    //     link: "",
    //     icon: "shopping-cart",
    //     displayName: "Quản lý bán hàng",
    //     key: "system-qlbh",
    //     permission: "menu-manager-sale",
    //     childMenu: [
    //         {
    //             link: "/yeu-cau-cts-ca-nhan",
    //             childIcon: "solution",
    //             displayName: "Yêu cầu CTS cá nhân",
    //             permission: REQUEST_DIGITAL_CERTIFICATE_PERMISSION.ALL,
    //             key: "request-cts-personal"
    //         },
    //         {
    //             link: "/yeu-cau-cts-to-chuc",
    //             childIcon: "solution",
    //             displayName: "Yêu cầu CTS tổ chức",
    //             permission: REQUEST_DIGITAL_CERTIFICATE_PERMISSION.ALL,
    //             key: "request-cts-group"
    //         },
    //         {
    //             link: "/info-certificate",
    //             childIcon: "solution",
    //             displayName: "Danh sách chứng thư số",
    //             permission: REQUEST_GEN_TOKEN_CERTIFICATE_PERMISSION.ALL,
    //             key: "gen-cts"
    //         },
    //         {
    //             link: "/giay-chung-nhan",
    //             childIcon: "solution",
    //             displayName: "QL giấy chứng nhận",
    //             permission: CREATE_CERTIFICATE_PAPER.ALL,
    //             key: "certificate-paper"
    //         },
    //         {
    //             link: "/danh-sach-dieu-chinh-thong-tin",
    //             childIcon: "solution",
    //             displayName: "QL điều chỉnh thông tin",
    //             permission: 'list-change-info-cert',
    //             key: "list-change-info-cert"
    //         }
    //     ]
    // },
    // {
    //     link: "support-sale",
    //     icon: "customer-service",
    //     displayName: "Hỗ trợ bán hàng",
    //     key: "support-sale",
    //     permission: "menu-support-sale",
    //     childMenu: [
    //         {
    //             link: "/yeu-cau-token-cts",
    //             childIcon: "usb",
    //             displayName: "Yêu cầu tài liệu bán hàng",
    //             permission: 'request-token-all',
    //             key: "support-sale-request-token"
    //         },
    //         {
    //             link: "/yeu-cau-dao-tao",
    //             childIcon: "wechat",
    //             displayName: "Yêu cầu đào tạo",
    //             permission: 'request-training',
    //             key: "support-sale-training"
    //         }
    //     ]
    // },
    // {
    //     link: "",
    //     icon: "profile",
    //     displayName: "Quản lý hồ sơ",
    //     key: "manager-file-certificate",
    //     permission: "menu-manager-file",
    //     childMenu: [
    //         {
    //             link: "/quan-ly-hop-dong",
    //             childIcon: "file-text",
    //             displayName: "Quản lý hợp đồng",
    //             permission: CONTRACT_MANAGER.ALL,
    //             key: "manager-contract"
    //         },
    //         {
    //             link: "/quan-ly-ho-so-phap-ly",
    //             childIcon: "file-done",
    //             displayName: "Quản lý hồ sơ pháp lý",
    //             permission: DOC_LEGAL_MANAGER.ALL,
    //             key: "manager-file-legal"
    //         }
    //     ]
    // },
    // {
    //     link: "",
    //     icon: "usergroup-add",
    //     displayName: "Quản lý khách hàng",
    //     key: "manager-customer",
    //     permission: "menu-manager-customer",
    //     childMenu: [
    //         {
    //             link: "/danh-sach-khach-hang",
    //             childIcon: "solution",
    //             displayName: "Danh sách khách hàng",
    //             permission: "list-customer",
    //             key: "manager-customer-list"
    //         }
    //     ]
    // },
    // {
    //     link: "",
    //     icon: "reconciliation",
    //     displayName: "Đối soát",
    //     key: "reconciliation ",
    //     permission: "menu-reconciliation",
    //     childMenu: [
    //         {
    //             link: "/danh-sach-doi-soat",
    //             childIcon: "reconciliation",
    //             displayName: "Danh sách đối soát",
    //             permission: "reconciliation",
    //             key: "reconciliation-list"
    //         },
    //     ]
    // },
    // {
    //     link: "",
    //     icon: "setting",
    //     displayName: "Hệ thống",
    //     key: "system-config",
    //     permission: "menu-system",
    //     childMenu: [
    //         {
    //             link: "/cau-hinh-cts",
    //             childIcon: "setting",
    //             displayName: "Cấu hình CTS",
    //             permission: String(SystemPermission.SIGN),
    //             key: "signature"
    //         }
    //     ]
    // },
    // {
    //     link: "",
    //     icon: "phone",
    //     displayName: "Hỗ trợ",
    //     key: "support",
    //     permission: "",
    //     childMenu: [
    //         {
    //             link: "/ho-tro-tai-lieu",
    //             childIcon: "book",
    //             displayName: "Văn bản",
    //             permission: "",
    //             key: "support-document"
    //         },
    //         {
    //             link: "/ho-tro-phan-mem",
    //             childIcon: "file-zip",
    //             displayName: "Phần mềm",
    //             permission: "",
    //             key: "support-software"
    //         }
    //     ]
    // }
];
