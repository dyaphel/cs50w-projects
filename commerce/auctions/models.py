from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class AuctionListings(models.Model):
    
    CATEGORY_LIST= [
        ("MOT", "Motors"),
        ("FAS", "Fashion"),
        ("ELE", "Electronics"),
        ("ART", "Collectibles & Art"),
        ("HGA", "Home & Garden"),
        ("SPO", "Sport"),
        ("TOY", "Toys"),
        ("BUS", "Business & Industrial"),
        ("MUS", "Music"),
    ]
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")
    title = models.CharField(max_length=30)
    description = models.TextField()
    image_url = models.URLField(max_length=200, blank=True, null=True)
    starting_bid = models.DecimalField(max_digits=10, decimal_places=2)
    current_bid = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)
    category = models.CharField(max_length=3, choices=CATEGORY_LIST)

def __str__(self):
    return f"{self.title} placed by {self.seller}"

class Bid(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bids")
    time = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    listing = models.ForeignKey(AuctionListings, on_delete=models.CASCADE, related_name="bids")

def __str__(self):
    return f"{self.price} by {self.user} on {self.listing}"
    
class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    time = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
    listing = models.ForeignKey(AuctionListings, on_delete=models.CASCADE, related_name="comments")

def __str__(self):
    return f"Comment by {self.user} on {self.listing}"
