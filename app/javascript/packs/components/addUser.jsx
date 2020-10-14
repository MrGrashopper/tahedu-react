import React, { Component } from 'react';
import axios from "axios";
import setAxiosHeaders from "./AxiosHeaders";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Form from 'react-bootstrap/Form'
import {toast, ToastContainer} from "react-toastify";

const notify = (message) => toast(message);

class AddUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addUser: [],
        };
    }

    async addEmail(){
        let user = document.getElementById('AddEmail').value
        setAxiosHeaders()
        axios
            .post('/api/v1/add_users', {
                add_user: user
            })
            .then(response => {
                    if(response.data == 400) {notify(' 🎉 Benutzer schon vorhanden')}
                    else if(response.data == 404) {notify(' 🎉 Benutzer nicht gefunden')}
                    else {
                        this.props.handleStateChange(response.data);
                        let input = document.getElementById('AddEmail')
                        input.value = null
                        notify(' 🎉 Benutzer eingeladen')
                    }
            })
            .catch((error)=>console.error(error));

    };

    render() {
        return (
            <Form>
                <ToastContainer />
                <div className="row margin-bottom">
                    <div className="col-xl-12 col-md-12 col-sm-12">
                        <Form.Group controlId="AddEmail">
                            <Form.Label>Benutzer hinzufügen</Form.Label>
                            <div className="row">
                                <div className="col-xl-4 col-md-8 col-sm-12"><Form.Control type="email" placeholder="Enter email"/></div>
                                <div className="col-xl-3 col-md-4 col-sm-12"><a className="btn btn-primary" type="submit" onClick={() => this.addEmail()}>Hinzufügen</a></div>
                            </div>
                            <Form.Text className="text-muted">
                                Nur registrierte Nutzer können ins Team hinzugefügt werden
                            </Form.Text>
                        </Form.Group>
                    </div>
                </div>
            </Form>
        )}
}

export default AddUser