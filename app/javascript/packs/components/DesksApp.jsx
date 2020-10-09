import React from 'react'
import ReactDOM from 'react-dom'
import DeskItems from "./desk_items";
import UserReservations from "./userReservations";
import 'react-toastify/dist/ReactToastify.css';
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
                <Col lg={10} sm={12}>{this.renderAllDesks()}</Col>
                <Col lg={2} sm={12} className="">{this.renderUserReservations()}</Col>
            </Row>
        )
    }
}


document.addEventListener('turbolinks:load', () => {
    const desks = document.getElementById('desk-app')
    desks && ReactDOM.render(<DesksApp />, desks)
});