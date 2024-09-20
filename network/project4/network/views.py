from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils import timezone
from django.contrib import messages
from .models import User, Post, Follow


def index(request):
  posts = Post.objects.order_by('-date').all()
  return render( request, "network/index.html", {
      'posts': posts
  })

@login_required(login_url='login')
def newpost(request):
    if request.method == 'POST':
        post_body = request.POST.get('body')
        if post_body:
            # Ensure that request.user is properly evaluated
            post = Post(user=request.user, body=post_body, date=timezone.now(), like=0)
            post.save()
            messages.success(request, "Your post has been published.")
            return redirect('index')  # Redirect to prevent form resubmission on refresh
    
    return render(request, "network/newpost.html")

def profile(request, username):
    user = User.objects.get(username=username)
    posts = Post.objects.filter(user=user).order_by('date').all()
    followers = Follow.objects.filter(follower = user).count()
    following = Follow.objects.filter(following = user).count()
    return render(request, 'network/profile.html', {
        'profile_user': user,
        'posts': posts,
        'followers': followers,
        'following':following,  
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
