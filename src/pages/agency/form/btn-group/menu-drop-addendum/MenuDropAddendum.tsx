import React from "react";
import { Menu, Button } from "antd";

interface Props {
    onClick: (indexAddendum) => void;
    addendum1?: boolean;
    addendum2?: boolean;
    addendum3?: boolean;
    contract?: boolean;
}

export default function MenuDropAddendum(props: Props) {
  return (
    <Menu>
        {props.contract ? (
            <Menu.Item className="drop-contract">
                <Button onClick={()=>props.onClick('')} type="link">
                    Hợp đồng
                </Button>
            </Menu.Item>
    
        ): ("")}
        {props.addendum1 === true ? (
            <Menu.Item className="drop-contract">
                <Button onClick={()=>props.onClick(1)} type="link">
                    Xem phụ lục 1
                </Button>
            </Menu.Item>

        ): ("")}
        {props.addendum2 === true ? (
            <Menu.Item className="drop-contract">
                <Button onClick={()=>props.onClick(2)} type="link">
                    Xem phụ lục 2
                </Button>
            </Menu.Item>
        ) : ("")}
        {props.addendum3 === true ? (
            <Menu.Item className="drop-contract">
                <Button onClick={()=>props.onClick(3)} type="link">
                    Xem phụ lục 3
                </Button>
            </Menu.Item>
        ) : ("")}

    </Menu>
  );
}
