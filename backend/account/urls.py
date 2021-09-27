from django.urls import path
from .views import *

urlpatterns = [

    # Project paths
    path('get_friends', getFriends.as_view()),
    path('search_friends', searchFriends.as_view()),
    path('add_friend', addFriend.as_view()),
    path('delete_friend', deleteFriend.as_view()),




]