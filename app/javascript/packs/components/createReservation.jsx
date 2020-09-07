import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import MyImage from "../../../assets/images/workspace.png";
import axios from "axios";
import setAxiosHeaders from "./AxiosHeaders";
import Form from 'react-bootstrap/Form'
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button'
import "react-datepicker/dist/react-datepicker.css";

class CreateReservation extends React.Component{

    constructor(){
        super();
        this.state = {
            showHide : false,
            startDate: new Date(),
            freedesks: [],
        }
        this.reservationRef = React.createRef()
    }

    handleModalShowHide() {
        this.setState({ showHide: !this.state.showHide });
        this.handleFreeDesks();
    }
    handleFreeDesks() {
        setAxiosHeaders()
        axios
            .get('/api/v1/desks', {
                params: {
                    reservation_date: this.state.startDate,
                },
            })
            .then(response => {
                this.setState({ freedesks: response.data });
            })
    }
    handleChangeDate = date => {
        this.setState({
            startDate: date
        });
        this.handleFreeDesks();
    };

    createReservation(){
        axios
            .post('/api/v1/desks', {
                reservation: {
                    date: this.state.startDate,
                    desk: this.reservationRef.current.value
                },
            })
            .then(
                console.log("success")
            )
    };

    render(){
        return(
            <div className="text-right">
                <Button variant="primary" onClick={() => this.handleModalShowHide()} >
                    Platz reservieren
                </Button>

                <Modal show={this.state.showHide} size="lg">
                    <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <Form>
                                <Form.Group controlId="exampleForm.SelectCustom">
                                    <div className="row">
                                        <DatePicker className="btn dark" dateFormat="dd/MM/yyyy" selected={this.state.startDate} onChange={this.handleChangeDate}/>
                                    </div>
                                    <Form.Label>Arbeitsplatz auswählen</Form.Label>
                                    <Form.Control
                                        as="select"
                                        ref={this.reservationRef}
                                        custom>
                                    {this.state.freedesks.map(freedesk => (
                                        <option
                                            key={freedesk.id}
                                        >{freedesk.id}</option>
                                    ))}
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleModalShowHide()}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => this.createReservation()}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }

}

export default CreateReservation;