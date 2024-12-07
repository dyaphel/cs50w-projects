from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(null=True, blank=True, unique=True) 
    company = models.CharField(max_length=100, blank=True)
    job_position = models.CharField(max_length=100)
    phone_number_1 = models.CharField(max_length=15)
    phone_number_2 = models.CharField(max_length=15, blank=True)

    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number_1']

class Contact(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=10)
    birthday = models.DateField(null=True, blank=True)
    surname = models.CharField(max_length=10)
    nickname = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    company = models.CharField(max_length=20, blank=True, null=True)
    job_position = models.CharField(max_length=20, blank=True, null=True)
    phone_number_1 = models.CharField(max_length=15)
    phone_number_2 = models.CharField(max_length=15, blank=True, null=True)
    isFavorite = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.name} {self.surname}"

class Group(models.Model):
    name = models.CharField(max_length=10)
    description = models.TextField(blank=True, null=True)
    admins = models.ManyToManyField(User)
    members = models.ManyToManyField(Contact)
    pinned_message = models.CharField(max_length=255, blank=True, null=True)
    isFavorite = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    

class Event(models.Model):
    title = models.CharField(max_length=200)
    start = models.DateTimeField()
    end = models.DateTimeField(null = True)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, null = True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, null = True)

    def __str__(self):
        return f"{self.title} ({self.start})"