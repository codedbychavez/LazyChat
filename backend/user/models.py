from django.db import models
from django.contrib.auth.models import User
from django.db.models.deletion import CASCADE


# Create your models here.
class UserAccount(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE)
    accountType = models.CharField(max_length=255)

    def __str__(self):
        return str(self.user.first_name + ' ' + self.user.last_name + ' | ' + self.user.email)