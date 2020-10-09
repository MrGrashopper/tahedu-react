import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import setAxiosHeaders from './AxiosHeaders'
import AddUser from "./addUser";
import MyImage from '/Users/danielmikolai/tahedu-react/app/assets/images/img_avatar.png'
import Avatar from "../../../assets/images/img_avatar.png";
import Button from 'react-bootstrap/Button'
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import DeskItems from "./desk_items";

const notify = (message) => toast(message);
class UsersApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        };
    this.setSupervisor = this.setSupervisor.bind(this)
    this.deleteSupervisor = this.deleteSupervisor.bind(this)
    }

    componentDidMount() {
        setAxiosHeaders()
        axios
            .get('/api/v1/users')
            .then(response => {
                this.setState({ users: response.data });
            })
    }

    setAvatar = avatar => {
        if(typeof avatar != "undefined") {
            return avatar
        }
        else {
            return Avatar
        }
    }

    async setSupervisor(user){
        setAxiosHeaders()
        axios
            .post('/api/v1/supervisors', {
                id: user
            })
            .then(response => {
                console.log(response.data),
                this.setState({users: response.data}),
                    notify(' 🎉 Erweiterte Rechte autorisiert')
            })
            .catch((error)=>console.error(error));

    };

    async deleteSupervisor(user){
        setAxiosHeaders()
        axios
            .delete('/api/v1/supervisors', {
                params: {
                    id: user
                }
            })
            .then(response => {
                this.setState({users: response.data}),
                    notify(' 🎉 Erweiterte Rechte entfernt')
            })
            .catch((error)=>console.error(error));

    };
    renderAllUsers = () => {
        return(
            <div className="row">
                <ToastContainer />
                {this.state.users.map(user => (
                    <div className="col-xl-3 col-md-6 col-sm-12" key={user.email}>
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-10"><h5 className="card-title" >{user.email}</h5></div>
                                    <div className="col-sm-2"><img src={this.setAvatar(user.avatar)} alt="..." className="thumbnail" disabled style={{ pointerEvents: 'none' }}></img></div>
                                </div>
                                <div className="row">
                                    <div  className="col-xl-12 col-md-12 col-sm-12">
                                        <p>{user.supervisor == true ? `Supervisor` : `Benutzer`}</p>
                                        <div>{user.supervisor == true ?
                                            <a className="btn btn-alert"  type="submit"  onClick={() => this.deleteSupervisor(user.id)}>Erweiterte Rechte entfernen</a> :
                                            <a className="btn btn-primary"  type="submit"  onClick={() => this.setSupervisor(user.id)}>Erweiterte Rechte vergeben </a>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    ))}
            </div>
        )
    };
    renderAddUser = () => {
        return(
            <AddUser></AddUser>
        )
    };

    render() {
        return(
            <div>
                {this.renderAddUser()}
                {this.renderAllUsers()}
            </div>
        )
    }
}



document.addEventListener('turbolinks:load', () => {
    const users = document.getElementById('users-app')
    users && ReactDOM.render(<UsersApp />, users)
})