import React, { Component } from 'react';
import axios from "axios";
import setAxiosHeaders from "./AxiosHeaders";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Form from 'react-bootstrap/Form'

class AddUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addUser: [],
        };
    }
    render() {
        return (
            <Form>
                <div className="row margin-bottom">
                    <div className="col-xl-12 col-md-12 col-sm-12">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Mitgied hinzufügen</Form.Label>
                            <div className="row">
                                <div className="col-xl-4 col-md-8 col-sm-12"><Form.Control type="email" placeholder="Enter email" /></div>
                                <div className="col-xl-3 col-md-4 col-sm-12"><a className="btn btn-primary" type="submit">Hinzufügen</a></div>
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