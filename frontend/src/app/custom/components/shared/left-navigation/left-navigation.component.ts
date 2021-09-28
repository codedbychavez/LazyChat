import { Component, ElementRef, OnInit, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
declare var UIkit: any;

// Models
import { Friend } from '../../models/friend.model';
// Services
import { FriendService } from '../../services/friend.service';
import { MessageService } from 'src/app/custom/components/services/message.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.css']
})
export class LeftNavigationComponent implements OnInit {
  @ViewChild('friendWrapper', {static: false}) friendWrapper!: ElementRef;

  public friends: any;
  public selectedFriend: any;
  public prevSelectedFriend: any;
  public isActive = false;
  public user: any


  constructor(
    private friendService: FriendService, 
    private authService: AuthService,
    private messageService: MessageService, 
    ) { 
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

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getFriends();
  }, 1000);
  }


  getFriends() {
    this.friendService.getFriends(this.user.id).subscribe(
      (friends) => {
          const sortedFriends = this.friendService.sortByAvailable(friends);
          this.friendService.updateFriends(sortedFriends);
      }, 
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    )
  }
  
  deleteFriend(friendId: any, index: any) {
    const data = {
      'user_account': this.user.account.friend_id,
      'person_account': friendId,
    }
    this.friends.splice(index, 1);
    this.friendService.deleteFriend(data).subscribe(
      (resp) => {
        this.toggle_user_message('friend removed', 'success')
      }, 
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    )
  }

  // Helper functions
  setCurrentFriend(friend: any, index: number) {
    // Clear message notification
    (<HTMLSpanElement>document.getElementById(friend.user_id)).innerText = ''

    friend.selected = true;
    this.messageService.setFriend(friend);

    this.friends.forEach((friend:any, i:any) => {
      if(i != index) {
        friend.selected = false;
      }
    });
  }


  toggle_user_message(notificationMessage:string, status: string) {
    UIkit.notification(notificationMessage, {pos: 'top-right', timeout:5000, status: status});
  }

}
