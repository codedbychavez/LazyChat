# Generated by Django 3.2.7 on 2021-09-24 13:01

import django.core.validators
from django.db import migrations, models
import django.utils.timezone
import re


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='useraccount',
            old_name='accountType',
            new_name='status',
        ),
        migrations.AddField(
            model_name='useraccount',
            name='friends',
            field=models.CharField(default=django.utils.timezone.now, max_length=255, validators=[django.core.validators.RegexValidator(re.compile('^\\d+(?:,\\d+)*\\Z'), code='invalid', message='Enter only digits separated by commas.')]),
            preserve_default=False,
        ),
    ]