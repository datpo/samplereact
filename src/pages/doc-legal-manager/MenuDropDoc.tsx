import React from "react";
import {Menu} from "antd";

interface Props {
    onClick: (type) => void;
    dataDoc?: any;
    link? :any;
}
export default function MenuDropDoc(props: Props) {
    const list : Array<string> =[
        '',
        'CMND/Hộ chiếu',
        'File xác nhận của doanh nghiệp',
        'Mẫu DK-01.01',
        'Mẫu DK-01.02',
        'File giấy tờ pháp lý',
        'File cmnd/hộ chiếu người đại diện',
        'Mẫu ký xác nhận DK-02',
        'File cmnd/ hộ chiếu (điều chỉnh)',
        'File xác nhận của doanh nghiệp(điều chỉnh)',
        'File giấy tờ pháp lý (điều chỉnh)',
        'File cmnd/hộ chiếu người đại diện (điều chỉnh)',
        'Mẫu ký xác nhận DC-01.01(điều chỉnh)',
        'Mẫu ký xác nhận DC-01.02(điều chỉnh)',
        'Mẫu ký xác nhận DK-03',
    ];
    
    const dataDoc = props.dataDoc;
    const listItems = dataDoc.map((value) =>
        <Menu.Item  key={value}  className="drop-contract">
            <a className={"drop-contract-link"} href = {props.link} type="button" target={"_blank"} rel="noopener noreferrer"  onClick={() => props.onClick(value)}>
                <button>{list[value]}</button>
            </a>
        </Menu.Item>
    );
    return (
        <Menu>
            {listItems}
        </Menu>
    );
}
