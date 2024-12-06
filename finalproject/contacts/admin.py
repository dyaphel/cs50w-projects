from django.contrib import admin
from .models import User, Contact, Group,Event

admin.site.register(User)
admin.site.register(Contact)
admin.site.register(Group)
admin.site.register(Event)
