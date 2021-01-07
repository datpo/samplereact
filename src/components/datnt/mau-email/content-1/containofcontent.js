import React from 'react'
import { Table, Card,Input, Row, Col, Button, Tag, Icon } from 'antd';
import {Link} from 'react-router-dom';




const content = [
    {
        type: 'kích hoạt tài khoản',
        name: 'Kích hoạt tài khoản - Account Activation',
        des: 'Created by System',
        creator: 'cyber01',
        date: '13/07/2020 09:51:27',
        checkItem:true,
        isDisplay: true
    },
    {
        type: 'Khôi phục tài khoản',
        name: 'Khôi phục mật khẩu - Account Recovery',
        des: 'Created by System',
        creator: 'cyber01',
        date: '13/07/2020 09:52:19',
        checkItem:true,
        isDisplay: true
    },
    {
        type: 'Đăng ký tài khoản',
        name: 'Đăng ký tài khoản - Account Registration',
        des: 'Created by System',
        creator: 'datpo',
        date: '1/1/1111',
        checkItem:true,
        isDisplay: true
    },
    {
        type: 'Trình ký',
        name: 'Trình ký - Approval Request',
        des: 'Created by System',
        creator: 'datpo',
        date: '13/07/2020 09:53:26',
        checkItem:true,
        isDisplay: true
    },
    {
        type: 'Tạm ngưng',
        name: 'Tạm ngưng trình ký - Approval Suspension',
        des: 'Created by System',
        creator: 'datpo',
        date: ' 13/07/2020 10:07:09',
        checkItem:true,
        isDisplay: true
    },
    {
        type: 'Đã ký',
        name: 'Phê duyệt - Submission Approved',
        des: 'Created by System',
        creator: 'datpo',
        date: '1/1/1111',
        checkItem:true,
        isDisplay: true
    },
    {
        type: 'Từ chối',
        name: ' Submission Rejected',
        des: 'Created by System',
        creator: 'datpo',
        date: '1/1/1111',
        checkItem:true,
        isDisplay: true
    },
    {
        type: 'Nhắc nhở phê duyệt',
        name: 'Approval Reminder',
        des: 'Created by System',
        creator: 'datpo',
        date: '1/1/1111',
        checkItem:true,
        isDisplay: true
    },
    {
        type: 'Gửi email sau khi trình ký hoàn tất',
        name: 'Submission Approved Event',
        des: 'Created by System',
        creator: 'datpo',
        date: '1/1/1111',
        checkItem:false,
        isDisplay: true
    },
    {
        type: 'Chia sẻ tài liệu cá nhân',
        name: 'Document Sharing Event',
        des: 'Created by System',
        creator: 'datpo',
        date: '1/1/1111',
        checkItem:false,
        isDisplay: true
    },
    {
        type: 'Yêu cầu hủy trình ký',
        name: 'Submission Cancellation Request',
        des: 'Created by System',
        creator: 'datpo',
        date: '1/1/1111',
        checkItem:false,
        isDisplay: true
    },
    {
        type: 'Hủy trình ký',
        name: 'Submission Cancellation',
        des: 'Created by System',
        creator: 'datpo',
        date: '1/1/1111',
        checkItem:false,
        isDisplay: true
    }
];

export const dataSource = [
    {
        STT: '1',
        ten: 'Mike',
        loai: 32,
        ngayTao: '10 Downing Street',
        des: 'abc',
        kh: false,
        cn: 'abc'

    },
    {
        STT: '1',
        ten: 'Mike',
        loai: 32,
        ngayTao: '10 Downing Street',
        des: 'abc',
        kh: true,
        cn: 'abc'

    },
    {
        STT: '1',
        ten: 'Mike',
        loai: 32,
        ngayTao: '10 Downing Street',
        des: 'abc',
        kh: false,
        cn: 'abc'

    },
    {
        STT: '1',
        ten: 'Mike',
        loai: 32,
        ngayTao: '10 Downing Street',
        des: 'abc',
        kh: true,
        cn: 'abc'

    },
]

export const columns = [
    {
        title: 'STT.',
        dataIndex: 'STT',
        key: 'STT.',
    },
    {
        title: 'Tên',
        dataIndex: 'ten',
        key: 'ten',
    },
    {
        title: 'Loại',
        dataIndex: 'loai',
        key: 'loai',
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'ngayTao',
        key: 'ngayTao',
    },
    {
        title: 'Mô tả',
        dataIndex: 'des',
        key: 'des',
    },
    
    {
        title: 'Kích hoạt',
        dataIndex: 'kh',
        key: 'Kích hoạt',
        render: kh => {
            if (kh) {
                return (
                    <Tag color={'red'} key={'Kích hoạt'}>
                        {'Kích hoạt'}
                    </Tag>)
            } else {
                return (
                    <Tag color={'green'} key={'Kích hoạt'}>
                        {'Chưa Kích hoạt'}
                    </Tag>)
            }
        }
    },
    {
        title: 'Chức năng',
        dataIndex: 'cn',
        key: 'Chức năng',
        render: () => {
            return (
                <div>
                    <Button type="primary">
                        <Link to='/template-email/update' >Update</Link>
                    </Button>
                   
                </div>


            )
        }
    },
];



export default content;