from django.db import models
from wagtail.core.models import Page
from wagtail.core.fields import RichTextField
from wagtail.admin.edit_handlers import FieldPanel
from wagtail.contrib.routable_page.models import RoutablePageMixin, route
from django.shortcuts import render

import simplejson as json

from index.models import IndexCurators
from index.models import IndexDetailPage

class CollectionPage(RoutablePageMixin, Page):
	def get_context(self, request, *args, **kwargs):
		context = super().get_context(request, *args, **kwargs)
		context["posts"] = IndexDetailPage.objects.live().public()
		json_list = list(context["posts"].values('slug', 'rownum', 'title', 'author_founder','rownum','pub_date','end_date', 'about', 'location', 'external_link', 'external_link_two', 'images_list'))
		context['json_dict'] = json.dumps(json_list)
		return context

	@route(r"^(?P<cur_slug>[-\w]+)/$", name="collections_view")
	def collections_view(self,request,cur_slug):
		context = self.get_context(request)
		curator = IndexCurators.objects.get(slug=cur_slug)
		try:
			curator = IndexCurators.objects.get(slug=cur_slug)
		except Exception:
			curator = None
		if curator is None:
			pass
		
		context["url_curator"] = str(curator)
		context["posts"] = IndexDetailPage.objects.live().public()
		context["curated_entries"] = []
		
		for index in context["posts"]:
			 for c in index.collections_list.all():
			 	if str(c) == str(curator):
			 		context["curated_entries"].append(index)
		return render(request, "collection/collection_page.html", context)




