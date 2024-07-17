from django.shortcuts import render, redirect
from . import util
import re

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def entry(request, title):
    entry = util.get_entry(title)
    
    if entry is None:
        return render(request, 'encyclopedia/EntryNotFound.html', {
            "title" : title
        })
    return render(request, 'encyclopedia/entry.html', {
        "title": title,
        "content": entry
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
        return render(request, 'encyclopedia/EntryNotFound.html', {
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
    return render(request, 'encyclopedia/CreateNewPage.html')