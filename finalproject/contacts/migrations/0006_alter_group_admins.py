# Generated by Django 5.2.dev20240712180928 on 2024-11-18 22:25

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contacts', '0005_group'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='admins',
            field=models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL),
        ),
    ]
