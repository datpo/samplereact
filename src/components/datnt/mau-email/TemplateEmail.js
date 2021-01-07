import React, { Component } from 'react'
import { Table, Card, Input, Row, Col, Button, Tag, Icon } from 'antd';
import { Link } from 'react-router-dom';
import content from './content-1/containofcontent';
import { dataSource, columns } from './content-1/containofcontent';
// import columns from './content-1/containofcontent';
import { callApi } from './call-api/CallApi';
import CardContent from './content-1/CardContent'
const { Search } = Input;

// dataSource = callApi('/test', '', null).then(res => {
//     console.log("test api: ", res);
// });

class TemplateEmail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            display: true

        }
    }

    getResponse = async () => {
        var result = '';

        await callApi('/test', '', null).then(res => {
            //console.log("test api component dis mount: ", res.data);
            result = res.data;
        });
        console.log("123: ", result);
        return result;
    }

    componentDidMount() {
        callApi('/test', '', null).then(res => {
            console.log("test api component dis mount: ", res.data);
            var resu = res.data;
            //           dataSource = res.data;

            dataSource.push({
                STT: resu.stt,
                loai: resu.loai,
                ten: resu.ten,
                ngayTao: resu.ngayTao,
                des: resu.des,
                kh: resu.kh,
                cn: resu.cn
            });
            this.setState({ dataSource: res.data })
            console.log("dataSource: ", dataSource);

            console.log("123456: ", this.getResponse);
        });
    }

    render() {

        // callApi('/test', '', null).then(res => {
        //     console.log("test api: ", res.data)
        //     var resu = res.data;
        //     dataSource.push({
        //         STT : resu.stt,
        //         loai : resu.loai,
        //         ten : resu.ten,
        //         ngayTao : resu.ngayTao,
        //         des : resu.des,
        //         kh : resu.kh,
        //         cn : resu.cn
        //     })
        //          });
        console.log("dataSource display: ", dataSource)


        var disContent = content.map((item, index) => {
            return (

                <Col span={8}>
                    <CardContent item={item} />
                </Col>
            )
        });
        return (

            <div className="space-align-container">
                <h1>Template Email</h1>
                <Card className="m-r-15-i m-l-15-i mt-1" size="small">
                    <div className="space-align-block">
                        <Row>
                            {disContent}
                        </Row>
                    </div>
                </Card>

                <Card className="m-r-15-i m-l-15-i mt-1" size="small">
                    <label> Danh sách mẫu email</label>
                    <br />
                    <Row>
                        <Col span={6}>
                            <Search placeholder="input search text" style={{ width: 200, margin: '0 10px' }} enterButton />
                        </Col>
                        <Col span={6} offset={12}>
                            <Button type="primary" style={{ marginLeft: 280 }} size={'large'}>
                                <Link to='/template-email/add'>Add Item</Link>
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Table dataSource={dataSource} columns={columns} />;
                     </Row>
                    <br />
                </Card>
            </div>
        )
    }
}
export default TemplateEmail;