import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message.mode';
import { Observable, Subject } from 'rxjs';
import { Friend } from 'src/app/shared/left-navigation/models/friend.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl!: string;
  friend = new Observable<Friend>();

  private friendSubject!: Subject<Friend>;
  

  public messages: Message[] = [];
  private rawMessages = [
    {
      id: 1, 
      person: 1,
      person_display_name: "Emily",
      date_tme: "Thu Sep 23 2021 05:12:43",
      message: "hello"
    },
    {
      id: 2, 
      person: 2,
      person_display_name: "Chavez Harris",
      date_tme: "Thu Sep 23 2021 05:15:43",
      message: "hey hows it going"
    },
    {
      id: 3, 
      person: 2,
      person_display_name: "Chavez Harris",
      date_tme: "Thu Sep 23 2021 05:16:43",
      message: "?"
    },
    {
      id: 4,
      person: 1,
      person_display_name: "Emily",
      date_tme: "Thu Sep 23 2021 05:18:43",
      message: "I want food chav"
    }
  ];

  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.restApi.uri;

    this.friendSubject = new Subject<Friend>();
    this.friend = this.friendSubject.asObservable();
   }

   setFriend(friend: Friend) {
     this.friendSubject.next(friend);
   }

   saveMessage(message: any) {
     return this.httpClient.post<any>(
       this.baseUrl + '/message/send_message', message
     )
   }



   getMessages() {
       this.rawMessages.forEach((message, index) => {
       const messageObject = new Message();
       messageObject.id = message.id;
       messageObject.person = message.person;
       messageObject.person_display_name = message.person_display_name;
       messageObject.date_time = message.date_tme;
       messageObject.message = message.message;
       this.messages.push(messageObject);
     });

     return this.messages;
   }

}
