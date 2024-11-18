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
