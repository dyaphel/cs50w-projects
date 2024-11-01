from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Contact(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="contacts")
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    is_favorite = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"