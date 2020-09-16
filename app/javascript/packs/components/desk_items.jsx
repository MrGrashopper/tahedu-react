import React, { Component } from 'react';
import MyImage from "../../../assets/images/workspace.png";
import axios from "axios";
import setAxiosHeaders from "./AxiosHeaders";
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button'
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notify = (message) => toast(message);

class DeskItems extends Component {
    constructor(props) {
        super(props)
        this.state = {
            desks: [],
            resDate: new Date()
        };
        this.handleFilter = this.handleFilter.bind(this)
        this.reservationRef = React.createRef()
        this.userDateRef = React.createRef();

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
                this.setState({desks: response.data}),
                    notify("Datum aktualisiert!");
                    console.log(response)
            })
    }

    handleChangeDate = date => {
        this.setState({
            resDate: date
        })
    };


    createReservation(id){
        setAxiosHeaders()
        axios
            .post('/api/v1/reservations', {
                reservation: {
                    date: this.state.resDate,
                    desk_id: id
                }
            })
            .then((response)=>{
                if(response.status == 201) {
                    notify("Reserviert!");
                    console.log(response)
                }
            })
            .catch((error)=>console.error(error));
    };


    render() {
        return (
            <div className="margin-top-xl">
                <ToastContainer />
                <div className="row">
                    <div className="col-sm-12 margin-bottom">
                        <Button variant="secondary" className=""  type="submit" onClick={this.handleFilter.bind(this)}>anzeigen</Button>{' '}
                        <DatePicker className="btn btn-light" dateFormat="dd/MM/yyyy" selected={this.state.resDate} onChange={this.handleChangeDate} ref={this.userDateRef}/>
                    </div>
                </div>
                <div className="row container margin-bottom">
                    <h3>Freie Desks buchen</h3>
                </div>
                <div className="row">
                    {this.state.desks.map(desk => (
                        <div className="col-xl-3 col-md-6 col-sm-12" key={desk.id}>
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-9"><h5 className="card-title" >{desk.kind}-Desk</h5></div>
                                        <div className="col-sm-3"><img src={MyImage} alt="..." className="thumbnail"></img></div>
                                    </div>
                                    <p className="card-text">Platz-ID: {desk.external_id}</p>
                                    <a href="#" className="btn btn-primary" onClick={() => this.createReservation(desk.id)} ref={this.reservationRef}>reservieren</a>
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