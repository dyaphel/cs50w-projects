from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
import json
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import User, Contact
from .forms import ContactForm
from django.shortcuts import get_object_or_404



def index(request):
    if request.user.is_authenticated:
        # Ottieni le informazioni dell'utente
        user_info = {
            'username': request.user.username,
            'name': request.user.first_name,
            'surname': request.user.last_name,
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

        user = request.user
        user.fisrt_name = data.get('firstName', user.first_name)
        user.last_name = data.get('lastName', user.last_name)
        user.Username = data.get('nickname', user.username)
        user.company = data.get('company', user.company)
        user.job_position = data.get('jobPosition', user.job_position)
        user.email = data.get('email', user.email)
        user.phone_number_1 = data.get('phone1', user.phone_number_1)
        user.phone_number_2 = data.get('phone2', user.phone_number_2)

        # Save user to database
        user.save()

        return JsonResponse({'success': True})

    return JsonResponse({'success': False, 'error': 'Invalid request method or unauthorized'})


@login_required
def contacts(request):
    user = request.user
    user_contacts = Contact.objects.filter(owner=user)
    #print(f"Contatti trovati: {user_contacts.count()}")
    return render(request, 'contacts/contact_list.html', {
        'contacts': user_contacts
    })


@login_required
def contact_detail(request, id):
    try:
        contact = Contact.objects.get(id=id)
    except Contact.DoesNotExist:
        # Redirige a una pagina di errore personalizzata o alla home page
        return redirect('error_page')  # Assicurati di avere una view per gestire 'error_page'
    
    return render(request, 'contacts/contact_details.html', {
        'contact': contact
    })


@login_required
def add_contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        nickname = form.data.get('nickname')

        if Contact.objects.filter(owner=request.user, nickname=nickname).exists():
            form.add_error('nickname', "The nickname must be unique across all your contacts.")

        elif nickname == request.user.username:
            form.add_error('nickname', "The nickname cannot be the same as your username.")
        else:
            contact = form.save(commit=False)
            contact.owner = request.user
            contact.save()
            return redirect('contacts')
    else:
        form = ContactForm()

    return render(request, 'contacts/add_contact.html', {'form': form})

@login_required
def delete_contacts(request):
    if request.method == "POST":
        data = json.loads(request.body)
        contact_ids = data.get("contacts", [])
        
        # Delete contacts with IDs in contact_ids
        Contact.objects.filter(id__in=contact_ids).delete()
        return JsonResponse({"success": True})
    return JsonResponse({"success": False})

@login_required
def edit_contact(request, id):
    
    if request.method == 'POST':
        data = json.loads(request.body)

        # Get the contact by ID
        contact = get_object_or_404(Contact, id=id)

        # Update fields from the incoming data
        contact.first_name = data.get('firstName', contact.first_name)
        contact.last_name = data.get('lastName', contact.last_name)
        contact.nickname = data.get('nickname', contact.nickname)
        contact.company = data.get('company', contact.company)
        contact.job_position = data.get('jobPosition', contact.job_position)
        contact.email = data.get('email', contact.email)
        contact.phone_number_1 = data.get('phone1', contact.phone_number_1)
        contact.phone_number_2 = data.get('phone2', contact.phone_number_2)

        # Save the updated contact
        contact.save()

        return JsonResponse({'success': True})

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
    return HttpResponseRedirect(reverse("login"))

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
