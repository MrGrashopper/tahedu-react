import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import setAxiosHeaders from './AxiosHeaders'
import MyImage from '/Users/danielmikolai/tahedu-react/app/assets/images/img_avatar.png'

class UsersApp extends React.Component {
    state = {
        users: []
    };

    componentDidMount() {
        axios
            .get('/api/v1/users')
            .then(response => {
                this.setState({ users: response.data });

            })
    }

    renderAllUsers = () => {
        return(
            <div className="row">
                {this.state.users.map(user => (
                    <div className="col-sm">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-9"><h5 className="card-title" key={user}>{user.first_name} {user.last_name}</h5></div>
                                    <div className="col-3"><img src={MyImage} alt="..." className="thumbnail"></img></div>
                                </div>
                                <p className="card-text" key={user}>{user.skills}</p>
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
                {this.renderAllUsers()}
            </div>
        )
    }
}



document.addEventListener('turbolinks:load', () => {
    const users = document.getElementById('users-app')
    users && ReactDOM.render(<UsersApp />, users)
})