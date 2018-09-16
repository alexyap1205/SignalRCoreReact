import React, {Component} from 'react';
import * as signalR from "@aspnet/signalr";
import axios from 'axios';

class ChatComponent extends Component {
    state = {
        hubConnection: null,
        inputValue: '',
        messages: []
    };

    componentDidMount = () => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5000/chatHub")
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.setState({hubConnection: connection}, () => {
            this.state.hubConnection
                .start()
                .then((response) => console.log('connected: ', response))
                .catch(err => console.error(err));

            this.state.hubConnection.on("MessageFromServer", (message) => {
                this.setState({messages: this.state.messages.concat(message)});
            });
            }
        );


    };

    onInputchange = (event) => {
        this.setState({inputValue: event.target.value});
    };

    onSendClicked = () => {
        console.log('sending: ', this.state.inputValue);
        axios.post('http://localhost:5000/api/values', '"' + this.state.inputValue + '"', {headers: {"Content-Type": "application/json"}})
            .then(response => console.log(response))
            .catch(error => console.log(error));
    };

    render() {
        const messagesDisplay = this.state.messages.map((message, index) => {
            return <li key={index}>{message}</li>
        });

        return (
            <div>
                <input type="text" onChange={this.onInputchange}/>
                <button onClick={this.onSendClicked}>Send</button>
                <ul>
                    {messagesDisplay}
                </ul>
            </div>
        );
    }
}

export default ChatComponent;