import React, { Component } from 'react';
import Basic from "../../../assets/images/Basic.png";
import IT from "../../../assets/images/IT.png";
import Meeting from "../../../assets/images/Meeting.png";
import Design from "../../../assets/images/Design.png";
import Lab from "../../../assets/images/Lab.png";
import Distance from "../../../assets/images/Distance.png";
import ParkingSlot from "../../../assets/images/parking_slot.png";
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
import Badge from 'react-bootstrap/Badge'
import Accordion from 'react-bootstrap/Accordion'
import { FcAbout } from "react-icons/fc";
import { FcDepartment } from "react-icons/fc";
import { FcAddressBook } from "react-icons/fc";
import { FcPackage } from "react-icons/fc";

const notify = (message) => toast(message);

class DeskItems extends Component {
    constructor(props) {
        super(props)
        this.state = {
            desks: [],
            resDate: new Date(moment.tz("Europe/Berlin")),
            filter: [],
            repos: [],
            floor: [],
            slots: []
        };
        this.handleFilter = this.handleFilter.bind(this)
        this.userDateRef = React.createRef();
        this.kinds = this.kinds.bind(this)
        this.filterKinds = this.filterKinds.bind(this)
        this.floors = this.floors.bind(this)
        this.filterFloors = this.filterFloors.bind(this)
    }



    kinds() {
        let filterOptions = ["Alle Typen"]
        {this.state.desks.map(desk => (
            filterOptions.push(desk.kind)
        ))}
        let filter =  Array.from(new Set(filterOptions))
        this.setState({filter: filter})
    }

    floors() {
        let base = ["Alle Etagen"]
        let floors = []
        {this.state.desks.map(desk => (
            floors.push(desk.floor)
        ))}
        floors.sort()
        let filterFloorOptions = base.concat(floors);
        let filterFloor =  Array.from(new Set(filterFloorOptions))
        this.setState({floor: filterFloor})
    }

    filterFloors() {
        let floor = event.target.value
        let kind = document.getElementById("Filter").value
        setAxiosHeaders()
        axios
            .get('/api/v1/floor_desks/', {
                params: {
                    date:  this.state.resDate,
                    floor:  floor,
                    kind: kind
                },
            })
            .then(response => {
                this.setState({desks: response.data}),
                    notify('🦄 Filter aktualisiert')
            })
    }

