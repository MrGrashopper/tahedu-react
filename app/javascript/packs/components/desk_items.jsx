import React, { Component } from 'react';
import MyImage from "../../../assets/images/workspace.png";
import axios from "axios";
import setAxiosHeaders from "./AxiosHeaders";
import Form from 'react-bootstrap/Form'
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button'
import "react-datepicker/dist/react-datepicker.css";
import ToastMessage from './toast'
import FlashMessage from "react-flash-message";


class DeskItems extends Component {
    constructor(props) {
        super(props)
        this.state = {
            desks: [],
            resDate: new Date()
        };
        this.handleFilter = this.handleFilter.bind(this)
        this.reservationRef = React.createRef()
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
                    desks: response.data
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
                this.setState({ desks: response.data });
            })
    }

    handleChangeDate = date => {
        this.setState({
            resDate: date
        });
    };


    createReservation(id){
        setAxiosHeaders()
        axios
            .post('/api/v1/desks', {
                reservation: {
                    date: this.state.resDate,
                    desk_id: id
                },
            })
            .then(
                console.log("success")
            )
    };

    message = () => (
        <FlashMessage duration={5000}>
            <strong>I will disapper in 5 seconds!</strong>
        </FlashMessage>
    )

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
                    <h3>Arbeitsplätze</h3>
                </div>
                <div className="row">
                    {this.state.desks.map(desk => (
                        <div className="col-sm-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-9"><h5 className="card-title" key={desk.kind}>{desk.kind} </h5></div>
                                        <div className="col-sm-3"><img src={MyImage} alt="..." className="thumbnail"></img></div>
                                    </div>
                                    <p className="card-text" key={desk.id}>Platznummer: {desk.id}</p>
                                    <a href="#" className="btn btn-outline-primary" onClick={() => this.createReservation(desk.id)} ref={this.reservationRef}>reservieren</a>
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