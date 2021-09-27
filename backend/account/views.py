from django.shortcuts import render
from django.urls.conf import path
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from django.contrib.auth.models import User

from account.models import UserAccount

from rest_framework.permissions import (
    IsAuthenticatedOrReadOnly,
    AllowAny,
    IsAuthenticated,
)
from rest_framework.decorators import api_view, permission_classes

# Create your views here.
@permission_classes([IsAuthenticated])
class getFriends(APIView):
    def post(self, request, *args, **kargs):
        try:
            userId = request.data['userId']
            user = User.objects.get(id=userId)
            print(user)

            # get the user account
            userAccount = UserAccount.objects.get(user=user)
            friendsListString = (userAccount.friends).split(',')
            friendsListInt = [int(i) for i in friendsListString]
            userFriends = UserAccount.objects.filter(pk__in=friendsListInt)

            finalListOfFriends = []
            for userFriend in userFriends:
                friendObject = {
                    'friend_id': userFriend.id,
                    'user_id': userFriend.user.id,
                    'name': userFriend.user.get_full_name(),
                    'available': userFriend.available,
                    'status': userFriend.status,
                }
                finalListOfFriends.append(friendObject)

            user_message = 'Success getting friends'
            print(user_message)
            return Response(finalListOfFriends, status=status.HTTP_200_OK)
        except:
            user_message = 'Error getting friends'
            print(user_message)
            return Response(user_message, status=status.HTTP_200_OK)


@permission_classes([IsAuthenticated])
class searchFriends(APIView):
    def post(self, request, *args, **kargs):
        try:
            searchTerm = request.data['searchTerm']
            userAccounts = UserAccount.objects.filter(user__email__icontains=searchTerm)[:10]

            finalListOfUserAccounts = []
            for userAccount in userAccounts:
                userAccountObject = {
                    'friend_id': userAccount.id,
                    'user_id': userAccount.user.id,
                    'name': userAccount.user.get_full_name(),
                    'email': userAccount.user.email,
                }
                finalListOfUserAccounts.append(userAccountObject)
         
            return Response(finalListOfUserAccounts, status=status.HTTP_200_OK)
        except:
            user_message = 'Error getting user accounts'
            return Response(user_message, status=status.HTTP_200_OK)



@permission_classes([IsAuthenticated])
class addFriend(APIView):
    def post(self, request, *args, **kargs):
        print(request.data)
        try:
            personAccount = request.data['person_account']
            userAccount = request.data['user_account']

            userAccountInstance = UserAccount.objects.get(id=userAccount)
            personAccountInstance = UserAccount.objects.get(id=personAccount)

            personAccountId = personAccountInstance.id
            userAccountCurrentFriends = userAccountInstance.friends

            if str(personAccountId) not in userAccountCurrentFriends:
                updatedUserAccountFriends = userAccountCurrentFriends+','+str(personAccountId)
                UserAccount.objects.filter(id=userAccount).update(friends=updatedUserAccountFriends)
            else:
                pass

            user_message = 'Success adding friend'
            print(user_message)
            return Response(user_message, status=status.HTTP_200_OK)
        except:
            user_message = 'Error getting user accounts'
            return Response(user_message, status=status.HTTP_200_OK)


@permission_classes([IsAuthenticated])
class deleteFriend(APIView):
    def post(self, request, *args, **kargs):
        print(request.data)
        try:
            personAccount = request.data['person_account']
            userAccount = request.data['user_account']

            userAccountInstance = UserAccount.objects.get(id=userAccount)
            personAccountInstance = UserAccount.objects.get(id=personAccount)

            personAccountId = personAccountInstance.id

            userAccountCurrentFriends = userAccountInstance.friends

            if str(personAccountId) in userAccountCurrentFriends:
                friendsListString = (userAccountCurrentFriends).split(',')
                updatedUserAccountFriends = [int(i) for i in friendsListString]
                updatedUserAccountFriends.remove(personAccountId)

                updatedUserAccountFriendsString = [str(i) for i in updatedUserAccountFriends]
                updatedUserAccountFriendsString = ','.join(updatedUserAccountFriendsString)
                print(updatedUserAccountFriendsString)
                UserAccount.objects.filter(id=userAccount).update(friends=updatedUserAccountFriendsString)
            else:
                pass

            user_message = 'Success deleting friend'
            print(user_message)
            return Response(user_message, status=status.HTTP_200_OK)
        except:
            user_message = 'Error deleting friend'
            return Response(user_message, status=status.HTTP_200_OK)