from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
import json
from datetime import datetime, timedelta
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import User, Contact, Group, Event
from .forms import ContactForm, GroupForm



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
        return render(request, "standard/login.html")



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
    contact = Contact.objects.get(id=id) 
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
    return render(request, 'contacts/add_contact.html', {
        'form': form
        })


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
        contact = Contact.objects.get(id=id)
        # Update fields from the incoming data
        contact.name = data.get('firstName', contact.name)
        contact.surname = data.get('lastName', contact.surname)
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


@login_required
def toggle_favorite_contact(request, contact_id):
    if request.method == 'POST':
        contact = Contact.objects.get(id=contact_id)
        # Toggle is_favorite status
        contact.isFavorite = not contact.isFavorite
        contact.save()  # Save to ensure the update is persisted
        return JsonResponse({
            "success": True, 
            "is_favorite": contact.isFavorite
            })
    return JsonResponse({"success": False})


@login_required
def favorites(request):
    user_contacts = Contact.objects.filter(owner=request.user, isFavorite=True)
    groups = Group.objects.filter(isFavorite=True)
    return render(request, 'favorites.html', {
        'contacts': user_contacts,
        'groups': groups,
    })

@login_required
def groups(request):
    groups = Group.objects.filter(admins=request.user)
    return render(request, 'groups/groups.html', {
        'groups': groups
    })

