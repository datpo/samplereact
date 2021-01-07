import React, {useEffect, useState} from "react";
import {match} from "react-router";
import {FormComponentProps} from "antd/lib/form";
import {SignLiquidatinService} from "../../services/sign-coop-stop/SignLiquidationService";
import {loading as loadingHelper} from "../../components/common/loading/Loading";
import {onFailAction, onSuccessAction} from "../../helpers/SwalCommon";
import axios from "axios";

interface Props extends FormComponentProps {
    match: match<{ id: string }>;
    history: any;
}

const SignPage: React.FC<Props> = props => {
    const [file, setFile] = useState("");
    
    const dataSign = {
        "signDate":"",
        "fieldName":"SignatureB [002]",
        "typeSign":"1",
        "page":"",
        "px":"",
        "py":"",
        "pw":"",
        "ph":""
    };
    
    const [canSign, setCanSign] = useState(true);
    
    const id = props.match.params.id;
    
    const getLiquidation = async () => {
        loadingHelper.runLoadingBlockUI();
        const result = await SignLiquidatinService.getLiquidation(id);
        setFile(result.data);
        if (result && result.customer_sign_status === 1){
            setCanSign(false);
        }
        loadingHelper.stopRunLoading();
    };
    
    const getCertificate = async () => {
        loadingHelper.runLoadingBlockUI();
        const result = await SignLiquidatinService.getCertificate(id);
        loadingHelper.stopRunLoading();
        return result;
    };
    
    useEffect(() => {
        getLiquidation();
        getCertificate();
        // eslint-disable-next-line
    }, []);
    
    const onSignClick = async () => {
        let cert = await getCertificate();
        if (!cert.data){
            onFailAction("Không tìm thấy chứng thư số");
            return;
        }
        let allDataSign = {...dataSign, "CertSerial":cert.data, "FileData":file};
        onSign(allDataSign);
    };
    
    const onSign = (allDataSign) => {
        axios.post(`http://localhost:6706/api/sign/signpdf`, allDataSign)
        .then((response) => {
            const data = response.data;
            if (!data.FileDataSigned) {
                onFailAction('Có lỗi xảy ra trong quá trình ký!');
                return ;
            }
            updateSignedContract({...data, "id":id});
        })
        .catch((error) => {
            onFailAction(error);
        });
    };
    
    const updateSignedContract = async (data) => {
        const result = await SignLiquidatinService.updateSignedContract(data);
        if (result && result.status === 200){
            onSuccessAction("Ký thành công!", () => {
                window.location.reload();
            });
        } else {
            onFailAction("Có lỗi xảy ra !");
        }
    };
    
    return(
        <div>
            <nav className="navbar navbar-light bg-light">
                <div className="row">
                    <div className="col-md-5">
                        <a className="navbar-brand" href="/#">
                            <img src="/images/logo.jpg" width="20%" alt="logo"/>
                        </a>
                    </div>
                    <div className="col-md-6">
                        <span className="navbar-brand border border-danger rounded">Trang ký biên bản dừng hợp tác</span>
                    </div>
                </div>
            </nav>
            <div className="col-md-12 text-center mt-3">
                <iframe
                    title="Biên bản thanh lý"
                    src={`data:application/pdf;base64,${file}`}
                    height="800px"
                    width="45%"
                />
            </div>
            {canSign ? (
                <div className="text-center">
                    <button className="btn btn-success" onClick={onSignClick}><i className="fas fa-file-signature"/> Ký biên bản</button>
                </div>
            ) : ""}
        </div>
    );
};

export default SignPage;