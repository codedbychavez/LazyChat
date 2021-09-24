from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from django.contrib.auth.models import User

from account.models import UserAccount

# Create your views here.

class create(APIView):
   
    def post(self, request, *args, **kwargs):
        print(request.data)
        try:
            userObject = {
            'firstName': request.data['firstName'],
            'lastName': request.data['lastName'],
            'email': request.data['email'],
            'password': request.data['password'],
            'confirmPassword': request.data['confirmPassword']
            }
            accountType = request.data['accountType']
            user = createUser(userObject)
            if(user):
                userAccount = UserAccount.objects.create(user=user, accountType=accountType)
                userAccount.save()
            pass
            # Create user account

            user_message = 'Success creating user'
            print(user_message)
            return Response(user_message, status=status.HTTP_200_OK)
        except:
            user_message = 'Error creating user'
            return Response(user_message, status=status.HTTP_400_BAD_REQUEST)


# Helper functions
def createUser(userObject):
    userName = userObject['email']
    firstName = userObject['firstName']
    lastName = userObject['lastName']
    email = userObject['email']
    password = userObject['password']
    confirmPassword = userObject['confirmPassword']

    is_staff = False

    if password == confirmPassword:
        user = User.objects.create_user(
            username=userName,
            first_name=firstName,
            last_name = lastName,
            email=email,
            password=password,
            is_staff=is_staff)
        return user
        