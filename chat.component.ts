

import { Component, NgZone } from '@angular/core';
import { Message } from '../Models/Message';
import { ChatService } from '../Services/chat.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  title = 'ClientApp';
  txtMessage: string = '';
  currentuserid: string ='';
  selectedChatUserId : string = '';
  selectedCustomerId : string = '';
  role : string = '';
  adminid = "e4c8d11a-9148-4f65-95df-f84af3476fcb";
  uniqueID: string = new Date().getTime().toString();  
  messages = new Array<Message>();
  message = new Message();
  constructor(
    private chatService: ChatService,
    private _ngZone: NgZone
  ) {
    this.subscribeToEvents();
    this.currentuserid = localStorage.getItem('customerId') || '';
    this.selectedCustomerId = this.currentuserid;
    this.role = localStorage.getItem('userRole')||'';
    if (this.role === 'Admin') {
      this.selectedChatUserId= "e8eb3ee0-fc21-45fb-88ce-261a4585e125";
      //this.selectedChatUserId = this.selectedCustomerId?.toLowerCase();      
    } else {
      this.selectedChatUserId = this.adminid.toLowerCase();
    }
       
  }

  
  sendMessage(): void {
    console.log("role: ",this.role);
    console.log('Normalized role:', (this.role || '').trim().toLowerCase());
    console.log("current user:", this.currentuserid);
  console.log("selected recevr:",this.selectedChatUserId)
  if (this.txtMessage.trim()) {
    const newMsg: Message = {
      content: this.txtMessage,
      date: new Date(),
      
      receiverid: this.selectedChatUserId
    };
    this.chatService.sendMessage(newMsg);  // Send to backend via SignalR
    console.log("sending....",newMsg)
    this.txtMessage = '';
  }
    //console.log("Meassage Array:", this.messages)
  }
  private subscribeToEvents(): void {
    this.chatService.messageReceived.subscribe((message: Message) => {
      console.log("initial subscribe");
      this._ngZone.run(() => {
        console.log("inside ngzone run");
        console.log("message:",message);
       
      message.receiverid = message.receiverid.toLowerCase();

      console.log("sender:",message.senderid);

      // Push only if relevant to this chat
      if (
        (message.receiverid === this.selectedChatUserId) ||
        ( message.receiverid === this.currentuserid)
      ) {
        console.log("Incoming message:", message);
        this.messages.push(message);
      }
      });
    });
  }
}