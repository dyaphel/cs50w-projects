from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    Name = models.CharField(max_length=50)
    Surname = models.CharField(max_length=50)
    email = models.EmailField(null=True, blank=True, unique=True) 
    company = models.CharField(max_length=100, blank=True, null=True)
    job_position = models.CharField(max_length=100)
    phone_number_1 = models.CharField(max_length=15)
    phone_number_2 = models.CharField(max_length=15, blank=True, null=True)

    REQUIRED_FIELDS = ['Name', 'Surname', 'phone_number_1']
class Contacts(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="contacts")
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_number1 = models.CharField(max_length=20)
    phone_number2 = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    association = models.CharField(max_length=30)
    is_favorite = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"