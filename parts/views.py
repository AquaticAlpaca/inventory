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
        parts_data = self.serialize_parts(parts)

        return JsonResponse({
            'items': parts_data,
        })

    def serialize_parts(self, parts):
        return [
            {
                'id': part.id,
                'partNumber': part.part_number,
                'name': part.name,
                'status': part.status.name,
                'quantity': part.quantity,
                'location': part.location.name,
            }
            for part in parts
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
