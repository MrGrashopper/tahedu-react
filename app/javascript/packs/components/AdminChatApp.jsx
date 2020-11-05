import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import setAxiosHeaders from './AxiosHeaders'
import { BsChatDots } from 'react-icons/bs';
import { IoMdSend } from 'react-icons/io';
import Accordion from 'react-bootstrap/Accordion'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'



class AdminChatApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            chatMessages: [],
            user: [],
            id: []
        };
    }

    componentDidMount() {
        let user_id = document.getElementById("admin-chat-app").getAttribute('data-user-id')
        setAxiosHeaders()
        axios
            .get('/api/v1/support_chats', {
                params: {user_id: user_id}
            })
            .then(response => {
                this.setState({
                    chatMessages: response.data,
                    id: response.data[0]['user_id']})
            })
    }

    setUser() {
        let user = document.getElementById("AdminUser").value
        this.setState({
            user: user})
        this.getMessages(user)
    }

    getMessages(user) {
        setAxiosHeaders()
        axios
            .get('/api/v1/support_chats', {
                params: {user: user}
            })
            .then(response => {
                this.setState({
                    chatMessages: response.data,
                    id: response.data[0]['user_id'],
                })
            })
    }

    sendMessage() {
        let room = document.getElementById("room_channel")
        let text = room.value

        setAxiosHeaders()
        axios
            .post('/api/v1/support_chats', {
                message: text,
                id: this.state.id
            })
            .then(
                room.value = ''
            )
    }

    render() {
        return(
            <div className="card">
                <div className="card-body">
                    <Accordion defaultActiveKey="1">
                        <div>
                            <Accordion.Toggle eventKey="0"><h6><BsChatDots></BsChatDots>Chat</h6></Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <InputGroup>
                                    <div className="chat-container margin-top-sm">
                                        {this.state.chatMessages.map( chat => (
                                            <div className={chat.kind == "admin"? "receiver-container" : "sender-container"} key={chat.id}>
                                                <p className={chat.kind == "admin"? "receive-chat-message": "sender-chat-message"}>{chat.message}</p>
                                            </div>
                                        ))}
                                        <div id="newMessages"></div>
                                    </div>
                                    <FormControl
                                        id="room_channel"
                                        data-room-id={this.state.id}
                                        onKeyPress={event => {if (event.key === 'Enter') {this.sendMessage()}}}
                                        placeholder="Text eingeben"
                                        aria-label="Text eingeben"/>
                                    <InputGroup.Append>
                                        <Button onClick={() => this.sendMessage()}><IoMdSend></IoMdSend></Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Accordion.Collapse>
                        </div>
                    </Accordion>
                </div>
            </div>
        )
    }
}

document.addEventListener('turbolinks:load', () => {
    const adminchat = document.getElementById('admin-chat-app')
    adminchat && ReactDOM.render(<AdminChatApp />, adminchat)
})