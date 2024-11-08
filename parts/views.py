from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.views import View
from django.views.decorators.http import require_POST
import json
from .models import Part

class PartsListView(View):
    def get(self, request):
        parts = Part.objects.all()
        page_obj = self.paginate_parts(parts, request.GET.get('page'))
        parts_data = self.serialize_parts(page_obj)

        return JsonResponse({
            'items': parts_data,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
            'next_page_number': page_obj.next_page_number() if page_obj.has_next() else None,
            'previous_page_number': page_obj.previous_page_number() if page_obj.has_previous() else None,
        })

    def paginate_parts(self, parts, page_number, items_per_page=10):
        paginator = Paginator(parts, 999999)  # Show all parts
        return paginator.get_page(page_number)

    def serialize_parts(self, page_obj):
        return [
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

@require_POST
def delete_part(request):
    data = json.loads(request.body)
    part_id = data.get('id')
    part = get_object_or_404(Part, id=part_id)
    part.delete()
    return JsonResponse({'success': True, 'message': 'Part deleted successfully.'})

def index(request):
    return render(request, 'inventory.html')  # Render your HTML template
