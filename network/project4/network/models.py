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
    return f"Post by {self.user.username} (ID: {self.id})"



class Follow(models.Model):
    follower = models.ForeignKey(User, related_name="follower", on_delete=models.CASCADE)
    following = models.ForeignKey(User, related_name="following", on_delete=models.CASCADE)

def __str__(self):
    return f"{self.follower} follows {self.following}"