# forms.py
from django import forms
from .models import Contact, Group

class ContactForm(forms.ModelForm):
    class Meta:
        model = Contact
        fields = [
            'name',
            'surname',
            'nickname',
            'email',
            'company',
            'job_position',
            'phone_number_1',
            'phone_number_2',
            'birthday'
        ]

        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Fisrt Name'}),
            'surname': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Surname'}),
            'nickname': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Unique Nickname'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'example@example.com'}),
            'company': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Company Name (Optional)'}),
            'job_position': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Position or Title (Optional)'}),
            'phone_number_1': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Primary Phone Number'}),
            'phone_number_2': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Secondary Phone Number (Optional)'}),
            'birthday': forms.DateInput(attrs={'class': 'form-control', 'type': 'date', 'placeholder': 'Select Date of Birth'}),
        }


from django import forms
from .models import Group, Contact

class GroupForm(forms.ModelForm):
    class Meta:
        model = Group
        fields = [
            'name',
            'description',
            'members',
            'pinned_message',
        ]

        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Name'}),
            'description': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Description'}),
            'pinned_message': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Pinned message'}),
            'members': forms.CheckboxSelectMultiple(), 
        }
