# Generated by Django 5.1.4 on 2024-12-16 17:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('FormsGestion', '0006_formstructure_creator'),
        ('SessionManager', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='FieldResponse',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('response', models.TextField()),
                ('field', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='FormsGestion.formfield')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='SessionManager.users')),
            ],
        ),
    ]
