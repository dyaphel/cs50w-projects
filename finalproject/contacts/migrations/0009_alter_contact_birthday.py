# Generated by Django 5.2.dev20240712180928 on 2024-11-22 00:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contacts', '0008_rename_contacts_group_members_group_isfavorite_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contact',
            name='birthday',
            field=models.DateField(blank=True, null=True),
        ),
    ]
