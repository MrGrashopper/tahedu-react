import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import setAxiosHeaders from './AxiosHeaders'
import MyImage from '/Users/danielmikolai/tahedu-react/app/assets/images/workspace.png'

class DesksApp extends React.Component {
    state = {
        desks: []
    };

    componentDidMount() {
        axios
            .get('/api/v1/desks')
            .then(response => {
                this.setState({ desks: response.data });
                console.log(response.data)
            })
    }

    renderAllDesks = () => {
        return(
            <div className="row">
                {this.state.desks.map(desk => (
                    <div className="col-sm">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-9"><h5 className="card-title" key={desk}>{desk.id} </h5></div>
                                    <div className="col-3"><img src={MyImage} alt="..." className="thumbnail"></img></div>
                                </div>
                                <p className="card-text" key={desk}>{desk.created_at}</p>
                                <a href="#" className="btn btn-primary">Go somewhere</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
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