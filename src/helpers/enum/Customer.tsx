export const STATUS_REQUEST_TOKEN_GEN_CERT = {
    4: {
      label: "Chưa gen cert",
      class: "badge-warning"
    },
    5:{
        label: "Đã gen cert",
        class: "badge-success"
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
        2: "Cộng tác viên"
    };
}

