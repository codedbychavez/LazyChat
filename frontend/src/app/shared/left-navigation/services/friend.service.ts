import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Friend } from '../models/friend.model';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
    private baseUrl!: string;

    public friends: Friend[] = [];
    private rawFriends = [
        {
            friend_id: 1,
            name: "Chavez Harris",
            available: true,
            status: "Be humble and strive"
        },
        {
            friend_id: 2,
            name: "Emily",
            available: false,
            status: "You are what you believe"
        },
        {
            friend_id: 3,
            name: "Bradly Jons",
            available: true,
            status: "Working from home"
        },
        {
            friend_id: 4,
            name: "Allen Hauls",
            available: true,
            status: "At the Gym!!!"
        }
    ]
  

  constructor(private httpClient: HttpClient, ) { 
      this.baseUrl = environment.restApi.uri;
  }

  getFriends() {
    this.rawFriends.forEach((friend, index) => {
    const friendObject = new Friend();
    friendObject.friend_id = friend.friend_id;
    friendObject.name = friend.name;
    friendObject.available = friend.available;
    friendObject.status = friend.status;
    this.friends.push(friend);
  });

  return this.friends;
}
}
