from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from .forms import AuctionListingForm
from django.contrib.auth.decorators import login_required
from .models import User, AuctionListings, Bids, Comments, WatchList
from django.utils import timezone



def update_auction_status():
    today = timezone.now().date()
    expired_listings = AuctionListings.objects.filter(end_time__date__lte=today, active=True)
    for listing in expired_listings:
        listing.active = False
        listing.save()


def index(request):
    update_auction_status()
    active_listings = AuctionListings.objects.filter(active=True)
    return render(request, "auctions/index.html", {
        'active_listings': active_listings
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
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


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
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

@login_required(login_url='login')
def create(request):
    if request.method == "POST":
        form = AuctionListingForm(request.POST)
        if form.is_valid():
            auction_listing = form.save(commit=False)
            auction_listing.seller = request.user
            auction_listing.save()
            return redirect('index')
    else:
        form = AuctionListingForm()
        
    return render(request, "auctions/create.html", {
        'form': form
    })


def listing(request, id):
    category_dict = dict(AuctionListings.CATEGORY_LIST)
    listing = AuctionListings.objects.get(id=id)
    category = category_dict.get(listing.category)
    return render(request, "auctions/listing.html", {
        'listing': listing,
        'category_name':category
    })

