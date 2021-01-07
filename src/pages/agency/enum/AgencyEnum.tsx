export const CONTRACT_TYPE_OPTIONS = {
  2: "Hợp đồng điện tử",
  1: "Hợp đồng giấy"
};

export const STATUS_LABEL_CLASS = {
  1: {
    label: "Nháp",
    class: "magenta"
  },
  2: {
    label: "Chờ duyệt",
    class: "cyan"
  },
  3: {
    label: "HTKD Từ chối",
    class: "red"
  },
  4: {
    label: "HTKD Đã duyệt",
    class: "geekblue"
  },
  5: {
    label: "Giám đốc từ chối",
    class: "red"
  },
  6: {
    label: "Hoạt động",
    class: "green"
  },
  7: {
    label: "Đang xử lý dừng hợp tác",
    class: "orange"
  },
  8: {
    label: "Đã dừng",
    class: "red"
  }
};

export const STATUS_OPTIONS = {
  1: "Nháp",
  2: "Chờ duyệt",
  3: "Từ chối",
  4: "HTKD Đã duyệt",
  5: "Giám đốc từ chối",
  6: "Hoạt động",
  7: "Đang xử lý dừng hợp tác",
  8: "Đã dừng",
};

export enum AgencyEnum {
  STATUS_WAITING_APPROVE = 2,
  STATUS_DRAFT = 1,
  STATUS_REJECTED = 3,
  STATUS_DIRECTOR_REJECTED = 5,
  STATUS_ACTIVE = 6,
  STATUS_PROCESS_STOP = 7,
  STATUS_STOPED = 8,

  DIGITAL_CONTRACT = 2,
  PAPER_CONTRACT = 1
}

export const AgencyRules = {
  code: [
    {
      required: true,
      message: "Mã đại lý không thể bỏ trống!"
    }
  ],
  tax_code: [
    {
      required: true,
      message: "Mã số thuế không thể bỏ trống!"
    }
  ],
  deputy: [{}]
};

export const AGENCY_CONTACT = {
  1: "Ban lãnh đạo",
  2: "Kinh doanh",
  3: "Kỹ thuật nghiệp vụ",
  4: "Hỗ trợ khách hàng",
  5: "Kế toán"
};

export enum AGENCY_CONACT_TYPE_ENUM {
  DIRECTORS = 1,
  BUSINESS = 2,
  SKILL_BUSINESS = 3,
  CUSTOMER_SUPPORT = 4,
  ACCOUNTANT = 5
}
