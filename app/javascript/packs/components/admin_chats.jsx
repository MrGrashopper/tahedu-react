import React, {Component} from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import setAxiosHeaders from "./AxiosHeaders";
import axios from "axios";
import { IoMdSend } from 'react-icons/io';

class AdminChats extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chatMessages: [],
            id: this.props.userId
        };
        this.chatMessages = this.chatMessages.bind(this)
    }

    chatMessages() {
        setAxiosHeaders()
        axios
            .get('/api/v1/support_chats', {
                params: {user:this.state.id}
            })
            .then(response => {
                this.setState({
                    chatMessages: response.data})
            },
            )
    }

    sendMessage() {
        let user = document.getElementById("AdminUser").value
        let room = document.getElementById("room_channel")
        let text = room.value

        setAxiosHeaders()
        axios
            .post('/api/v1/support_chats', {
                message: text,
                email: user
            })
            .then(
                room.value = ''
            )
    }
    render() {
        return (
            <div>
                <div className="card">
                    <div className="card-body">
                        <InputGroup>
                            <div className="chat-container margin-top-sm">
                                {this.state.chatMessages.map( chat => (
                                    <div className={chat.kind == "admin"? "receiver-container" : "sender-container"} key={chat.id}>
                                        <p className={chat.kind == "admin"? "receive-chat-message": "sender-chat-message"}>{chat.message}</p>
                                    </div>
                                ))}
                                <div id="newMessages"></div>
                            </div>
                            <div>
                                <FormControl
                                    id={"room_channel_" + this.state.id}
                                    data-room-id={this.state.id}
                                    onKeyPress={event => {if (event.key === 'Enter') {this.sendMessage()}}}
                                    placeholder="Text eingeben"
                                    aria-label="Text eingeben"/>
                            </div>
                            <InputGroup.Append>
                                <Button onClick={() => this.sendMessage()}><IoMdSend></IoMdSend></Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                </div>
            </div>
        )}
}

export default AdminChats