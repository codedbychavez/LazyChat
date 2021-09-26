import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message.mode';
import { Observable, Subject } from 'rxjs';
import { Friend } from 'src/app/custom/components/models/friend.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl!: string;
  public friend = new Subject<Friend>();

  public friend$ = this.friend.asObservable();

  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.restApi.uri;
   }

   setFriend(friend: Friend) {
     this.friend.next(friend);
   }

   saveMessage(message: any) {
     return this.httpClient.post<any>(
       this.baseUrl + '/message/save_message', message
     )
   }



   getMessages(user: number, friend: number) {
    return this.httpClient.post<any>(
      this.baseUrl + '/message/get_messages', {user, friend}
    )
   }

}
