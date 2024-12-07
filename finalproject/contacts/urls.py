
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
    path('group/<int:id>/edit_group/', views.edit_group, name='edit_group'),
    path('delete_groups', views.delete_groups, name='delete_groups'),
    path("add_group",views.add_group, name="add_group"),
    path('toggle_favorite_groups/<int:id>/', views.toggle_favorite_group, name='toggle_favorite_group'),

    path("group/<int:id>/remove/",views.remove_members, name="remove_members"),
    path("group/<int:id>/add/", views.add_members, name="add_members"),


    path('calendar', views.calendar, name="calendar"),
    path('api/calendar-events/', views.calendar_events_api, name='calendar_events_api'),
    path('api/add-event/', views.add_event, name='add_event'),
    path('api/contacts/', views.contacts_api, name='contacts_api'),
    path('api/groups/', views.groups_api, name='groups_api'),
     path('api/event-conflict/', views.event_conflict, name='check_event_conflict'),

    #path('event-details/<int:id>/', views.event_details, name='event_details'),

    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
]
