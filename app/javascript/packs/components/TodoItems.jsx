import React from 'react'
import PropTypes from 'prop-types'

class TodoItems extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {
        this.props.toggleCompletedTodoItems()
    }
    render() {
        return (
            <>
                <hr />
                <button
                    className="btn btn-outline-primary btn-block mb-3"
                    onClick={this.handleClick}
                >
                    {this.props.hideCompletedTodoItems
                        ? `Alle anzeigen`
                        : `Reservierte Plätze ausblenden `}
                </button>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Zeitraum</th>
                                <th scope="col">Sitzplatz</th>
                                <th scope="col">Stunden</th>
                                <th scope="col">Belegzeit</th>
                                <th scope="col">Reserviert von</th>
                                <th scope="col">Reservieren</th>
                                <th scope="col">Löschen</th>
                            </tr>
                        </thead>
                        <tbody>{this.props.children}</tbody>
                    </table>
                </div>
            </>
        )
    }
}
export default TodoItems

TodoItems.propTypes = {
    toggleCompletedTodoItems: PropTypes.func.isRequired,
    hideCompletedTodoItems: PropTypes.bool.isRequired,
}
