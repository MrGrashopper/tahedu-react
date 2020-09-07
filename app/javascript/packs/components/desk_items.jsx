import React, { Component } from 'react';
import MyImage from "../../../assets/images/workspace.png";
import axios from "axios";
import setAxiosHeaders from "./AxiosHeaders";
import Form from 'react-bootstrap/Form'
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button'
import "react-datepicker/dist/react-datepicker.css";


class DeskItems extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reservations: [],
            resDate: new Date()
        };
        this.handleFilter = this.handleFilter.bind(this)
    }

   componentDidMount() {
        axios
            .get('/api/v1/desks/', {
                params: {
                    date:  this.state.resDate,
                },
            })
            .then(response => {
                this.setState({
                    reservations: response.data
                });
            })
    }

    handleFilter() {
        setAxiosHeaders()
        axios
            .get('/api/v1/desks/', {
                params: {
                    date:  this.state.resDate,
                },
            })
            .then(response => {
                this.setState({ reservations: response.data });
                response.preventDefault();
                console.log("kuuuuuuku")
            })
    }

    handleChangeDate = date => {
        this.setState({
            resDate: date
        });
    };

    render() {
        return (
            <div className="">
                <div className="row">
                    <div className="row container margin-bottom">
                        <Button variant="outline-dark" type="submit" onClick={this.handleFilter.bind(this)}>anzeigen</Button>{' '}
                        <DatePicker className="btn dark" dateFormat="dd/MM/yyyy" selected={this.state.resDate} onChange={this.handleChangeDate}/>
                    </div>
                </div>
                <div className="row container margin-bottom">
                    <h3>Reservierte Arbeitsplätze</h3>
                </div>
                <div className="row">
                    {this.state.reservations.map(reservation => (
                        <div className="col-sm-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-9"><h5 className="card-title" key={reservation.name}>{reservation.name} </h5></div>
                                        <div className="col-sm-3"><img src={MyImage} alt="..." className="thumbnail"></img></div>
                                    </div>
                                    <p className="card-text" key={reservation.date}>{reservation.date}</p>
                                    <p className="card-text" key={reservation.starts_at}>{reservation.starts_at} bis {reservation.ends_at}</p>
                                    <a href="#" className="btn btn-outline-primary">ansehen</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default DeskItems