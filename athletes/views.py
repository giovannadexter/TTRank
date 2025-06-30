import csv
import io
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from core.mixins import ExportMixin
from .models import Athlete
from .serializers import AthleteSerializer


class AthleteViewSet(ExportMixin, viewsets.ModelViewSet):
    """
    ViewSet for managing athletes with CRUD operations and CSV import/export.
    """
    queryset = Athlete.objects.all()
    serializer_class = AthleteSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['club', 'ranking_points']
    search_fields = ['full_name', 'phone_number', 'club']
    ordering_fields = ['full_name', 'ranking_points', 'created_at']
    ordering = ['-ranking_points', 'full_name']

    @action(detail=False, methods=['post'])
    def import_csv(self, request):
        """
        Import athletes from CSV file.
        Expected CSV format: full_name, birth_date, phone_number, ranking_points, club
        """
        if 'file' not in request.FILES:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        csv_file = request.FILES['file']
        
        if not csv_file.name.endswith('.csv'):
            return Response({'error': 'File must be a CSV'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Read CSV file
            decoded_file = csv_file.read().decode('utf-8')
            csv_data = csv.DictReader(io.StringIO(decoded_file))
            
            created_athletes = []
            errors = []
            row_number = 1
            
            for row in csv_data:
                row_number += 1
                try:
                    # Clean and validate data
                    athlete_data = {
                        'full_name': row.get('full_name', '').strip(),
                        'birth_date': row.get('birth_date', '').strip(),
                        'phone_number': row.get('phone_number', '').strip(),
                        'ranking_points': int(row.get('ranking_points', 0) or 0),
                        'club': row.get('club', '').strip() or None,
                    }
                    
                    # Validate required fields
                    if not athlete_data['full_name']:
                        errors.append(f"Row {row_number}: full_name is required")
                        continue
                    if not athlete_data['birth_date']:
                        errors.append(f"Row {row_number}: birth_date is required")
                        continue
                    if not athlete_data['phone_number']:
                        errors.append(f"Row {row_number}: phone_number is required")
                        continue
                    
                    # Create athlete using serializer
                    serializer = AthleteSerializer(data=athlete_data)
                    if serializer.is_valid():
                        athlete = serializer.save()
                        created_athletes.append(athlete.full_name)
                    else:
                        error_msg = f"Row {row_number}: {', '.join([f'{k}: {v[0]}' for k, v in serializer.errors.items()])}"
                        errors.append(error_msg)
                        
                except ValueError as e:
                    errors.append(f"Row {row_number}: Invalid data - {str(e)}")
                except Exception as e:
                    errors.append(f"Row {row_number}: {str(e)}")
            
            response_data = {
                'message': f'Successfully imported {len(created_athletes)} athletes',
                'created_athletes': created_athletes,
                'errors': errors,
                'total_processed': row_number - 1,
                'successful': len(created_athletes),
                'failed': len(errors)
            }
            
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': f'Error processing CSV: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    
    def get_export_headers(self):
        return ['full_name', 'birth_date', 'phone_number', 'ranking_points', 'club', 'created_at']
    
    def get_export_row(self, obj):
        return [
            obj.full_name,
            obj.birth_date.strftime('%Y-%m-%d'),
            obj.phone_number,
            obj.ranking_points,
            obj.club or '',
            obj.created_at.strftime('%Y-%m-%d %H:%M:%S')
        ]