import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { MessageService } from './services/message.service';
import { Message } from './models/message.mode';
import { Subscription } from 'rxjs';
import { FnParam } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('messagesMain', {static: false}) messagesMain!: ElementRef;
  @ViewChild('messageInput', {static: false}) messageInput!: ElementRef;


  private messageModel!: Message;
  public messageForm!: FormGroup;
  public messages: any = [];
  public friend: any;
  public subscription!: Subscription;

  constructor(private authService: AuthService, private messageService: MessageService, private router: Router, public formBuilder: FormBuilder) { 
    this.messageModel = new Message();

    this.messageService.friend.subscribe(
      (friend) => {
        this.friend = friend;
      }
    )
  }

  ngOnInit(): void {

    this.initializeMessageForm();

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
  }

  this.getMessages();

  this.formatDate(new Date);


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
    const data = this.messageForm.getRawValue();

    data.person = this.friend.friend_id;
    data.person_display_name = this.friend.name;
    data.date_time = this.formatDate(new Date);
    

    console.log(data);

    this.messages.push(data);
    this.clearInput();

    // TODO: Send message to server
    
  }

  scrollToBottom(): void {
    try {
        this.messagesMain.nativeElement.scrollTop = this.messagesMain.nativeElement.scrollHeight;
    } catch(err) { }                 
}

  formatDate(date: Date) {
    let rawDate = date;
    console.log('Preparing to parse the date')
    let dateTimeToLocaleString = rawDate.toLocaleString();
    return dateTimeToLocaleString
  }


  getMessages() {
    this.messages = this.messageService.getMessages();
  }

  clearInput() {
    this.messageInput.nativeElement.value = '';
  }

}