    filterKinds(event){
        let filter = event.target.value
        setAxiosHeaders()
        axios
            .get('/api/v1/filter_desks/', {
                params: {
                    date:  this.state.resDate,
                    filter:  filter,
                },
            })
            .then(response => {
                let floor = this.state.floor
                let floor_id = document.getElementById('FilterFloor')
                floor_id.value = "Alle Etagen"
                this.setState({
                    desks: response.data,
                    floor: floor})
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
                    floor: ["Alle Etagen"]
                }),
                label.value = "Alle Typen"

                let floorLabel = document.getElementById("FilterFloor")
                let base = ["Alle Etagen"]
                let floors = []
                {this.state.desks.map(desk => (
                    floors.push(desk.floor)
                ))}
                floors.sort()
                let filterFloorOptions = base.concat(floors);
                let filterFloor =  Array.from(new Set(filterFloorOptions))
                this.setState({floor: filterFloor})

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
                    desk_id: id,
                    slots: this.state.slots
                }
            })
             .then(response => {
                 this.setState({desks: response.data}),
                 notify(' 🎉 Reserviert!')
                 //let desk = document.getElementById(id)
                 //desk.style.display = "none";
             })
            .catch((error)=>console.error(error));
        event.preventDefault();
    };

    setImage = kind => {
        if(kind == 'Standard') {
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
        else if(kind == 'Parkplatz') {
            return ParkingSlot
        }
        else if(kind == 'Labor') {
            return Lab
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
            .get('/api/v1/item_desks/', {
                params: {
                    date:  this.state.resDate,
                    items:  items,
                },
            })
            .then(response => {
                this.setState({desks: response.data}),
                this.kinds()
                this.floors()
            })
    }

    TimeSlots(slot, id, external_id) {
        let slotId = document.getElementById(id)
        if (slotId.className.search("active-bg") > 1) {
            slotId.classList.remove('active-bg')
            let slots = this.state.slots
            let arr = slots.filter(e => e !== slot)
            this.setState({slots: arr})
            let button = document.getElementById("Action_" + external_id)
            if (arr.length >= 1) {
                button.style.display = "block";
            } else {
                button.style.display = "none";
            }
        } else {
            slotId.className += " active-bg"
            let slots = this.state.slots
            slots.push(slot)
            this.setState({slots: slots})
            let button = document.getElementById("Action_" + external_id)
            if (slots.length >= 1) {
                button.style.display = "block";
            } else {
                button.style.display = "none";
            }
        }
    }


    render() {
        return (
            <div className="margin-top-xl">
                <ToastContainer />
                <div className="row">
                    <div className="col-sm-12 col-md-4 col-xl-6">
                        <DatePicker
                            className="datepicker"
                            dateFormat="dd/MM/yyyy" selected={this.state.resDate}
                            minDate={moment().toDate()}
                            onChange={this.handleChangeDate}
                            ref={this.userDateRef}/>
                        <Button variant="secondary" className="space"  type="submit" onClick={this.handleFilter.bind(this)}>auswählen</Button>{' '}
                    </div>
                    <div className="col-sm-12 col-md-2 col-xl-2">
                        <div id="" className="filter">
                            <Form>
                                <Form.Group>
                                    <Form.Control id="Filter" as="select"  onChange={this.filterKinds} value={this.state.value}>
                                        {this.state.filter.map(filter => (
                                            <option key={filter}>{filter}</option>
                                        ))}
                                    </Form.Control>
                                    <span className="arrow"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span>
                                </Form.Group>
                            </Form>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-2 col-xl-2">
                        <div id="" className="filter">
                            <Form>
                                <Form.Group>
                                    <Form.Control id="FilterFloor" as="select"  onChange={this.filterFloors} value={this.state.value}>
                                        {this.state.floor.map(filter => (
                                            <option key={filter}>{filter}</option>
                                        ))}
                                    </Form.Control>
                                    <span className="arrow"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span>
                                </Form.Group>
                            </Form>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-2 col-xl-2">
                        <div className="">
                            <div id="Search-items">
                                <Search items={this.state.repos}
                                        placeholder='Platz-ID suchen'
                                        maxSelected={1}
                                        multiple={false}
                                        autoComplete="off"
                                        getItemsAsync={this.getItemsAsync.bind(this)}
                                        onItemsChanged={this.FilterItems.bind(this)} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row margin-top note-icons">
                    {this.state.desks.map(desk => (
                        <div className="col-xl-4 col-md-6 col-sm-12" key={desk.id} id={desk.id}>
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="margin-bottom">
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Platz-Eigenschaft</Tooltip>}><span className="h4">{desk.kind}</span></OverlayTrigger>
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Sicherheitsabstand zum nächsten Sitzplatz</Tooltip>}><span >
                                                    {desk.enough_distance? <img className="distance-image" src={Distance} /> : ``}</span>
                                                </OverlayTrigger>
                                            </div>
                                            <h6><FcAddressBook/>{desk.external_id}</h6>
                                            <h6><FcDepartment/> {desk.floor}</h6>
                                        </div>
                                        <div className="kind-image">
                                            <img  src={this.setImage(desk.kind)} alt="..." ></img>
                                        </div>
                                    </div>
                                    <h6><FcAbout/>{desk.notes? desk.notes : `Keine Angabe`}</h6>
                                    <h6><FcPackage/>{desk.equipment? desk.equipment : `Keine Angabe`}</h6>

                                    <Accordion className="time-slot" defaultActiveKey="0">
                                        <div className="margin-top">
                                            <Accordion.Toggle eventKey="1">
                                                <h6 className="btn btn-primary"><a>Zeit auswählen</a></h6>
                                            </Accordion.Toggle>
                                            <Accordion.Collapse eventKey="1">
                                                <div className="margin-top-sm margin-bottom">
                                                    {desk.slot.map( (slot, index) => (
                                                        <Button variant="light" key={slot} id={desk.external_id + "-" + index}>
                                                            <Badge
                                                                pill
                                                                onClick={() => this.TimeSlots(slot, desk.external_id + "-" + index, desk.external_id)}
                                                            >{slot}
                                                            </Badge>
                                                        </Button>
                                                    ))}
                                                </div>
                                            </Accordion.Collapse>
                                        </div>
                                    </Accordion>

                                    <h6 id={"Action_" + desk.external_id} className="float-right" style={{display: this.state.slots > 1 ? 'block' : 'none' }}>
                                        <a href="#" className="btn btn-primary" onClick={() => this.createReservation(desk.id)}>Buchen</a>
                                    </h6>
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