import React from 'react'
import ReactDOM from 'react-dom'
import DeskItems from "./desk_items";
import CreateReservation from "./createReservation";

class DesksApp extends React.Component {

    renderAllDesks = () => {
        return(
            <DeskItems></DeskItems>
        )
    }

    renderCreateReservation = () => {
        return(
            <CreateReservation></CreateReservation>
        )
    }

    render() {
        return (
            <div>
                {this.renderCreateReservation()}
                {this.renderAllDesks()}
            </div>
        )
    }
}


document.addEventListener('turbolinks:load', () => {
    const desks = document.getElementById('desk-app')
    desks && ReactDOM.render(<DesksApp />, desks)
})