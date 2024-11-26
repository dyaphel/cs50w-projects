
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("update_profile", views.update_profile, name="update_profile"),

    path("contacts", views.contacts, name="contacts"),
    path("add_contact",views.add_contact, name="add_contact"),
    path('delete_contacts', views.delete_contacts, name='delete_contacts'),
    path('contact/<int:id>/', views.contact_detail, name='contact_detail'),
    path('contact/<int:id>/edit_contact/', views.edit_contact, name='edit_contact'),
    path('toggle_favorite_contacts/<int:contact_id>/', views.toggle_favorite_contact, name='toggle_favorite_contact'),

    path('favorites',views.favorites, name="favorites"),

    path('groups',views.groups, name="groups"),
    path('group/<int:id>/', views.group_detail, name="group_detail"),

    path('delete_groups', views.delete_groups, name='delete_groups'),
    path("add_group",views.add_group, name="add_group"),
    path('toggle_favorite_groups/<int:group_id>/', views.toggle_favorite_group, name='toggle_favorite_group'),

    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
]
