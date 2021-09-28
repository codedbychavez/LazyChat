import { Component, OnInit, DoCheck, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
declare var UIkit: any;

// Services
import { AuthService } from 'src/app/auth/auth.service';
import { FriendService } from '../../services/friend.service';
import { MessageService } from '../../services/message.service';

// Models
import { AddFriend } from '../../models/add-friend.model';




@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, DoCheck {
  @ViewChild("personInput", { static: true }) personInput!: ElementRef;

  public addFriendForm!: FormGroup;
  public addFriendModel = new AddFriend();
  public friend: any;
  public user: any;

  filteredItems: any;
  friendsArray: any[] = [];

  showNavBar!: boolean;

  constructor(
    private authService: AuthService,
    private friendService: FriendService,
    private messageService: MessageService, 
    public formBuilder: FormBuilder
    ) {
      this.addFriendModel = new AddFriend();

      this.messageService.friend.subscribe(
        (friend) => {
          this.friend = friend;
        }
      )
      this.authService.userIdFromJwt.subscribe(
        (user) => {
          this.user = user;
        }
      )
     }

  ngOnInit(): void {
    this.showNavBar = this.authService.checkIfUserLoggedIn();
    this.initializeAddFriendform();

  }
  ngDoCheck() {
    this.showNavBar = this.authService.checkIfUserLoggedIn();

  }

  initializeAddFriendform(): void {
    this.addFriendForm = this.formBuilder.group({
      person_account: [this.addFriendModel.person_account, Validators.required],
    });
  }

  addFriendFormSubmit() {
    const data = this.addFriendForm.getRawValue();
    data.user_account = this.user.account.friend_id;
    if(data.person_account != data.user_account) {
      this.friendService.addFriend(data).subscribe(
        (resp) => {
          this.toggle_user_message('friend added', 'success');
          this.clearInput();
          this.getFriends();
        }, 
        (err: HttpErrorResponse) => {
          
        }
      )
    } else {
      this.toggle_user_message('cannot be friends with yourself', 'danger');

    }

}

getFriends() {
  this.friendService.getFriends(this.user.id).subscribe(
    (friends) => {
      const sortedFriends = this.friendService.sortByAvailable(friends);
      this.friendService.updateFriends(sortedFriends);
    }
  )
}
  
// Helper functions
selectPerson(id: number) {
  this.filteredItems = [];
  const selectedPersonName = this.friendsArray.find(x => x.id === id)?.name;
  const selectedPersonId = this.friendsArray.find(x => x.id === id)?.friend_id;

  this.personInput.nativeElement.value = selectedPersonName;
  this.addFriendForm.patchValue({
    person_account: selectedPersonId,
  });
  this.addFriendForm.setErrors(null);
}

assignCopy(){
  this.filteredItems = Object.assign([], this.friendsArray);
}

filterItem(value: any){
  if(!value){
      // when nothing has typed
      this.assignCopy();
      this.addFriendForm.controls['person_account'].setErrors({'required': true});
  } 

  this.friendService.searchFriends(value).subscribe(
    (results) => {
      this.friendsArray = results;
      this.filteredItems = Object.assign([], this.friendsArray).filter(
        (item: { email: string; }) => item.email.toLowerCase().indexOf(value.toLowerCase()) > -1
      )
    
      if(value.length <= 1) {
        this.filteredItems = [];
      }
    }, 
    (err: HttpErrorResponse) => {
      console.log(err)
    }
  )
}

clearInput() {
  this.personInput.nativeElement.value = '';
  this.addFriendForm.reset();
}

toggle_user_message(notificationMessage:string, status: string) {
  UIkit.notification(notificationMessage, {pos: 'top-right', timeout:5000, status: status});
}

  logOut() {
    this.authService.logoutUser();
  }
  


}
