import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { MessageService } from './services/message.service';
import { Message } from './models/message.mode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

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

    console.log(data);
    // TODO: Send message to server
  }


  getMessages() {
    this.messages = this.messageService.getMessages();
  }

}
