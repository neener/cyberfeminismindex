from django.db import models

# Create your models here.
from wagtail.core.models import Page
from wagtail.core.fields import RichTextField
from wagtail.admin.edit_handlers import FieldPanel

from wagtail.contrib.routable_page.models import RoutablePageMixin, route
from django.shortcuts import render

from index.models import IndexDetailPage


class ImagesPage(Page):

	def get_context(self, request, *args, **kwargs):
		context = super().get_context(request, *args, **kwargs)

		context["posts"] = IndexDetailPage.objects.live().public()
		context["image_entries"] = []
		
		for index in context["posts"]:
			 for c in index.images_list.all():
			 	if index not in context["image_entries"]:
				 	print('hi ', c, index.title)
				 	print(index)
				 	context["image_entries"].append(index)

		return context
		

