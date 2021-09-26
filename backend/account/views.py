from django.shortcuts import render
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
        
        # 
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
                    'status': userFriend.status
                }
                finalListOfFriends.append(friendObject)

            user_message = 'Success getting friends'
            print(user_message)
            return Response(finalListOfFriends, status=status.HTTP_200_OK)

        except:
            user_message = 'Error getting friends'
            print(user_message)
            return Response(user_message, status=status.HTTP_200_OK)
