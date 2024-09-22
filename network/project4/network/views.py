from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils import timezone
from django.contrib import messages
from django.core.paginator import Paginator
from django.http import JsonResponse
import json
from .models import User, Post, Follow



def index(request):
  posts = Post.objects.order_by('-date').all()
  paginator = Paginator(posts, 10)
  page_number = request.GET.get('page')
  page_obj = paginator.get_page(page_number)
  return render( request, "network/index.html", {
      'posts': posts,
      'page_obj': page_obj,
  })

@login_required
def edit_post(request, post_id):
    if request.method == 'POST' and request.user.is_authenticated:
        post = Post.objects.get(id=post_id, user=request.user)
        data = json.loads(request.body)
        new_body = data.get('body')

        if(new_body):
            post.body = new_body
            post.save()
            return JsonResponse({'success': True})
        
        return JsonResponse({'success': False, 'error': 'No content provided'})
    return JsonResponse({'success': False, 'error': 'Invalid request method or unauthorized'})


@login_required(login_url='login')
def newpost(request):
    if request.method == 'POST':
        post_body = request.POST.get('body')
        if post_body:
            post = Post(user=request.user, body=post_body, date=timezone.now(), like=0)
            post.save()
            messages.success(request, "Your post has been published.")
            return redirect('index')
    
    return render(request, "network/newpost.html")

def profile(request, username):
    user = User.objects.get(username=username)
    posts = Post.objects.filter(user=user).order_by('date').all()
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    followers = Follow.objects.filter(users_followed = user).count()
    following = Follow.objects.filter(users_following = user).count()

    isFollowing = False
    if request.user.is_authenticated:
        isFollowing = Follow.objects.filter(users_followed=user, users_following=request.user).exists()


    return render(request, 'network/profile.html', {
        'profile_user': user,
        #'posts': posts,
        'followers': followers,
        'following':following,  
        'isFollowing':isFollowing,
        'page_obj': page_obj,
    })

@login_required
def toggle_follow(request, username):
    # The user that is being followed (the profile's user)
    user_followed = User.objects.get(username=username)
    # The user who is following (the current logged-in user)
    user_following = request.user
    
    if user_following != user_followed:
        # Check if a follow relationship already exists
        follow, created = Follow.objects.get_or_create(
            users_followed= user_followed,
            users_following = user_following 
        )
        if not created:
            follow.delete()
    return redirect('profile', username=username)

@login_required
def following(request):
    following = Follow.objects.filter(users_following=request.user).values_list('users_followed')
    posts = Post.objects.filter(user__in=following).order_by('-date').all()
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)


    return render(request, 'network/following.html', {
        #'posts': posts
        'page_obj':page_obj,
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