@login_required
def delete_groups(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            group_ids = data.get("group", [])  # Get group IDs from the request body
            
            # Delete groups with IDs in group_ids
            Group.objects.filter(id__in=group_ids).delete()
            return JsonResponse({"success": True})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
    return JsonResponse({"success": False, "error": "Invalid request method"})


@login_required
def add_group(request):
    if request.method == 'POST':
        form = GroupForm(request.POST)
        if form.is_valid():
            group = form.save(commit=False)
            group.save()  # Save the group instance first
            form.save_m2m()  # Save ManyToMany relationships (members)
            group.admins.add(request.user)  # Automatically make the logged-in user an admin
            return redirect('groups')  # Redirect to a relevant page (e.g., a list of groups)
    else:
        form = GroupForm()
    
    # Pass the form and a list of the user's contacts to the template
    contacts = Contact.objects.filter(owner=request.user)
    return render(request, 'groups/add_group.html', {
        'form': form, 
        'members': contacts
        })


@login_required
def toggle_favorite_group(request, id):
    if request.method == 'POST':
        group = Group.objects.get(id=id)
        group.isFavorite = not group.isFavorite
        group.save()
        return JsonResponse({"success": True, "is_favorite": group.isFavorite})
    return JsonResponse({"success": False, "error": "Invalid request method"})


@login_required
def group_detail(request, id):
    group = Group.objects.get(id=id)
    members = group.members.all()
    admins = group.admins.all()
    contactall= Contact.objects.all()
    contacts = contactall.exclude(id__in=members.values_list('id', flat=True))

    return render(request, 'groups/group_details.html', {
        'group': group,
        'members':members,
        'admins':admins,
        'contacts':contacts,
    })


@login_required
def edit_group(request, id):
    if request.method == 'POST':
        data = json.loads(request.body)
        group = Group.objects.get(id=id)
        group.name = data.get('name', group.name)
        group.description = data.get('description', group.description)
        group.pinned_message = data.get('pinned_message', group.pinned_message)
        group.save()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': 'Invalid request method or unauthorized'})


@login_required
def remove_members(request, id): 
    if request.method == "POST":
        data = json.loads(request.body)
        selected_contacts = data.get("contacts", [])
        group = Group.objects.get(id=id)

        not_in_group = []
        for contact_id in selected_contacts:
            contact = Contact.objects.filter(id=contact_id).first()
            if not contact or contact not in group.members.all():
                not_in_group.append(contact)

        if not_in_group:
            not_in_group_names = ", ".join([contact.name for contact in not_in_group if contact])  # Evita contatti nulli
            return JsonResponse({"success": False, "error": f"Some selected memebers are not in the group: {not_in_group_names}"})

        # Verifica se il gruppo sarà vuoto dopo la rimozione
        if len(group.members.all()) <= len(selected_contacts):
            return JsonResponse({"success": False, "error": "this is the last memeber just delete the group"})

        # Rimuovi i membri selezionati dal gruppo
        for contact_id in selected_contacts:
            contact = Contact.objects.filter(id=contact_id).first()
            if contact:
                group.members.remove(contact)

        return JsonResponse({"success": True})

    return JsonResponse({"success": False, "error": "Not valid"})


@login_required
def add_members(request, id):  # Same 'id' parameter to get the group
    if request.method == "POST":
        data = json.loads(request.body)
        selected_contacts = data.get("contacts", [])
        group = Group.objects.get(id=id)  # Get the group by ID

        # Lists to separate contacts already in the group and those not in the group
        already_in_group = []
        not_in_group = []

        # Check each selected contact
        for contact_id in selected_contacts:
            contact = Contact.objects.filter(id=contact_id).first()  # Safely get the contact
            if contact:
                if contact in group.members.all():
                    already_in_group.append(contact)
                else:
                    not_in_group.append(contact)

        # If there are any contacts already in the group, return an error
        if already_in_group:
            return JsonResponse({
                "success": False,
                "error": "Some selected members are already in the group",
                "already_in_group": [contact.id for contact in already_in_group]
            })

        # If no contacts are already in the group, add the ones that aren't
        if not_in_group:
            for contact in not_in_group:
                group.members.add(contact)  # Add the contact to the group's members
            return JsonResponse({"success": True, "message": "Members added successfully"})

        # If no contacts are selected to add
        return JsonResponse({"success": False, "error": "No members selected to add"})

    return JsonResponse({"success": False, "error": "Invalid request method"})



@login_required
def calendar(request):
    return render (request, 'calendar/calendar.html')



@login_required
def calendar_events_api(request):
    events = list(Event.objects.values("title", "start"))  # Fetch all events
    return JsonResponse(events, safe=False)

@login_required
def add_event(request):
    """Add a new event to the database."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            title = data['title']
            start = data['start']
            contact_id = data.get('contact')
            group_id = data.get('group')

            contact = Contact.objects.get(id=contact_id) if contact_id else None
            group = Group.objects.get(id=group_id) if group_id else None

            Event.objects.create(title=title, start=start)
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)

    return JsonResponse({'success': False}, status=400)

@login_required
def contacts_api(request):
    contacts = list(Contact.objects.values("id", "name"))
    return JsonResponse(contacts, safe=False)

@login_required
def groups_api(request):
    groups = list(Group.objects.values("id", "name"))
    return JsonResponse(groups, safe=False)


def event_conflict(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        requested_datetime = data.get('date')
        requested_datetime = datetime.fromisoformat(requested_datetime)

        # Check for events at the same time (same day)
        existing_events = Event.objects.filter(
            start__year=requested_datetime.year,
            start__month=requested_datetime.month,
            start__day=requested_datetime.day,
            start__hour=requested_datetime.hour,
            start__minute=requested_datetime.minute
        )

        # If there's an event with the same time, return a conflict response
        if existing_events.exists():
            return JsonResponse({'conflict': True})
        else:
            return JsonResponse({'conflict': False})

# @login_required
# def event_details(request, id):
#     event = Event.objects.get(id=id)
#     return render(request,'event_details.html', {
#         'event': event
#     })






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
            return render(request, "standard/login.html", {
                "message": "Nickname e/o password non validi."
            })
    else:
        return render(request, "standard/login.html")


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
            return render(request, "standard/register.html", {
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
            return render(request, "standard/register.html", {
                "message": "Nickname già in uso."
            })
        
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "standard/register.html")
