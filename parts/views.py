from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import render
from .models import Part

def parts_list(request):
    # Get the search term from the query parameters
    search_term = request.GET.get('search', '')

    # Fetch all parts, optionally filtering by the search term
    parts = Part.objects.all()
    if search_term:
        parts = parts.filter(part_number__icontains=search_term) | parts.filter(name__icontains=search_term)

    # Pagination
    paginator = Paginator(parts, 10)  # Show 10 parts per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Prepare data for JSON response
    parts_data = [
        {
            'id': part.unique_id,
            'partNumber': part.part_number,
            'name': part.name,
            'status': part.status.name,
            'quantity': part.quantity,
            'location': part.location.name,
        }
        for part in page_obj
    ]

    return JsonResponse({
        'items': parts_data,
        'has_next': page_obj.has_next(),
        'has_previous': page_obj.has_previous(),
        'next_page_number': page_obj.next_page_number() if page_obj.has_next() else None,
        'previous_page_number': page_obj.previous_page_number() if page_obj.has_previous() else None,
        'totalItems': paginator.count,  # Total number of items for pagination
    })

def index(request):
    return render(request, 'inventory.html')  # Render your HTML template
