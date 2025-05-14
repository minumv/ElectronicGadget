

import { EventEmitter, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Message } from '../Models/Message';

@Injectable({
  providedIn: 'root'
})

export class ChatService {

  token = localStorage.getItem('token');
  messageReceived = new EventEmitter<Message>();
  connectionEstablished = new EventEmitter<Boolean>();
  private connectionIsEstablished = false;
  private _hubConnection: signalR.HubConnection;
  constructor() {
    //connection creating..
    this._hubConnection = new signalR.HubConnectionBuilder()
  .withUrl('http://localhost:5155/chathub', {
    accessTokenFactory: () => this.token!,
    transport: signalR.HttpTransportType.WebSockets,
    withCredentials: true
  })
  .configureLogging(signalR.LogLevel.Information)
  .build();

    this.registerOnServerEvents();
    this.startConnection();
  }
  sendMessage(message: Message) {
    this._hubConnection.invoke('SendMessage', message);
  }
  private registerOnServerEvents(): void {
    this._hubConnection.on('ReceiveMessage', (data: any) => {
      this.messageReceived.emit(data);
    });
  }
  private startConnection(): void {
    this._hubConnection
      .start()
      .then(() => {
        this.connectionIsEstablished = true;
        console.log('Hub connection started');
        this.connectionEstablished.emit(true);
      })
      .catch((err:any)=> {
        console.log('Error while establishing connection, retrying...',err);
        setTimeout(() => { this.startConnection(); }, 5000);
      });
  }
 
}