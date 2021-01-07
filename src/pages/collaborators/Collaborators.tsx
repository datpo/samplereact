import React from "react";
import PageWrapper from "../wrapper/PageWrapper";
import CollaboratorsSearchForm from "./search/form/CollaboratorsSearchForm";
import AgencyCollaboratorsTable from "./table/CollaboratorsTable";
import { RouteComponentProps } from "react-router";

interface Props extends RouteComponentProps {
    user:any;
}

const Collaborators: React.FC<Props> = props => {
  return (
    <PageWrapper title="Danh sách CTV">
      <CollaboratorsSearchForm />
      <AgencyCollaboratorsTable {...props} />
    </PageWrapper>
  );
};

export default Collaborators;
