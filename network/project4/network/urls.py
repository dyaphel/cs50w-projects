
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("profile/<str:username>", views.profile, name="profile"),
     path('like/<int:post_id>/', views.toggle_like, name='toggle_like'),
    path ("toggle_follow/<str:username>", views.toggle_follow, name="toggle_follow"),
    path("following", views.following, name="following"),
    path("newpost", views.newpost, name ="newpost"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
   path('edit-post/<int:post_id>/', views.edit_post, name='edit_post'),
]
