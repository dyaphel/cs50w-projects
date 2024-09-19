from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    pass

class Post ( models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    body =models.TextField()
    date = models.DateTimeField( default=timezone.now)
    like = models.PositiveIntegerField()
    
    def __str__(self):
        return f"Post by {self.user.username} on {self.date}"