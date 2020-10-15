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
import { AiOutlineDelete } from 'react-icons/ai';
import Modal from 'react-bootstrap/Modal'
import Form from "react-bootstrap/Form";

const notify = (message) => toast(message);
class UsersApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showHide : false,
            users: [],
            removeUser: []
        };
    this.setSupervisor = this.setSupervisor.bind(this)
    this.deleteSupervisor = this.deleteSupervisor.bind(this)
    this.handleStateChange = this.handleStateChange.bind(this);
    }

    handleStateChange(value){
        event.preventDefault();
        this.setState({ users : value })
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

    async deleteSupervisor(){
        setAxiosHeaders()
        axios
            .delete('/api/v1/supervisors', {
                params: {
                    id: this.state.removeUser
                }
            })
            .then(response => {
                this.setState({users: response.data}),
                    notify(' 🎉 Erweiterte Rechte entfernt')
            })
            .catch((error)=>console.error(error));

    };

    handleModalShowHideDelete(user) {
        this.setState({
            showHide: !this.state.showHide ,
            removeUser: user.email
        });
    }

    removeUserFromTeam(user) {
        setAxiosHeaders()
        axios
            .delete('/api/v1/remove_user_from_teams', {
                    params: {
                        email: user
                    }
                })
                    .then(response => {
                        this.setState({users: response.data}),
                            this.handleModalShowHideDelete([]);
                            notify(' 🎉 Benutzer entfernt')
                    })
                    .catch((error)=>console.error(error));
    }

    renderAllUsers = () => {
        return(
            <div className="row">
                <ToastContainer />
                {this.state.users.map(user => (
                    <div className="col-xl-3 col-md-6 col-sm-12" key={user.email}>
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-10">
                                        <h6 className="card-title">{user.email}
                                            <span className="space">
                                                <button><AiOutlineDelete className="red-text icon" onClick={() => this.handleModalShowHideDelete(user)} /></button>
                                            </span>
                                        </h6>
                                            <Modal show={this.state.showHide} size="lg">
                                                <Modal.Header closeButton onClick={() => this.handleModalShowHideDelete([])}>
                                                    <Modal.Title>Benutzer entfernen</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <div>
                                                        <Form>
                                                            <Form.Group controlId="exampleForm.SelectCustom">
                                                                <Form.Label>Möchtest du wirklich {this.state.removeUser} den Zugang zu deinem team entziehen?</Form.Label>
                                                            </Form.Group>
                                                        </Form>
                                                    </div>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={() => this.handleModalShowHideDelete([])}>
                                                        Abbrechen
                                                    </Button>
                                                    <Button variant="primary" onClick={() => this.removeUserFromTeam(this.state.removeUser)}>
                                                        Benutzer entfernen
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                        <p>{user.user_name}{user.supervisor == true ? ` (Supervisor)` : ` (Benutzer)`}</p>
                                            </div>
                                        <div className="col-sm-2"><img src={this.setAvatar(user.avatar)} alt="..." className="thumbnail" disabled style={{ pointerEvents: 'none' }}></img></div>
                                    </div>
                                <div className="small-text margin-bottom">
                                    {user.supervisor == true ?
                                        <a className="red-text"  type="submit"  onClick={() => this.deleteSupervisor(user.id)}>Rechte beschränken</a> :
                                        <a className="purple-text"  type="submit"  onClick={() => this.setSupervisor(user.id)}>Rechte erweitern </a> }
                                </div>
                                <div className="center"><a className="small-text btn btn-primary" href={"pages/reservations/?email=" + user.email}>Buchungen ansehen</a></div>
                            </div>
                        </div>
                    </div>
                    ))}
            </div>
        )
    };
    renderAddUser = () => {
        return(
            <AddUser handleStateChange = {this.handleStateChange}></AddUser>
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