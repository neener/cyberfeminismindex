from django.db import models

from wagtail.core.models import Page
from wagtail.core.fields import RichTextField
from wagtail.admin.edit_handlers import FieldPanel
from wagtailmarkdown.fields import MarkdownField
from wagtailmarkdown.edit_handlers import MarkdownPanel

class AboutPage(Page):
    body = MarkdownField(null=True, blank=True)

    content_panels = Page.content_panels + [
        MarkdownPanel('body', classname="full"),
    ]