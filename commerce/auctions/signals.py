from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from .models import AuctionListings

@receiver(post_save, sender=AuctionListings)
def check_listing_expiry(sender, instance, **kwargs):
    if instance.end_time <= timezone.now():
        instance.active = False
        instance.save()
