# Generated by Django 5.2.dev20240712180928 on 2024-11-14 22:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contacts', '0003_alter_contact_nickname'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='isFavorite',
            field=models.BooleanField(default=False),
        ),
    ]
