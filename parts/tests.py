from django.test import TestCase
from django.urls import reverse
from .models import Part, Location, Status

class PartsListViewTests(TestCase):
    def setUp(self):
        # Create sample parts for testing
        location1 = Location.objects.create(name='Location 1')
        status1 = Status.objects.create(name='Available')
        self.part1 = Part.objects.create(part_number='PN001', name='Part 1', status=status1, quantity=10, location=location1)
        location2 = Location.objects.create(name='Location 2')
        status2 = Status.objects.create(name='Unavailable')
        self.part2 = Part.objects.create(part_number='PN002', name='Part 2', status=status2, quantity=0, location=location2)

    def test_parts_list_view(self):
        response = self.client.get(reverse('parts_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Part 1')
        self.assertContains(response, 'Part 2')
        self.assertContains(response, 'Available')
        self.assertContains(response, 'Unavailable')

    def test_parts_list_view_empty(self):
        # Clear all parts
        Part.objects.all().delete()
        response = self.client.get(reverse('parts_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '"items": []')

class DeletePartViewTests(TestCase):
    def setUp(self):
        status = Status.objects.create(name='Available')
        location = Location.objects.create(name='Warehouse A')
        self.part = Part.objects.create(part_number='PN001', name='Part 1', status=status, quantity=10, location=location)

    def test_delete_part_success(self):
        response = self.client.post(reverse('delete_part'), data={'id': self.part.id}, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {'success': True, 'message': 'Part deleted successfully.'})
        self.assertFalse(Part.objects.filter(id=self.part.id).exists())

    def test_delete_part_not_found(self):
        response = self.client.post(reverse('delete_part'), data={'id': 999}, content_type='application/json')
        self.assertEqual(response.status_code, 404)

