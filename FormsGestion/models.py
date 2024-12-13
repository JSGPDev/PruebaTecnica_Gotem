from django.db import models
from django.utils import timezone
from SessionManager.models import users

# Create your models here.
class FormStructure(models.Model):
    id = models.AutoField(primary_key=True)
    creator = models.ForeignKey(users, on_delete=models.CASCADE, null=False, default=1)
    name = models.CharField(max_length = 50)
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.name}-{self.id}"

class FormEntity(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length = 50)
    type = models.CharField(max_length = 50)

    def __str__(self):
        return f"{self.name}"

class FieldGroup(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length = 50)
    header = models.TextField()
    structure = models.ForeignKey(FormStructure, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name}"

class FormField(models.Model):
    id = models.AutoField(primary_key=True)
    group = models.ForeignKey(FieldGroup, on_delete=models.CASCADE)
    type = models.ForeignKey(FormEntity, on_delete=models.CASCADE)
    name = models.CharField(max_length = 50)
    text = models.TextField(blank=True)
    specials = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name}-{self.type.name}"