from .models import Watchlist

def watchlist_count(request):
    if request.user.is_authenticated:
        count = Watchlist.objects.filter(user=request.user).count()
    else:
        count = 0
    return {
        'watchlist_count': count
    }
