import React from 'react'
import ReactDOM from 'react-dom'
import DeskItems from "./desk_items";

class DesksApp extends React.Component {

    renderAllDesks = () => {
        return(
            <DeskItems></DeskItems>
        )
    }

    render() {
        return (
            <div>
                {this.renderAllDesks()}
            </div>
        )
    }
}


document.addEventListener('turbolinks:load', () => {
    const desks = document.getElementById('desk-app')
    desks && ReactDOM.render(<DesksApp />, desks)
})