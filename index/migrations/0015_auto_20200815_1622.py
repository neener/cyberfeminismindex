# Generated by Django 3.0.5 on 2020-08-15 16:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0014_auto_20200815_1620'),
    ]

    operations = [
        migrations.AlterField(
            model_name='indexdownloads',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, verbose_name='created_at'),
        ),
    ]
