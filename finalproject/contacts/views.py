from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
import json
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

from .models import User, Contacts


def index(request):
    if request.user.is_authenticated:
        # Ottieni le informazioni dell'utente
        user_info = {
            'username': request.user.username,
            'name': request.user.Name,
            'surname': request.user.Surname,
            'email': request.user.email,
            'company': request.user.company,
            'job_position': request.user.job_position,
            'phone_number_1': request.user.phone_number_1,
            'phone_number_2': request.user.phone_number_2,
        }
        
        # Passa le informazioni dell'utente al template
        return render(request, "contacts/index.html", {
            'user_info': user_info
        })
    else:
        return render(request, "contacts/login.html")


@login_required  
def update_profile(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        profile = Profile.objects.get(user=request.user)
        new_body = data.get('body')
        if(new_body):
            profile.body = new_body
            profile.save()
            return JsonResponse({'success': True})
        
        return JsonResponse({'success': False, 'error': 'No content provided'})
    return JsonResponse({'success': False, 'error': 'Invalid request method or unauthorized'})


def login_view(request):
    if request.method == "POST":
        # Prova a autenticare l'utente
        nickname = request.POST["username"]  # Cambiato da username a nickname
        password = request.POST["password"]
        user = authenticate(request, username=nickname, password=password)

        # Controlla se l'autenticazione è andata a buon fine
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "contacts/login.html", {
                "message": "Nickname e/o password non validi."
            })
    else:
        return render(request, "contacts/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login.html"))

def register(request):
    if request.method == "POST":
        name = request.POST["name"]
        surname = request.POST["surname"]
        username = request.POST["username"]
        email = request.POST["email"]
        company = request.POST.get("company", "")
        job_position = request.POST["job_position"]
        phone_number_1 = request.POST["phone_number_1"]
        phone_number_2 = request.POST.get("phone_number_2", "")
        
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        
        # Assicurati che le password corrispondano
        if password != confirmation:
            return render(request, "contacts/register.html", {
                "message": "Le password devono corrispondere."
            })

        # Prova a creare un nuovo utente
        try:
            user = User.objects.create_user(
                username=username,  # Puoi usare nickname come username
                email=email,
                password=password,
                Name=name,
                Surname=surname,
                company=company,
                job_position=job_position,
                phone_number_1=phone_number_1,
                phone_number_2=phone_number_2
            )
            user.save()
        except IntegrityError:
            return render(request, "contacts/register.html", {
                "message": "Nickname già in uso."
            })
        
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "contacts/register.html")
