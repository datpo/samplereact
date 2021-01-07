import React from "react";

interface Props {
    onClick: any;
    className?: string;
    label: string;
    icon?: string;
    isDisabled?: boolean;
}

function ButtonOnSave(props: Props) {
    return (
        <button className={`btn btn-primary ml-1 mr-1 ${props.className}`} disabled={props.isDisabled} onClick={props.onClick}>
            {props.icon ? props.icon : <i className="fas fa-save mr-2"></i>}
            {props.label}
        </button>
    );
}

export default ButtonOnSave;
