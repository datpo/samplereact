import React, { Component } from 'react'

interface Props {
    btnClass?:string,
    onClick:any,
}
interface State {

}

export default class DenyButton extends Component<Props, State> {
    state = {}

    render() {
        return (
            <button type="button" onClick={this.props.onClick} className={this.props.btnClass || 'btn btn-danger btn-sm'}>
                <i className="fa fa-ban mr-1"></i>
                Từ chối
            </button>
        )
    }
}
