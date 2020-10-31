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
            chatMessages: []
        };
    }

    componentDidMount() {
        setAxiosHeaders()
        axios
            .get('/api/v1/support_chats', {

            })
            .then(response => {
                this.setState({
                    chatMessages: response.data
                });
                console.log(this.state.chatMessages)
            })
    }

    render() {
        return(
            <div className="card">
                <div className="card-body">
                    <Accordion defaultActiveKey="1">
                        <div>
                            <Accordion.Toggle eventKey="0"><h6><BsChatDots></BsChatDots>Support | Feedback</h6></Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <InputGroup>
                                    <div className="receiver-container">
                                        <p className="receive-chat-message margin-top-sm"> Hallo! Schreibe uns ein Feedback oder stelle eine Frage</p>
                                    </div>
                                    {this.state.chatMessages.map( chat => (
                                        <div className={chat.kind == "admin"? "receiver-container" : "sender-container"} key={chat.id}>
                                            <p className={chat.kind == "admin"? "receive-chat-message margin-top-sm": "sender-chat-message margin-top-sm"}>{chat.message}</p>
                                        </div>
                                    ))}
                                    <FormControl placeholder="Text eingeben" aria-label="Text eingeben"/>
                                    <InputGroup.Append>
                                        <Button><IoMdSend></IoMdSend></Button>
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