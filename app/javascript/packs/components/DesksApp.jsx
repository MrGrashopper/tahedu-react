import React from 'react'
import ReactDOM from 'react-dom'
import DeskItems from "./desk_items";
import UserReservations from "./userReservations";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

class DesksApp extends React.Component {

    renderAllDesks = () => {
        return(
            <DeskItems></DeskItems>
        )
    }
    renderUserReservations = () => {
        return(
            <UserReservations></UserReservations>
        )
    }

    render() {
        return (
            <Row>
                <Col xs={11}>{this.renderAllDesks()}</Col>
                <Col xs={1}>{this.renderUserReservations()}</Col>
            </Row>
        )
    }
}


document.addEventListener('turbolinks:load', () => {
    const desks = document.getElementById('desk-app')
    desks && ReactDOM.render(<DesksApp />, desks)
});