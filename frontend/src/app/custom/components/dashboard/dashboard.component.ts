import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
declare var UIkit: any;

// Socket IO import
import { io } from 'socket.io-client';

import { environment } from 'src/environments/environment';
// Services
import { AuthService } from 'src/app/auth/auth.service';
import { MessageService } from '../services/message.service';
import { FriendService } from '../services/friend.service';

// Models
import { Message } from '../models/message.mode';
import { MessageDisplay } from '../models/message-display.mode';
import { AddFriend } from '../models/add-friend.model';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('messagesMain', {static: false}) messagesMain!: ElementRef;
  @ViewChild('messageInput', {static: false}) messageInput!: ElementRef;
  @ViewChild("personInput", { static: true }) personInput!: ElementRef;


  private messageModel!: Message;
  public messageForm!: FormGroup;
  public messages: any = [];
  public friend: any;
  public friends: any;
  public user: any;
  public subscription!: Subscription;
  private baseUrlSocket!: string;
  private socket!: any;

  filteredItems: any;

  friendsArray: any[] = [];

  public addFriendForm!: FormGroup;
  addFriendModel = new AddFriend();

  constructor(
    private authService: AuthService, 
    private messageService: MessageService, 
    private friendService: FriendService,
    private router: Router, 
    public formBuilder: FormBuilder
    ) { 
    this.messageModel = new Message();
    this.addFriendModel = new AddFriend();

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
      (user) => {
        this.user = user;
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
        this.socket.emit("join_chatroom", {room: this.user.account.friend_id, account: this.user.account});
      }, 1000);
    });

    this.socket.on('disconnect', () => {
      setTimeout(() => {
        this.socket.emit("leave_chatroom", {room: this.user.account.friend_id, account: this.user.account});
      }, 1000);
    })  

  // Socket events
    this.socket.on("message_received", (message: any) => {
      this.messages.push(message.data);
      const source = message.data.user;
      this.friends?.forEach((friend: any, index: any) => {
        if(friend.user_id == source) {

          if(!this.friend) {
            this.showNotification(source);

          } else {
            if(this.friend.user_id != source) {
              this.showNotification(source);
            }
          }
        }
      });
    });

      this.socket.on("update_available", async (friendToUpdate: any) => {
        const available = friendToUpdate.data.available;
        const friendToUpdateId = friendToUpdate.data.friend_id;
        this.updateFriendAvailable(available, friendToUpdateId);
      })
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

    this.messageService.saveMessage(message).subscribe(
      (savedMessage) => {
        this.clearInput();
        this.messages.push(savedMessage);
        // Emit event
        this.socket.emit("chat_message", {message: savedMessage, room: this.friend.friend_id});
      }, (err: HttpErrorResponse) => {
        console.log(err);
      }
    ) 
  }
  
  deleteMessage(messageId: any, index: number) {
    this.messages.splice(index, 1);
    this.messageService.deleteMessage(messageId).subscribe(
      (resp) => {
        this.toggle_user_message('message deleted', 'success')
      }, 
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    )
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
  }

// Helper functions
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

  clearInput() {
    this.messageInput.nativeElement.value = '';
  }


  showNotification(source: any) {
      // Inserts a badge with a counter that increments new messages received
      const currentValue = (<HTMLSpanElement>document.getElementById(source)).innerText;
      if(currentValue) {
        const currentValue = (<HTMLSpanElement>document.getElementById(source)).innerText;
        const newVal = parseInt(currentValue) + 1;
        (<HTMLSpanElement>document.getElementById(source)).innerText = newVal.toString();
      } else {
        (<HTMLSpanElement>document.getElementById(source)).innerText = '1';
      }
  }


toggle_user_message(notificationMessage:string, status: string) {
  UIkit.notification(notificationMessage, {pos: 'top-right', timeout:5000, status: status});
}

}
