# Generated by Django 3.0.5 on 2020-08-15 00:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0008_auto_20200809_1429'),
    ]

    operations = [
        migrations.CreateModel(
            name='IndexDownloads',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(blank=True, null=True, verbose_name='quantity')),
                ('entries', models.CharField(blank=True, max_length=255, null=True, verbose_name='entries')),
                ('date', models.DateField(blank=True, null=True, verbose_name='date')),
                ('time', models.CharField(blank=True, max_length=255, null=True, verbose_name='time')),
            ],
            options={
                'verbose_name': 'Downloads',
                'verbose_name_plural': 'Downloads',
            },
        ),
    ]
