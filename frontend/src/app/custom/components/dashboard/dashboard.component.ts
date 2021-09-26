import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { MessageService } from '../services/message.service';

import { Message } from '../models/message.mode';
import { MessageDisplay } from '../models/message-display.mode';

import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

// Socket IO import
import { io } from 'socket.io-client';
import { HttpErrorResponse } from '@angular/common/http';
import { FriendService } from '../services/friend.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('messagesMain', {static: false}) messagesMain!: ElementRef;
  @ViewChild('messageInput', {static: false}) messageInput!: ElementRef;


  private messageModel!: Message;
  private messageDisplayModel!: MessageDisplay;
  public messageForm!: FormGroup;
  public messages: any = [];
  public friend: any;
  public friends: any;
  public user: any;
  public subscription!: Subscription;
  private baseUrlSocket!: string;
  private socket!: any;

  constructor(
    private authService: AuthService, 
    private messageService: MessageService, 
    private friendService: FriendService,
    private router: Router, 
    public formBuilder: FormBuilder
    ) { 
    this.messageModel = new Message();
    this.messageDisplayModel = new MessageDisplay();
    this.baseUrlSocket = environment.socketApi.uri;
    this.socket = io(this.baseUrlSocket);

    this.messageService.friend.subscribe(
      (friend) => {
        this.friend = friend;
        if(this.friend) {
          this.getMessages(this.user.id, this.friend.friend_id);
        }
      }
    )

    this.friendService.friends$.subscribe(
      (friends) => {
        this.friends = friends;
      }
    )

    this.authService.userIdFromJwt.subscribe(
      (userId) => {
        this.user = userId;
      }
    )
  }

  ngOnInit(): void {

    this.initializeMessageForm();

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
  }


  this.formatDate(new Date);
    

  }


  ngAfterViewInit(): void {

    this.socket.on('connect', () => {
      setTimeout(() => {
        // this.getFriends();
        // Join a chatroom
        this.socket.emit("join_chatroom", {room: this.user.account.friend_id, account: this.user.account});
        // Set status
      }, 1000);
    });

    this.socket.on('disconnect', () => {
      setTimeout(() => {
        // this.getFriends();
        // Join a chatroom
        this.socket.emit("leave_chatroom", {room: this.user.account.friend_id, account: this.user.account});

      }, 1000);
    })  
    
  // listen for events - Global

  // message received events
    this.socket.on("message_received", (message: any) => {
      this.messages.push(message.data);
      // Extract the source
      const source = message.data.user;
      this.friends?.forEach((friend: any, index: any) => {
        if(friend.user_id == source) {
          // Check if the friend is active
          if(!this.friend) {
            // Create notification
            
          }
          console.log('the active friend is: ', this.friend)
          console.log('Lets notify: ', friend);
        }
      });

      console.log(message.data);
    });

      this.socket.on("update_available", async (friendToUpdate: any) => {
        const available = friendToUpdate.data.available;
        const friendToUpdateId = friendToUpdate.data.friend_id;
        this.updateFriendAvailable(available, friendToUpdateId);
        
      })

      setTimeout(() => {

      }, 2000);


    } // Closes ngAfterViewInit

   
    updateFriendAvailable(available: boolean, idToUpdate: number) {
      this.friends.forEach((friend:any) => {
        if(friend.friend_id == idToUpdate) {
          friend.available = available;
        }
      });

      return this.friendService.sortByAvailable(this.friends);
    }

  initializeMessageForm(): void {
    this.messageForm = this.formBuilder.group({
        id: this.messageModel.id,
        person: this.messageModel.person,
        date_time: this.messageModel.date_time,
        message: this.messageModel.message,
      }
    )
  }

  messageFormSubmit() {
    const message = this.messageForm.getRawValue();

    message.person = this.friend.friend_id;
    message.user = this.user;
    message.date_time = this.formatDate(new Date);

    // TODO: Save message to backend db
    this.messageService.saveMessage(message).subscribe(
      (savedMessage) => {
        // Clear the input
        this.clearInput();
        // Append to array
        this.messages.push(savedMessage);


        this.socket.emit("chat_message", {message: savedMessage, room: this.friend.friend_id});
      }, (err: HttpErrorResponse) => {
        console.log(err);
      }
    ) 
    
  }

  scrollToBottom(): void {
    try {
        this.messagesMain.nativeElement.scrollTop = this.messagesMain.nativeElement.scrollHeight;
    } catch(err) { }                 
}

  formatDate(date: Date) {
    let rawDate = date;
    let dateTimeToLocaleString = rawDate.toLocaleString();
    return dateTimeToLocaleString
  }


  getMessages(user: number, friend: any) {

    this.messageService.getMessages(user, friend).subscribe(
      (messages) => {
        this.messages = messages;
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    )

    // this.messages = this.messageService.getMessages();
  }

  clearInput() {
    this.messageInput.nativeElement.value = '';
  }

}
