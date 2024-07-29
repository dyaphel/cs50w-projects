from django.contrib import admin
from .models import User, AuctionListings, Bids, Comments

admin.site.register( User)
admin.site.register( AuctionListings)
admin.site.register( Bids)
admin.site.register( Comments)

# Register your models here.
