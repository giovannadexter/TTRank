from rest_framework import serializers
from .models import Athlete


class AthleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Athlete
        fields = ['id', 'full_name', 'birth_date', 'phone_number', 'ranking_points', 'club', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']