
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("profile/<str:username>", views.profile, name="profile"),
    path('like/<int:post_id>/', views.like, name='like'),
    path ("follow/<str:username>", views.follow, name="follow"),
    path("following", views.following, name="following"),
    path("newpost", views.newpost, name ="newpost"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("edit/<int:post_id>/", views.edit, name='edit'),
]
