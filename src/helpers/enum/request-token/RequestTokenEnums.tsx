export const STATUS_REQUEST_TOKEN_LABEL = {
    1: {
      label: "Nháp",
      class: "magenta"
    },
    2: {
      label: "Chờ kế toán duyệt",
      class: "cyan"
    },
    3: {
      label: "Kế toán từ chối",
      class: "purple"
    },
    4: {
      label: "Kế toán đã duyệt",
      class: "geekblue"
    },
    5:{
        label: "Chờ HTKD duyệt",
        class: "orange"
    },
    6:{
        label: "HTKD từ chối",
        class: "red"
    },
    7:{
        label: "Đã xuất token",
        class: "green"
    }
  };
export const STATUS_REQUEST_TOKEN_GEN_CERT = {
    1:{
        label: "Hoạt động",
        class: "green"
    },
    2:{
        label: "Chờ nguyệp vụ duyệt thu hồi",
        class: "magenta"
    },
    3:{
        label: "Đã thu hồi",
        class: "geekblue"
    },
    4:{
        label: "Chờ nguyệp vụ duyệt hủy",
        class: "orange"
    },
    5:{
        label: "Đã hủy",
        class: "purple"
    },
    6:{
        label: "Chờ nguyệp vụ duyệt tạm dừng",
        class: "magenta"
    },
    7:{
        label: "Đã tạm dừng",
        class: "purple"
    },
    8:{
        label: "Đã xóa",
        class: "red"
    },
    9:{
        label: "Đã hết hạn",
        class: "orange"
    },
    10:{
        label: "Chờ CA duyệt thu hồi",
        class: "magenta"
    },
    11:{
        label: "CA từ chối thu hồi",
        class: "geekblue"
    },
    12:{
        label: "Chờ CA duyệt tạm dừng",
        class: "orange"
    },
    13:{
        label: "CA từ chối tạm dừng",
        class: "purple"
    },
  };
export const STATUS_REQUEST = {
    1:{
        label: "Yêu cầu cấp mới",
        class: "green"
    },
    2: {
      label: "Yêu cầu gia hạn",
      class: "orange"
    },
    3:{
        label: "Yêu cầu thay đổi thông tin",
        class: "blue"
    },
    4:{
        label: "Yêu cầu chuyển đổi",
        class: "red"
    }
  };

  export enum REQUEST_TOKEN_PERMISSION {
      ALL = "request-token-all",
      RA = "request-token-ra",
  }

  export enum REQUEST_STOP_COOP {
      ALL = "stop-coop-list",
  }

export class TypeToken {
    static readonly TYPEAGENCY = {
        1: "Đại lý",
        2: "Cộng tác viên",
        3: "NVKD"
    };
}
export class TypeUser {
    static readonly TYPEUSER = {
        1: "Đại lý",
        2: "Cộng tác viên"
    };
}
export const STATUS_CREATE_ACCOUNT = {
    1: {
        label: "Chưa tạo tài khoản",
        class: "magenta"
    },
    2: {
        label: "Đã tạo tài khoản",
        class: "green"
    }
}

