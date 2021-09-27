from django.urls import path
from .views import *

urlpatterns = [

    # Project paths
    path('save_message', saveMessage.as_view()),
    path('get_messages', getMessages.as_view()),
    path('delete_message', deleteMessages.as_view()),



]