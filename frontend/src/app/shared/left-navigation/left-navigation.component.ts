import { Component, OnInit } from '@angular/core';
import { Friend } from './models/friend.model';
import { FriendService } from './services/friend.service';

@Component({
  selector: 'app-left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.css']
})
export class LeftNavigationComponent implements OnInit {
  private friendModel!: Friend;
  public friends: any = [];

  constructor(private friendService: FriendService) { 
    this.friendModel = new Friend();
  }

  ngOnInit(): void {
    this.getFriends();
  }

  getFriends() {
    this.friends = this.friendService.getFriends();
    this.sortByAvailable(this.friends);
  }

  sortByAvailable(array: any) {
    // sort by boolean
    array.sort((a:any) => a.available == true ? -1 : a.available == false ? 1 : 0);
  }

  setCurrentFriend(friend: Friend) {
    console.log(friend.name);
  }

}
