import React, { Component } from 'react';


class FilterDesks extends Component {

    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.yearRef = React.createRef()
    }


    render() {
        return (
            <div><button onClick={this.handleSubmit} ref={this.yearRef} value="2021">2021</button></div>

        )
    }
}

export default FilterDesks