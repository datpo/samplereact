import React from "react";
import { Link } from "react-router-dom";

interface Props {
    onClick?: any;
    className?: any;
    toURL?: string;
}

export default function ButtonOut(props: Props) {
    const render = () => {
        if (props.toURL) {
            return (
                <Link to={props.toURL}>
                    <button type="button" className={`btn btn-secondary ml-1 mr-1 ${props.className}`}>
                        <i className="fas fa-times-circle mr-2"></i>
                        Thoát
                    </button>
                </Link>
            );
        } else {
            return (
                <button
                    onClick={props.onClick}
                    type="button"
                    className={`btn btn-secondary ml-1 mr-1 ${props.className}`}
                >
                    <i className="fas fa-times-circle mr-2"></i>
                    Thoát
                </button>
            );
        }
    };

    return render();
}
