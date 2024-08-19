from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create", views.create, name="create" ),
    path("listing/<int:id>", views.listing, name="listing"),
    path("listing/<int:id>/watchlist/", views.watchlist, name="watchlist"),  
    path("bids/<int:id>", views.bids, name="bids"),
    path("close/<int:id>", views.close, name="close"),
    path("watchlist", views.showatchlist, name="showatchlist"),
    path("categories",views.categories, name="categories"),
     path("category/<str:category_name>/", views.category_items, name="category_items"),

]
