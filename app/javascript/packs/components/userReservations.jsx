import React, { Component } from 'react';
import axios from "axios";
import setAxiosHeaders from "./AxiosHeaders";
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'


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
                    user_res: new Date(),
                },
            })
            .then(response => {
                this.setState({
                    userReservations: response.data
                });
            })
    }


    render() {
        return (
            <div>
                <h5 className="margin-top-zero margin-bottom " >Heute im Office</h5>
                {this.state.userReservations.map(user => (
                    <div className="">
                        <div className="">
                            <div className="">
                                <div className="">
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled" key={user.email}>{user.email}</Tooltip>}>
                                      <span className="d-inline-block">
                                        <img src={user.avatar_url} alt="..." className="thumbnail" disabled style={{ pointerEvents: 'none' }}></img>
                                      </span>
                                    </OverlayTrigger>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

}

export default UserReservations