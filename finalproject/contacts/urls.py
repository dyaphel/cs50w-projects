
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("update_profile", views.update_profile, name="update_profile"),
    path("contacts", views.contacts, name="contacts"),
    path("add_contact",views.add_contact, name="add_contact"),
    path("delete_contacts/", views.delete_contacts, name="delete_contacts"),
    path('contact/<int:id>/', views.contact_detail, name='contact_detail'),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
