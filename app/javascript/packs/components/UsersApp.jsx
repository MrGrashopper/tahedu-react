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
                    <div className="col-sm-3">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-10"><h5 className="card-title" key={user}>{user.email}</h5></div>
                                    <img src={user.avatar_url} alt="..." className="thumbnail" disabled style={{ pointerEvents: 'none' }}></img>
                                </div>
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