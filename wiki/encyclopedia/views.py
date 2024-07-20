from django.shortcuts import render, redirect
from django import forms
from . import util
from markdown2 import Markdown
import re
import random

class NewPageForm(forms.Form):
    title = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control w-25',
            'placeholder': 'Enter title'
            })
    )
    content = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control w-75',
            'placeholder':'Enter the page content using Markdown format'
            })
    )

class EditPageForm(forms.Form):
    content = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control w-75',
            'placeholder':'Enter the page content using Markdown format'
            })
    )


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def entry(request, title):
    entrymk = util.get_entry(title)

    if entrymk is None:
        return render(request, "encyclopedia/not_found.html",{
            'title': title
        })
    entry = Markdown().convert(entrymk)
    return render(request, "encyclopedia/entry.html",{
        'title':title,
        'content':entry
    })

def search(request):
     # NOT USING RE but using a list of lower TITLES: 'entries_titles' where the query its going to be searched 
    # AND USING: '_title' to show the UPPER title of the entry
    # 
    #query = request.GET.get('q').strip().lower()
    # entries_titles = []
    # for entry in entries:
    #     entries_titles.append(entry.lower())
    # if query in entries_titles:
    #     _title = entries[entries_titles.index(query)]
    #     return redirect('entry', title = _title)

    query = request.GET.get('q').strip()
    entries = util.list_entries()
    partial = []

    for entry in entries:

        if re.fullmatch(query, entry, re.IGNORECASE):
            return redirect('entry', title=entry)
        
        if re.search(query, entry, re.IGNORECASE):
            partial.append(entry)

    if partial:
        return render(request, 'encyclopedia/search.html', {
            "entries": partial,
        })
    
    else:
        return render(request, 'encyclopedia/not_found.html', {
            "title": query
        })

    # another possible solution, but it need an if inside the search page:
    #...   if re.search(query, entry, re.IGNORECASE):
    #         partial.append(entry)
    #
    # return render(request, 'encyclopedia/search.html', {
    #     "entries": partial,
    #     "query":query,
    #     "no_results": len(partial) == 0
    #  })

def create(request):
    if request.method == "POST":
        form = NewPageForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data['title']
            content = form.cleaned_data['content']
            #automaticly add the title inside the document 
            content_with_title = f"# {title}\n\n{content}"
        if not util.create_new_entry(title, content_with_title):
            error_message = f"The page with the title '{title}' already exists. Please try again with a different title."
            return render(request, 'encyclopedia/create.html', {
                'form': form,
                'error': error_message
                })
        
        return redirect('entry', title=title)
    else:
        form = NewPageForm()
    return render(request, 'encyclopedia/create.html', {
        'form': NewPageForm
        })

def edit(request, title):
    content = util.get_entry(title)
    if request.method == "POST":
        form = EditPageForm(request.POST)
        if form.is_valid():
            content = form.cleaned_data['content']
            cleaned = util.clean_content(content)
            util.save_entry(title, cleaned)
            return redirect('entry', title=title)
    else:
        form = EditPageForm({
            'title': title,
            'content': content,
        })
    return render(request, 'encyclopedia/edit.html', {
        'title': title,
        'form': form,
    })

def random_entry(request):
    entries = util.list_entries()
    entry = random.choice(entries)
    return redirect('entry', title=entry)