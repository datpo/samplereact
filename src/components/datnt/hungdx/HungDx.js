
import React, { Component } from 'react'
import { Line, Bar } from "react-chartjs-2";

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

// core components
import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4,
  data
} from "./charts.js";
import axios from "axios";
import classNames from "classnames";

class HungDx extends Component {

     test = async () =>{
        let axiosConfig = {
          headers: {
              'Content-Type': 'application/json;charset=UTF-8',
               "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJocnR1U1J2cVE4QVdaTkx1aFN3YXVOb1NiQWM2amRmMlRRbUp0U1lvazZRIn0.eyJleHAiOjE2MDk0MDU1MzgsImlhdCI6MTYwOTQwMTkzOCwianRpIjoiYzI5ZjkwOTEtZmQwYi00NTBhLWE3NzgtMzYyMjZlZDIwZTBiIiwiaXNzIjoiaHR0cDovLzEwLjMwLjEuNDA6ODA4MC9hdXRoL3JlYWxtcy9jeWJlcnRheHYyIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6Ijg5MTMwYmFjLTQ0YjItNDZkNy04YmQzLWNmMDZlMTdhYjcyYyIsInR5cCI6IkJlYXJlciIsImF6cCI6InRheGZyb250ZW5kIiwic2Vzc2lvbl9zdGF0ZSI6IjNlMzk1NWE3LWUyMjktNGJlMi04ODE5LWU4OTQ3NjgzNTUzZSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6InRoYWkgdGEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJjeWJlcnRheCIsImdpdmVuX25hbWUiOiJ0aGFpIiwiZmFtaWx5X25hbWUiOiJ0YSIsImVtYWlsIjoiY3liZXJ0YXhAZ21haWwuY29tIn0.FQ5ZktHCSZ53XZb5ObfsioR6YXytCPtPznBmKMd3hb0KJ0M4ENOKgiG3gMZc0sn-_S4hbNz1bQMn1vdCKuJORdVDFis5FvckUsnjcHUt63S_2arhmo9iCX5zcaneM-bbRChQI5ifmmk8pKcCfoDQgX5BWxG1rsiPNHfO355dZ3PWNqXtfIzqHQf0oIGc1gERhzvg1WmNSEmXaxpzLaLTd8Y5Up5aU3UGYbt0_WvFZGKp95Xm5o99p7pZ6jhQ9yS0uxTAd6bxgiTnDebOCoEIjujS2bC6PmsHMAUKGi5PpV6su6ylRN_F9RMGXJ5lU6GI5RrExf44my-PIn8jXqwQlQ`,
          }
        };
        return axios({
          method:"GET",
         // url: 'http://localhost:8080/test',
           url:'http://localhost:8080/getinfo',
          data:'',
    
        //  headers:axiosConfig
        }).catch(e => {
          console.log("err:", e);
        });
      }

    render() {
        // const [bigChartData, setbigChartData] = React.useState("data1");
        // const setBgChartData = (name) => {
        //     setbigChartData(name);
        // };
        console.log("callApi: ", this.test().then(res => {
            console.log("test fcun:", res.data);
            data.push(res.data.loai);
        }));
        return (
            <div>
                <h1>HUNGDX</h1>
                <div className="content">
                    <Row>
                        <Col xs="12">
                            <Card className="card-chart">
                                <CardHeader>
                                    <Row>
                                        <Col className="text-left" sm="6">
                                            <h5 className="card-category">Total Shipments</h5>
                                            <CardTitle tag="h2">Performance</CardTitle>
                                        </Col>
                                        {/* <Col sm="6">
                                            <ButtonGroup
                                                className="btn-group-toggle float-right"
                                                data-toggle="buttons"
                                            >
                                                <Button
                                                    tag="label"
                                                    className={classNames("btn-simple", {
                                                        active: bigChartData === "data1",
                                                    })}
                                                    color="info"
                                                    id="0"
                                                    size="sm"
                                                    onClick={() => setBgChartData("data1")}
                                                >
                                                    <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                                        Accounts
                        </span>
                                                    <span className="d-block d-sm-none">
                                                        <i className="tim-icons icon-single-02" />
                                                    </span>
                                                </Button>
                                                <Button
                                                    color="info"
                                                    id="1"
                                                    size="sm"
                                                    tag="label"
                                                    className={classNames("btn-simple", {
                                                        active: bigChartData === "data2",
                                                    })}
                                                    onClick={() => setBgChartData("data2")}
                                                >
                                                    <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                                        Purchases
                        </span>
                                                    <span className="d-block d-sm-none">
                                                        <i className="tim-icons icon-gift-2" />
                                                    </span>
                                                </Button>
                                                <Button
                                                    color="info"
                                                    id="2"
                                                    size="sm"
                                                    tag="label"
                                                    className={classNames("btn-simple", {
                                                        active: bigChartData === "data3",
                                                    })}
                                                    onClick={() => setBgChartData("data3")}
                                                >
                                                    <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                                        Sessions
                        </span>
                                                    <span className="d-block d-sm-none">
                                                        <i className="tim-icons icon-tap-02" />
                                                    </span>
                                                </Button>
                                            </ButtonGroup>
                                        </Col> */}
                                    </Row>
                                    <Row>
                                        <Col lg="4">
                                            <a name="" id="" class="btn btn-primary" href="#" role="button">Fuck</a>
                                        </Col>
                                        <Col lg="4">
                                            <div class="dropdown">
                                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    Dropdown button
                                                </button>
                                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                    <a class="dropdown-item" href="#">1</a>
                                                    <a class="dropdown-item" href="#">2</a>
                                                    <a class="dropdown-item" href="#">3</a>
                                                    <a class="dropdown-item" href="#">4</a>
                                                    <a class="dropdown-item" href="#">5</a>
                                                    <a class="dropdown-item" href="#">6</a>
                                                    <a class="dropdown-item" href="#">7</a>
                                                    <a class="dropdown-item" href="#">8</a>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <div className="chart-area">
                                        <Bar
                                            data={chartExample3.data}
                                            options={chartExample3.options}
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </div>
            </div>
        )
    }
}
export default HungDx;