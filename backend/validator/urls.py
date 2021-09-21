from django.urls import path
from .views import *

urlpatterns = [

    # Project paths
    path('email', emailValidator.as_view()),

]