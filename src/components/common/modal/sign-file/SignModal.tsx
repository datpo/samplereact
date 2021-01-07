import React from "react";
import { Modal, Button } from "antd";
import LoadingComponent from "../../loading/LoadingComponent";

interface Props {
    onCLickOk?: any;
    onClickCancel?: any;
    loading?: boolean;
    visible: boolean;
    className?: string;
    bodyStyle?: any;
    style?: any;
}

const SignModal: React.FC<Props> = props => {
    const onRenderFooter = () => {
        return [
            props.onCLickOk ? (
                <Button
                    key={1}
                    type="primary"
                    onClick={props.onCLickOk}
                    loading={props.loading}
                >
                    Ký
                </Button>
            ) : (
                ""
            ),
            props.onClickCancel ? (
                <Button
                    key={2}
                    type="default"
                    onClick={props.onClickCancel}
                    loading={props.loading}
                >
                    Hủy
                </Button>
            ) : (
                ""
            )
        ];
    };

    return (
        <Modal
            title={false}
            visible={props.visible}
            className={props.className}
            bodyStyle={props.bodyStyle}
            style={props.style}
            footer={onRenderFooter()}
        >
            {props.loading ? <LoadingComponent /> : props.children}
        </Modal>
    );
};

export default SignModal;
