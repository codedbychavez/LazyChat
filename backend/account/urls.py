from django.urls import path
from .views import *

urlpatterns = [

    # Project paths
    path('get_friends', getFriends.as_view()),

]