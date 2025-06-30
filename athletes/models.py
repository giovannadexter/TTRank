from django.db import models


class Athlete(models.Model):
    full_name = models.CharField(max_length=100)
    birth_date = models.DateField()
    phone_number = models.CharField(max_length=20)
    ranking_points = models.IntegerField(default=0)
    club = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-ranking_points', 'full_name']

    def __str__(self):
        return self.full_name