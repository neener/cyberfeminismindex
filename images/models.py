from django.db import models

# Create your models here.
from wagtail.core.models import Page
from wagtail.core.fields import RichTextField
from wagtail.admin.edit_handlers import FieldPanel

from wagtail.contrib.routable_page.models import RoutablePageMixin, route
from django.shortcuts import render

import simplejson as json

from index.models import IndexDetailPage
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator

@method_decorator(cache_page(300), name="serve")
class ImagesPage(Page):

	def get_context(self, request, *args, **kwargs):
		context = super().get_context(request, *args, **kwargs)

		context["posts"] = IndexDetailPage.objects.live().public()
		json_list = list(IndexDetailPage.objects.live().public().values('slug', 'rownum', 'title'))
		context['json_dict'] = json.dumps(json_list)
		context["image_entries"] = []
		
		for index in context["posts"]:
			 for c in index.images_list.all():
			 	if index not in context["image_entries"]:
				 	context["image_entries"].append(index)

		return context
		

