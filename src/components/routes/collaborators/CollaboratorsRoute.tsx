import Collaborators from "../../../pages/collaborators/Collaborators";
import CollaboratorsCreate from "../../../pages/collaborators/create/CollaboratorsCreate";
import CollaboratorsUpdateForm from "../../../pages/collaborators/update/CollaboratorsUpdate";
import CollaboratorsReactiveForm from "../../../pages/collaborators/reactive/CollaboratorsReactive";
import CollaboratorsPreviewForm from "../../../pages/collaborators/preview/CollaboratorsPreview";

export const COLLABORATORS_ROUTE = [
  {
    component: Collaborators,
    link: "/quan-ly-ctv",
    permission: "",
    isExact: true
  },
  {
    component: CollaboratorsCreate,
    permission: "",
    link: "/quan-ly-ctv/them-moi"
  },
  {
    component: CollaboratorsUpdateForm,
    permission:"",
    link:"/quan-ly-ctv/cap-nhat/:id"
  },
  {
    component: CollaboratorsReactiveForm,
    permission:"",
    link:"/quan-ly-ctv/kich-hoat-lai/:id"
  },
  {
    component:CollaboratorsPreviewForm,
    permission:"",
    link:"/quan-ly-ctv/xem-chi-tiet/:id"
  }
];
