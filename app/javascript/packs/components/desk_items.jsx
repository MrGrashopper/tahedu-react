import React, { Component } from 'react';
import MyImage from "../../../assets/images/workspace.png";
import axios from "axios";
import setAxiosHeaders from "./AxiosHeaders";


class DeskItems extends Component {
    state = {
        desks: []
    };

    constructor(props) {
        super(props)
        this.handleFilter = this.handleFilter.bind(this)
        this.yearRef = React.createRef()
    }
    componentDidMount() {
        axios
            .get('/api/v1/desks')
            .then(response => {
                this.setState({ desks: response.data });
            })
    }

    handleFilter() {
        setAxiosHeaders()
        axios
            .get('/api/v1/desks/', {
                params: {
                    year:  this.yearRef.current.value,
                },
            })
            .then(response => {
                console.log(response.data)
                this.setState({ desks: response.data });
            })
    }

    render() {
        return (
            <div className="">
                <div className="row">
                    <div className="col-sm-12"><button onClick={this.handleFilter} ref={this.yearRef} value="2021">2021</button></div>
                </div>
                <div className="row">
                    {this.state.desks.map(desk => (
                        <div className="col-sm-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-9"><h5 className="card-title">{desk.name} </h5></div>
                                        <div className="col-sm-3"><img src={MyImage} alt="..." className="thumbnail"></img></div>
                                    </div>

                                    <p className="card-text">{desk.day} {desk.month} {desk.year}</p>
                                    <p className="card-text">{desk.starts_at} bis {desk.ends_at}</p>
                                    <a href="#" className="btn btn-primary">ansehen</a>
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