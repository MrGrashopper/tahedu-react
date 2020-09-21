import React, { Component } from 'react';
import MyImage from "../../../assets/images/workspace.png";
import axios from "axios";
import setAxiosHeaders from "./AxiosHeaders";
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button'
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from 'react-bootstrap/Form'

const notify = (message) => toast(message);
const toastMessage = (message) => toastr.success(message);

class DeskItems extends Component {
    constructor(props) {
        super(props)
        this.state = {
            desks: [],
            resDate: new Date(),
            filter: []
        };
        this.handleFilter = this.handleFilter.bind(this)
        this.reservationRef = React.createRef()
        this.userDateRef = React.createRef();
        this.kinds = this.kinds.bind(this)
        this.filterKinds = this.filterKinds.bind(this)
    }


    componentDidMount() {
        axios
            .get('/api/v1/desks/', {
                params: {
                    date:  this.state.resDate,
                },
            })
            .then(response => {
                this.setState({desks: response.data}),
                this.kinds()
            })
    }

    kinds() {
        let filterOptions = ["Alle"]
        {this.state.desks.map(desk => (
            filterOptions.push(desk.kind)
        ))}
        let filter =  Array.from(new Set(filterOptions))
        this.setState({
            filter: filter
        })
    }

    filterKinds(event){
        let filter = event.target.value
        setAxiosHeaders()
        axios
            .get('/api/v1/desks/', {
                params: {
                    date:  this.state.resDate,
                    filter:  filter,
                },
            })
            .then(response => {
                this.setState({desks: response.data}),
                    notify('🦄 Filter aktualisiert')
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
                    notify('🗓 Datum aktualisiert')
            })
    }

    handleChangeDate = date => {
        this.setState({
            resDate: date
        })
    };


    async createReservation(id){
        setAxiosHeaders()
         axios
            .post('/api/v1/reservations', {
                reservation: {
                    date: this.state.resDate,
                    desk_id: id
                }
            })
             .then(response => {
                 this.setState({desks: this.state.desks}),
                 notify(' 🎉 Reserviert!')
                 let desk = document.getElementById(id)
                 desk.style.display = "none";
             })
            .catch((error)=>console.error(error));
        event.preventDefault();
    };



    render() {
        return (
            <div className="margin-top-xl">
                <ToastContainer/>
                <div className="row">
                    <div className="col-sm-12 margin-bottom">
                        <Button variant="secondary" className=""  type="submit" onClick={this.handleFilter.bind(this)}>anzeigen</Button>{' '}
                        <DatePicker className="btn btn-light" dateFormat="dd/MM/yyyy" selected={this.state.resDate} onChange={this.handleChangeDate} ref={this.userDateRef}/>
                    </div>
                </div>
                <div className="row container margin-bottom">
                    <div className="col-sm-3">
                        <h3>Freie Desks buchen</h3>
                    </div>
                    <div className="col-sm-2">
                        <Form>
                            <Form.Group controlId="exampleForm.SelectCustom">
                                <Form.Control as="select"  onChange={this.filterKinds} value={this.state.value}>
                                    {this.state.filter.map(filter => (
                                        <option key={filter}>{filter}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </div>

                </div>
                <div className="row">
                    {this.state.desks.map(desk => (
                        <div className="col-xl-4 col-md-6 col-sm-12" key={desk.id} id={desk.id}>
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-9"><h5 className="card-title" >{desk.kind}-Desk</h5></div>
                                        <div className="col-sm-3"><img src={MyImage} alt="..." className="thumbnail"></img></div>
                                    </div>
                                    <span>Platz-ID: {desk.external_id}</span>
                                    <br/>
                                    <span>Sicherheitsabstand:</span>
                                    <span className="emoji"> {desk.enough_distance? `👍` : `👎`}</span>
                                    <div className="margin-top float-right">
                                        <a href="#" className="btn btn-primary" onClick={() => this.createReservation(desk.id)}>reservieren</a>
                                    </div>
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