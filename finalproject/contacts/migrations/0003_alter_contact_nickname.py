# Generated by Django 5.2.dev20240712180928 on 2024-11-08 19:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contacts', '0002_alter_contact_nickname'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contact',
            name='nickname',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
