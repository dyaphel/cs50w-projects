# Generated by Django 5.2.dev20240712180928 on 2024-11-19 22:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contacts', '0007_alter_group_admins_alter_group_contacts'),
    ]

    operations = [
        migrations.RenameField(
            model_name='group',
            old_name='contacts',
            new_name='members',
        ),
        migrations.AddField(
            model_name='group',
            name='isFavorite',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='group',
            name='pinned_message',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
