import React, { Component } from 'react';
import axios from "axios";
import setAxiosHeaders from "./AxiosHeaders";
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Avatar from "../../../assets/images/img_avatar.png";
import moment from "moment-timezone";
import ProgressBar from 'react-bootstrap/ProgressBar'
import Search from "react-search";


class UserReservations extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userReservations: [],
            percentage: [],
            userRepos: []
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
                this.calcReservations()
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
    calcReservations() {
        setAxiosHeaders()
        axios
            .get('/api/v1/in_use_desks/', {
                params: {
                    all_desks: true,
                },
            })
            .then(response => {
                let desks = response.data.length;
                let now = this.state.userReservations.length;
                this.setState({percentage: ((now / desks) * 100).toFixed(2)})
            })
    }

    getUsersAsync(searchValue, cb) {
        let users = this.state.userReservations.map( (user, i) => { return { id: i, value: user.user_name } })
        this.setState({ userRepos: users })
        cb(searchValue)
    }

    FilterUsers(user) {
        axios
            .get('/api/v1/users/', {
                params: {
                    date: new Date(moment.tz("Europe/Berlin")),
                    user_search:  JSON.stringify(user),
                },
            })
            .then(response => {
                this.setState({userReservations: response.data})
            })
    }

    render() {
        return (
            <div className="">
                <div className="row col-sm-12 col-md-12 col-lg-12"><h5 className="margin-bottom" >Heute im Office</h5></div>
                <div className="row col-sm-12 col-md-12 col-lg-12"><ProgressBar className="margin-bottom" now={this.state.percentage} label={`${this.state.percentage}%`} /></div>
                <div id="Search-user">
                    <Search items={this.state.userRepos}
                            placeholder='Benutzer suchen'
                            maxSelected={1}
                            multiple={false}
                            autoComplete={false}
                            getItemsAsync={this.getUsersAsync.bind(this)}
                            onItemsChanged={this.FilterUsers.bind(this)} />
                </div>
                <div className="row col-sm-12 col-md-12 col-lg-12 margin-top-sm" id="User-Reservations">
                    {this.state.userReservations.map(user => (
                        <div key={user.id}>
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{user.user_name}</Tooltip>}>
                              <span className="d-inline-block thumbnail">
                                <img src={this.setAvatar(user.avatar)} alt="..." className="" disabled style={{ pointerEvents: 'none' }}></img>
                              </span>
                            </OverlayTrigger>
                        </div>
                    ))}
                </div>
            </div>
        )}

}

export default UserReservations