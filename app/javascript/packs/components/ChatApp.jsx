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



class ChatApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            chatMessages: [],
            id: []
        };
    }

    componentDidMount() {
        setAxiosHeaders()
        axios
            .get('/api/v1/support_chats', {
            })
            .then(response => {
                this.setState({
                    chatMessages: response.data,
                    id: response.data[0]['user_id']
                });
            })
    }


    sendMessage() {
        let room = document.getElementById("room_channel")
        let text = room.value

        setAxiosHeaders()
        axios
            .post('/api/v1/support_chats', {
                message: text
            })
            .then(
                room.value = ''
            )
    }

    toggleWidth() {
        let chatWindow = document.getElementById("Chat")
        if (chatWindow.style.width < "25rem") {
            chatWindow.style.width = "25rem"
        } else if(chatWindow.style.width == "9rem") {
            chatWindow.style.width = "25rem"
        } else {
            chatWindow.style.width = "9rem"
        }
    }

    render() {
        return(
            <div className="card">
                <div className="card-body">
                    <Accordion defaultActiveKey="1">
                        <div>
                            <Accordion.Toggle eventKey="0" onClick={() => this.toggleWidth()}><h6><BsChatDots></BsChatDots>Support</h6></Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <InputGroup>
                                    <div className="chat-container margin-top-sm">
                                        <div className="receiver-container">
                                            <p className="receive-chat-message margin-top-sm"> Hallo! Schreibe uns ein Feedback oder stelle eine Frage</p>
                                        </div>
                                        {this.state.chatMessages.map( chat => (
                                            <div className={chat.kind == "admin"? "receiver-container" : "sender-container"} key={chat.id}>
                                                <p className={chat.kind == "admin"? "receive-chat-message": "sender-chat-message"}>{chat.message}</p>
                                            </div>
                                        ))}
                                        <div id="newMessages"></div>
                                    </div>
                                    <FormControl
                                        autocomplete="off"
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
    const chat = document.getElementById('chat-app')
    chat && ReactDOM.render(<ChatApp />, chat)
})