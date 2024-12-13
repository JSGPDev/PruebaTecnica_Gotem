from django.contrib import admin
from .models import * 
# Register your models here.
admin.site.register(FormStructure)
admin.site.register(FormField)
admin.site.register(FormEntity)
admin.site.register(FieldGroup)