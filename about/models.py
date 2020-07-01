from django.db import models

from wagtail.core.models import Page
from wagtail.core.fields import RichTextField
from wagtail.admin.edit_handlers import FieldPanel
from wagtailmarkdown.fields import MarkdownField
from wagtailmarkdown.edit_handlers import MarkdownPanel

import simplejson as json

from index.models import IndexDetailPage

class AboutPage(Page):
    body = MarkdownField(null=True, blank=True)

    content_panels = Page.content_panels + [
        MarkdownPanel('body', classname="full"),
    ]

    def get_context(self, request, *args, **kwargs):
    	context = super().get_context(request, *args, **kwargs)
    	context["posts"] = IndexDetailPage.objects.live().public()
    	json_list = list(IndexDetailPage.objects.live().public().values('slug', 'rownum'))
    	context['json_dict'] = json.dumps(json_list)
    	return context