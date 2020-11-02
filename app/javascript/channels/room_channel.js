import consumer from "./consumer"
import InputGroup from "react-bootstrap/InputGroup";
import React from "react";

document.addEventListener('turbolinks:load', () => {
  setTimeout(function(){
    const element = document.getElementById("room_channel")
    const room_id = element.getAttribute('data-room-id')
    console.log(room_id)
    consumer.subscriptions.create({channel: "RoomChannel", room_id: room_id },{
      connected() {
        console.log("connected to room channel...")
        // Called when the subscription is ready for use on the server
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
      },

      received(data) {
        const kind = data.kind;
        const div = document.createElement("div");
        const tag = document.createElement("p");
        const text = document.createTextNode(data.message);
        const kindContainer = kind == 0 ? "receiver-container" : "sender-container"
        const kindMessage = kind == 0 ? "receive-chat-message": "sender-chat-message"
        div.classList.add(kindContainer);
        tag.classList.add(kindMessage);
        tag.appendChild(text);
        div.appendChild(tag);
        const element = document.getElementById("newMessages");
        element.appendChild(div);
        console.log(data)
        // Called when there's incoming data on the websocket for this channel
      }
    });
  }, 3000);

})
