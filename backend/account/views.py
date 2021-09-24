from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from account.models import UserAccount

# Create your views here.

class getFriends(APIView):
    def post(self, request, *args, **kargs):
        print(request.data)
        try:
            friendObject = {

            }
            listOfFriends = request.data['friends']

            friendsFromDb = UserAccount.objects.filter(user__in=listOfFriends)

            print(friendsFromDb)

            user_message = 'Success getting friends'
            print(user_message)
            return Response(user_message, status=status.HTTP_200_OK)

        except:
            user_message = 'Error getting friends'
            print(user_message)
            return Response(user_message, status=status.HTTP_200_OK)
