from django import forms
from .models import AuctionListings

class AuctionListingForm(forms.ModelForm):
    title = forms.CharField( 
        required=True, 
        widget=forms.TextInput(attrs={
            'class': 'form-control', 
            'placeholder': 'Enter the title'
        })
    )
    description = forms.CharField( 
        required=True, 
        widget=forms.Textarea(attrs={
            'class': 'form-control', 
            'placeholder': 'Enter the description',
             'style': 'height: 12vh;'
        })
    )
    
    starting_bid = forms.DecimalField( 
        required=True, 
        widget=forms.NumberInput(attrs={
            'class': 'form-control', 
            'placeholder': 'Enter the starting bid',
        })
    )
    
    image_url = forms.URLField( 
        widget=forms.URLInput(attrs={
            'class': 'form-control', 
            'placeholder': 'Enter the image url',
        })
    )

    category = forms.ChoiceField( 
        widget=forms.Select(attrs={
            'class': 'form-control', 
            'placeholder': 'Enter the description',
             'style': 'height: 12vh;'
        })
    )
    class Meta:
        model = AuctionListings 
        fields = ['title', 'description', 'starting_bid', 'image_url', 'category'] 
