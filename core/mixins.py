from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action


class BulkCreateMixin:
    """
    Mixin to add bulk creation functionality to ViewSets.
    """
    
    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """
        Create multiple instances at once.
        Expected payload: {"items": [obj1, obj2, ...]}
        """
        items = request.data.get('items', [])
        if not items:
            return Response(
                {'error': 'No items provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=items, many=True)
        if serializer.is_valid():
            self.perform_bulk_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def perform_bulk_create(self, serializer):
        serializer.save()


class ExportMixin:
    """
    Mixin to add export functionality to ViewSets.
    """
    
    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        """
        Export all data as CSV.
        """
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{self.get_export_filename()}"'
        
        writer = csv.writer(response)
        queryset = self.filter_queryset(self.get_queryset())
        
        # Write header
        if queryset.exists():
            headers = self.get_export_headers()
            writer.writerow(headers)
            
            # Write data
            for obj in queryset:
                writer.writerow(self.get_export_row(obj))
        
        return response
    
    def get_export_filename(self):
        return f"{self.basename}_export.csv"
    
    def get_export_headers(self):
        # Override in subclass
        return []
    
    def get_export_row(self, obj):
        # Override in subclass
        return []