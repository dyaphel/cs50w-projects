# Generated by Django 5.2.dev20240712180928 on 2024-11-22 00:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contacts', '0010_alter_contact_birthday'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contact',
            name='birthday',
            field=models.DateField(blank=True, null=True),
        ),
    ]
