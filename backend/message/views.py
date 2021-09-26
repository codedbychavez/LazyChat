from message.models import Message
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

from operator import attrgetter

# Create your views here.
@permission_classes([IsAuthenticated])
class saveMessage(APIView):
    def post(self, request, *args, **kargs):
        print(request.data)
        try:
            person = request.data['person']
            personInstance = UserAccount.objects.get(id=person)
            
            user = request.data['user']['id']
            userInstance = User.objects.get(id=user)

            date_time = request.data['date_time']
            message_content = request.data['message']

            message = Message(person=personInstance, user=userInstance, date_time=date_time, message=message_content)
            message.save()
            message_id = message.id

            messageObject = {
                'id': message_id,
                'person': person,
                'user': user,
                'date_time': date_time,
                'message': message_content,
            }

            user_message = 'Success saving message'
            print(user_message)
            return Response(messageObject, status=status.HTTP_200_OK)
        except:
            user_message = 'Error saving message'
            print(user_message)
            return Response(user_message, status=status.HTTP_200_OK)


@permission_classes([IsAuthenticated])
class getMessages(APIView):
    def post(self, request, *args, **kargs):
        print(request.data)
        # try:
        # user, person --> Params
        person = request.data['friend']
        
        user = request.data['user']
        userInstance = User.objects.get(id=user)
        personInstance = UserAccount.objects.get(id=person)

        personToUserInstance = UserAccount.objects.get(user=userInstance)
     
        userToPersonId = personInstance.user.id
        userToPersonInstance = User.objects.get(id=userToPersonId)




        # print('User ins', userInstance)

        # print('Person ins', personInstance)




        messagesTo = Message.objects.filter(person=personInstance, user=userInstance).order_by('id')
        messagesFrom = Message.objects.filter(person=personToUserInstance, user=userToPersonInstance).order_by('id')
        
        matches  = messagesTo | messagesFrom

        # print(matches)
        messagesList = []
        for userMessage in matches:
            messageObject = {
                'id': userMessage.id,
                'person': userMessage.person.id,
                'user': userMessage.user.id,
                'date_time': userMessage.date_time,
                'message': userMessage.message,
            }
            messagesList.append(messageObject)

        user_message = 'Success getting messages'
        print(user_message)
        return Response(messagesList, status=status.HTTP_200_OK)
        # except:
        #     user_message = 'Error getting messages'
        #     print(user_message)
        #     return Response(user_message, status=status.HTTP_200_OK)