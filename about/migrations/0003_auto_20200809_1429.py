# Generated by Django 3.0.5 on 2020-08-09 14:29

from django.db import migrations
import wagtailmarkdown.fields


class Migration(migrations.Migration):

    dependencies = [
        ('about', '0002_auto_20200617_0107'),
    ]

    operations = [
        migrations.AlterField(
            model_name='aboutpage',
            name='body',
            field=wagtailmarkdown.fields.MarkdownField(blank=True, null=True),
        ),
    ]