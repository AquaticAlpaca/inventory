from django.contrib import admin
from .models import Part, Location, Status

# Register your models here
admin.site.register(Location)
admin.site.register(Status)

@admin.register(Part)
class PartAdmin(admin.ModelAdmin):
    list_display = ('part_number', 'name', 'location', 'quantity', 'status')
    search_fields = ('part_number', 'name')
    list_filter = ('status', 'location')
