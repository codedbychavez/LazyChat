import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Friend } from './models/friend.model';
import { FriendService } from './services/friend.service';
import { MessageService } from 'src/app/custom/components/dashboard/services/message.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.css']
})
export class LeftNavigationComponent implements OnInit {
  @ViewChild('friendWrapper', {static: false}) friendWrapper!: ElementRef;

  private friendModel!: Friend;
  public friends: any = [];
  public selectedFriend: any;
  public prevSelectedFriend: any;
  private httpParams = new HttpParams();
  public isActive = false;


  constructor(
    private friendService: FriendService, 
    private messageService: MessageService, 
    private renderer: Renderer2,
    ) { 
    this.friendModel = new Friend();

    this.messageService.friend.subscribe(
      (friend) => {
        this.selectedFriend = friend;
        this.httpParams = new HttpParams();
      }
    )
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

  setCurrentFriend(friend: Friend, index: number) {
    friend.selected = true;
    this.messageService.setFriend(friend);

    this.friends.forEach((friend:any, i:any) => {
      if(i != index) {
        friend.selected = false;
      }
    });

    
  }

}
