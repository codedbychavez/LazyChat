import { Component, ElementRef, OnInit, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { Friend } from './models/friend.model';
import { FriendService } from './services/friend.service';
import { MessageService } from 'src/app/custom/components/dashboard/services/message.service';
import { HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.css']
})
export class LeftNavigationComponent implements OnInit {
  @ViewChild('friendWrapper', {static: false}) friendWrapper!: ElementRef;

  private friendModel!: Friend;
  public friends: any;
  public selectedFriend: any;
  public prevSelectedFriend: any;
  private httpParams = new HttpParams();
  public isActive = false;
  public user: any


  constructor(
    private friendService: FriendService, 
    private authService: AuthService,
    private messageService: MessageService, 
    private renderer: Renderer2,
    ) { 
    this.friendModel = new Friend();

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
        console.log(sortedFriends);
        this.friendService.updateFriends(sortedFriends);
      }
    )
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
