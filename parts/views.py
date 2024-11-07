from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST
import json
from .models import Part

def parts_list(request):
    # Fetch all parts
    parts = Part.objects.all()

    # Pagination
    paginator = Paginator(parts, parts.count())  # Show all parts
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Prepare data for JSON response
    parts_data = [
        {
            'id': part.id,
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
    })

@require_POST
def delete_part(request):
    data = json.loads(request.body)
    part_id = data.get('id')
    try:
        part = Part.objects.get(id=part_id)
        part.delete()
        return JsonResponse({'success': True, 'message': 'Part deleted successfully.'})
    except Part.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Part not found.'})

def index(request):
    return render(request, 'inventory.html')  # Render your HTML template
