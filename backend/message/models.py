from django.contrib.auth.models import User
from django.db.models.deletion import CASCADE
from account.models import UserAccount
from django.db import models

# Create your models here.
class Message(models.Model):
    person = models.ForeignKey(UserAccount, on_delete=CASCADE)
    user = models.ForeignKey(User, on_delete=CASCADE)
    date_time = models.CharField(max_length=255)
    message = models.TextField(max_length=2000)

    def __str__(self):
        return str(self.message)
