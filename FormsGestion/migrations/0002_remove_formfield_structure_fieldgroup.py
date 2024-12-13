# Generated by Django 5.1.4 on 2024-12-13 17:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('FormsGestion', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='formfield',
            name='structure',
        ),
        migrations.CreateModel(
            name='FieldGroup',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
                ('header', models.TextField()),
                ('structure', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='FormsGestion.formstructure')),
            ],
        ),
    ]
