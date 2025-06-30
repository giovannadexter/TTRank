from django.contrib import admin
from .models import Athlete


@admin.register(Athlete)
class AthleteAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'ranking_points', 'club', 'birth_date', 'created_at')
    list_filter = ('club', 'created_at')
    search_fields = ('full_name', 'phone_number', 'club')
    ordering = ('-ranking_points', 'full_name')
    list_per_page = 50
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('full_name', 'birth_date', 'phone_number')
        }),
        ('Tournament Information', {
            'fields': ('ranking_points', 'club')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')