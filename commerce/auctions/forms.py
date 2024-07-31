from django import forms
from .models import AuctionListings

class AuctionListingForm(forms.ModelForm):
    class Meta:
        model = AuctionListings 
        fields = ['title', 'description', 'starting_bid', 'image_url', 'category'] 
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter the title'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Enter the description','style': 'height: 12vh;'}),
            'starting_bid': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Enter the starting bid'}),
            'image_url': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'Enter the image URL'}),
            'category': forms.Select(attrs={'class': 'form-control'}),
        }
