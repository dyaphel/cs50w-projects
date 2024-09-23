from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    pass

class Post ( models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    body =models.TextField()
    date = models.DateTimeField( default=timezone.now)

def __str__(self):
        return f"Post by {self.user.username} (ID: {self.id})"


class Follow(models.Model):
    #user who is being followed so retrived by username
    users_followed = models.ForeignKey(User, related_name="follower", on_delete=models.CASCADE)
    #user who is logged in and is following someone else
    users_following = models.ForeignKey(User, related_name="following", on_delete=models.CASCADE)

def __str__(self):
    return f"{self.users_followed} follows {self.user_following}"

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')

def __str__(self):
        return f'{self.user} liked this {self.post}'