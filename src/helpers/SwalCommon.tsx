import swal from "sweetalert";

export const onDeleteAlert = onYesAction => {
  swal({
    title: "Bạn có chắc chắn xóa bản ghi này ?",
    text: "Nếu xóa sẽ không thể khôi phục bản ghi!!",
    icon: "warning",
    buttons: ["Hủy", "Đồng ý"],
    dangerMode: true
  }).then(onYesAction);
};

export const onSuccessAction = (text: string, afterClosed: any = () => {}) => {
  swal({
    title: "Thành công!",
    text: text,
    icon: "success",
    dangerMode: false
  }).then(afterClosed);
  // alert("Success")
};

export const onFailAction = (text: string, afterClosed: any = () => {}, icon?:string, title?:string) => {
  swal({
    title: title ? title : "",
    text: text,
    icon: icon ? icon : "error",
    dangerMode: true
  }).then(afterClosed);
};
