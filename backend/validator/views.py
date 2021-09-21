from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


# import django's user model

from django.contrib.auth.models import User

# Create your views here.

class emailValidator(APIView):

    def post(self, request, *args, **kargs):
        try:
            email = request.data['email']
            count = User.objects.filter(email=email).count()
            if(count == 1):
                return Response(True, status=status.HTTP_200_OK)
            else:
                return Response(False, status=status.HTTP_200_OK)
        except:
            userMessage = "Error validating email"
            return Response(userMessage, status=status.HTTP_400_BAD_REQUEST)
        
