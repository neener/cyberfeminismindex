from django.db import models
from django.template.response import TemplateResponse

from wagtail.core.models import Page
from wagtail.core.fields import RichTextField
from wagtail.admin.edit_handlers import FieldPanel
from wagtailmarkdown.fields import MarkdownField
from wagtailmarkdown.edit_handlers import MarkdownPanel
from wagtail.contrib.routable_page.models import RoutablePageMixin, route

import simplejson as json

from index.models import IndexDetailPage, IndexDownloads

class AboutPage(RoutablePageMixin, Page):
    body = MarkdownField(null=True, blank=True)

    content_panels = Page.content_panels + [
        MarkdownPanel('body', classname="full"),
    ]

    def get_context(self, request, *args, **kwargs):
        context = super().get_context(request, *args, **kwargs)
        context["posts"] = IndexDetailPage.objects.live().public()
        json_list = list(context["posts"].values('slug', 'title', 'author_founder','rownum','pub_date','end_date', 'about', 'location', 'external_link', 'external_link_two', 'images_list','page_ptr_id'))
        context['json_dict'] = json.dumps(json_list)
        context["image_entries"] = []

        for index in context["posts"]:
           for c in index.images_list.all():
              context["image_entries"].append({"slug":index.slug, "img_name":str(c)})

        context['json_img_dict'] = json.dumps(list(context["image_entries"]))
        self.new_download_snip(request)
        return context

    def new_download_snip(self,request):
        titles_array = []
        page_ptr_id_str = request.GET.get('downloadpdf')
        if page_ptr_id_str:
            page_ptr_id_array = page_ptr_id_str.split(",")
            for p in page_ptr_id_array:
                obj = IndexDetailPage.objects.get(page_ptr_id=p)
                titles_array.append(obj.title)
            titles_string = ','.join(titles_array)
            new_snip = IndexDownloads(quantity = len(titles_array), entries = titles_string)
            new_snip.save()


    @route(r'^submit/$', name="submit_page")
    def submit_page(self, request):
        return TemplateResponse(
          request,
           'about/about_submit_page.html'
        )