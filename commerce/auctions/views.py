from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from .forms import AuctionListingForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import User, AuctionListing, Bid, Comment, Watchlist
from django.utils import timezone
from decimal import Decimal



def update_auction_status():
    today = timezone.now().date()
    expired_listings = AuctionListing.objects.filter(end_time__date__lte=today, active=True)
    for listing in expired_listings:
        listing.active = False
        listing.save()


def index(request):
    update_auction_status()
    active_listings = AuctionListing.objects.filter(active=True)
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
    category_dict = dict(AuctionListing.CATEGORY_LIST)
    listing = AuctionListing.objects.get(id=id)
    category = category_dict.get(listing.category)
    highest_bid = Bid.objects.filter(listing=listing).last()
    comments = Comment.objects.filter(listing=listing).order_by('-time')
    
    if request.method == "POST" and request.user.is_authenticated:
        content = request.POST.get("comment")
        if content:
            comment = Comment(user=request.user, content=content, listing=listing)
            comment.save()
            messages.success(request, "Your comment has been added.")
        return redirect('listing', id=id)

    if request.user.is_authenticated:
        is_watchlisted = Watchlist.objects.filter(user=request.user, listings=listing).exists()
    else:
        is_watchlisted = False
    
    return render(request, "auctions/listing.html", {
        'listing': listing,
        'category_name': category,
        'is_watchlisted': is_watchlisted,
        'highest_bid': highest_bid,
        'comments': comments,  # Pass the comments to the template
    })


@login_required
def watchlist(request, id):
    listing = AuctionListing.objects.get(id=id)
    watchlist_item = Watchlist.objects.filter( user = request.user, listings=listing)
    if watchlist_item:
        watchlist_item.delete()
        return redirect('listing', id=id)
    else:
        Watchlist.objects.create(user=request.user, listings=listing)
        return redirect('listing', id=id)
    


@login_required
def bids(request, id):
    listing = AuctionListing.objects.get(id=id)
    if request.method == "POST":
        bid_amount = Decimal(request.POST.get("bid"))
        current_bid = listing.bids.last()

        if bid_amount < listing.starting_bid:
            messages.error(request, f"Your bid must be at least the starting bid of ${listing.starting_bid}")
            return redirect('listing', id=listing.id)

        if listing.current_bid and bid_amount <= listing.current_bid:
                messages.error(request, f"Your bid must be higher than the current highest bid of ${listing.current_bid}")
                return redirect('listing', id=listing.id)
        
        if current_bid and current_bid.user == request.user:
            messages.error(request, "You cannot outbid yourself. Please wait for another user to place a bid.")
            return redirect('listing', id=listing.id)
        
        new_bid = Bid(user=request.user, price=bid_amount, listing=listing)
        new_bid.save()
        listing.current_bid = bid_amount
        listing.save()

        messages.success(request, 'Your bid was successfully placed.')
        return redirect('listing', id=listing.id)

    return redirect('listing', id=listing.id)


@login_required
def close(request, id):
    listing = AuctionListing.objects.get(id=id)
    listing.active = False
    listing.save()
    highest = Bid.objects.filter(listing=listing).last()
    if highest and highest.price == listing.current_bid:
        messages.success(request, f'The listing is closed. The winner is {highest.user.username}')
    else:
        messages.info(request, 'The listing is closed. No bids were placed or there was an issue with the highest bid.')

    return redirect('listing', id=listing.id)

@login_required
def showatchlist(request):
    watchlist_items = Watchlist.objects.filter(user=request.user)
    watchlist_listings = [item.listings for item in watchlist_items]
    return render(request, "auctions/watchlist.html", {
        "watchlist_listings": watchlist_listings,
    })