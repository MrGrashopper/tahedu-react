import React, { Component } from 'react';
import axios from "axios";
import setAxiosHeaders from "./AxiosHeaders";
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Avatar from "../../../assets/images/img_avatar.png";
import moment from "moment-timezone";



class UserReservations extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userReservations: [],
        };
    }

    componentDidMount() {
        setAxiosHeaders()
        axios
            .get('/api/v1/users', {
                params: {
                    user_res: new Date(moment.tz("Europe/Berlin")),
                },
            })
            .then(response => {
                this.setState({
                    userReservations: response.data
                });
            })
    }
    setAvatar = avatar => {
        if(typeof avatar != "undefined") {
            return avatar
        }
        else {
            return Avatar
        }
    }


    render() {
        return (
            <div className="">
                <div className="row col-sm-12 col-md-12 col-lg-12"><h5 className="margin-bottom" >Heute im Office</h5></div>
                <div className="row col-sm-12 col-md-12 col-lg-12">
                    {this.state.userReservations.map(user => (
                        <div className="col-xs-1" key={user.id}>
                            <div className="">
                                <div className="">
                                    <div className="">
                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{user.email}</Tooltip>}>
                                          <span className="d-inline-block">
                                            <img src={this.setAvatar(user.avatar)} alt="..." className="thumbnail" disabled style={{ pointerEvents: 'none' }}></img>
                                          </span>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

}

export default UserReservations