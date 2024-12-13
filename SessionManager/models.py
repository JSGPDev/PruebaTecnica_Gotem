from django.db import models

# Create your models here.
class users(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length = 50)
    email = models.CharField(max_length = 100)
    password = models.CharField(max_length = 100)

    def __str__(self):
        return f"{self.name}"