import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
    private baseUrl!: string;

    public friends = new Subject<any>(); 
    public friends$ = this.friends.asObservable()

    public user: any;
    public friendsVar: any[] = [];
   

  constructor(
    private httpClient: HttpClient, 
    private authService: AuthService,
    ) { 
      this.baseUrl = environment.restApi.uri;

      this.authService.userIdFromJwt.subscribe(
        (user) => {
          this.user = user;
        }
      )
      
  }

  updateFriends(friends: any) {
    this.friends.next(friends);
  }


getFriends(userId: number) {
    return this.httpClient.post<any>(
        this.baseUrl + '/account/get_friends', {userId}
    )
  }

  addFriend(friendRequest: any) {
    return this.httpClient.post<any>(
        this.baseUrl + '/account/add_friend', friendRequest
    )
  }

  deleteFriend(data: any) {
    return this.httpClient.post<any>(
        this.baseUrl + '/account/delete_friend', data
    )
  }

searchFriends(searchTerm: string) {
  return this.httpClient.post<any>(
    this.baseUrl + '/account/search_friends', {searchTerm}
)
}

//  Helper functions
sortByAvailable(array: any) {
  // sort by boolean
  return array.sort((a:any) => a.available == true ? -1 : a.available == false ? 1 : 0);
}


}
