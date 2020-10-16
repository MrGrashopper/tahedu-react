import React, { Component } from 'react';
import Basic from "../../../assets/images/Basic.png";
import IT from "../../../assets/images/IT.png";
import Meeting from "../../../assets/images/Meeting.png";
import Design from "../../../assets/images/Design.png";
import axios from "axios";
import setAxiosHeaders from "./AxiosHeaders";
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button'
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from 'react-bootstrap/Form'
import Search from 'react-search'
import moment from "moment-timezone";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const notify = (message) => toast(message);

class DeskItems extends Component {
    constructor(props) {
        super(props)
        this.state = {
            desks: [],
            resDate: new Date(moment.tz("Europe/Berlin")),
            filter: [],
            repos: [],
        };
        this.handleFilter = this.handleFilter.bind(this)
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
        let filterOptions = ["Alle Typen"]
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
                    filter: "Alle Typen"
                },
            })
            .then(response => {
                this.setState({
                    desks: response.data,
                    repos: []
                })
                let filterOptions = ["Alle Typen"]
                {this.state.desks.map(desk => (
                    filterOptions.push(desk.kind)
                ))}
                let label = document.getElementById("Filter")
                let filter =  Array.from(new Set(filterOptions))
                this.setState({
                    filter: filter,
                }),
                label.value = "Alle Typen"
                let list = document.getElementsByClassName("sc-bxivhb iRISHI");
                let span = list[0].getElementsByTagName("span");
                span[0].innerHTML = "Platz-ID suchen"
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

    setImage = kind => {
        if(kind == 'Basic') {
            return Basic
        }
        else if(kind == 'IT') {
            return IT
            }
        else if(kind == 'Meeting') {
            return Meeting
        }
        else if(kind == 'Design') {
            return Design
        }
        else {
            return Basic
        }
    }

    getItemsAsync(searchValue, cb) {
        let items = this.state.desks.map( (res, i) => { return { id: i, value: res.external_id } })
        this.setState({ repos: items })
        cb(searchValue)
    }

    FilterItems(items) {
        axios
            .get('/api/v1/desks/', {
                params: {
                    date:  this.state.resDate,
                    items:  items,
                },
            })
            .then(response => {
                this.setState({desks: response.data})
            })
    }


    render() {
        return (
            <div className="margin-top-xl">
                <ToastContainer />
                <div className="row margin-bottom">
                    <div className="col-sm-6 col-md-6 col-xl-7">
                        <DatePicker
                            className=""
                            dateFormat="dd/MM/yyyy" selected={this.state.resDate}
                            minDate={moment().toDate()}
                            onChange={this.handleChangeDate}
                            ref={this.userDateRef}/>
                        <Button variant="secondary" className="space"  type="submit" onClick={this.handleFilter.bind(this)}>auswählen</Button>{' '}
                    </div>

                    <div id="Filter-kinds" className="col-sm-6 col-md-3 col-xl-2">
                        <Form>
                            <Form.Group>
                                <Form.Control id="Filter" as="select"  onChange={this.filterKinds} value={this.state.value}>
                                    {this.state.filter.map(filter => (
                                        <option key={filter}>{filter}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </div>

                    <div className="col-sm-6 col-md-3 col-xl-3">
                        <div id="Search-items">
                            <Search items={this.state.repos}
                                    placeholder='Platz-ID suchen'
                                    maxSelected={1}
                                    multiple={false}
                                    autoComplete={false}
                                    getItemsAsync={this.getItemsAsync.bind(this)}
                                    onItemsChanged={this.FilterItems.bind(this)} />
                        </div>
                    </div>
                </div>

                <div className="row margin-top">
                    {this.state.desks.map(desk => (
                        <div className="col-xl-4 col-md-6 col-sm-12" key={desk.id} id={desk.id}>
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-9">
                                            <div className="margin-bottom">
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Platz-Eigenschaft</Tooltip>}><span className="h5">{desk.kind}</span></OverlayTrigger>
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Sicherheitsabstand zum nächsten Sitzplatz</Tooltip>}><span className="icon"> {desk.enough_distance? `👍` : `👎`}</span></OverlayTrigger>
                                            </div>
                                            <div>Platz-ID: {desk.external_id}</div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="kind-image">
                                                <img  src={this.setImage(desk.kind)} alt="..." ></img>
                                            </div>
                                        </div>
                                    </div>
                                    <div>Info: {desk.notes? desk.notes : `Keine Angabe`}</div>
                                    <div className="margin-bottom">Ausstattung: {desk.equipment? desk.equipment : `Keine Angabe`}</div>
                                    <div className="float-right">
                                        <a href="#" className="btn btn-primary" onClick={() => this.createReservation(desk.id)}>Buchen</a>
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