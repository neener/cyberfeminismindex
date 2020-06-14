from wagtail.core.models import Page, Orderable
from wagtail.core.fields import RichTextField
from wagtail.admin.edit_handlers import FieldPanel, MultiFieldPanel, InlinePanel, PageChooserPanel, FieldRowPanel
from wagtail.images.edit_handlers import ImageChooserPanel
from wagtail.snippets.edit_handlers import SnippetChooserPanel

from django.db import models
from django import forms
from wagtail.snippets.models import register_snippet
from modelcluster.fields import ParentalManyToManyField, ParentalKey
from wagtail.contrib.routable_page.models import RoutablePageMixin, route
from autoslug import AutoSlugField
from django.shortcuts import render
from django.core.cache import cache


class Cindex(models.Model):
    cindex_id = models.IntegerField(primary_key=True)
    pub_date = models.PositiveSmallIntegerField(blank=True, null=True) 
    # range_date = models.TextField(blank=True, null=True)
    custom_title = models.TextField(blank=True, null=True)
    about = models.TextField(blank=True, null=True)
    sourceforabouttext = models.CharField(max_length=255, null=True, blank=True)
    author_founder = models.TextField(max_length=500, blank=True, null=True)
    external_link = models.TextField(blank=True, null=True)
    external_link2 = models.TextField(blank=True, null=True)
    location = models.TextField(blank=True, null=True)
    # publisher_parent = models.TextField(blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    note = models.TextField(blank=True, null=True)  # Field name made lowercase.
    # image = models.TextField(blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'cindex'


class IndexCategory(models.Model):
    """index category for a snippet."""
    name = models.CharField(max_length=255)
    slug = AutoSlugField(populate_from='name', allow_unicode=True)

    panels = [
        FieldPanel("name"),
    ]
    class Meta:
        verbose_name = "Index Category"
        verbose_name_plural = "Index Categories"
        ordering = ["name"]
    def __str__(self):
        return self.name

register_snippet(IndexCategory)


class IndexCurators(models.Model):
    """index category for a snippet."""
    name = models.CharField("Name/Organization", max_length=255)
    slug = AutoSlugField(populate_from='name', allow_unicode=True)

    panels = [
        FieldPanel("name"),
    ]
    class Meta:
        verbose_name = "Curator"
        verbose_name_plural = "Curators"
        ordering = ["name"]
    def __str__(self):
        return self.name

register_snippet(IndexCurators)



class IndexInternalLinks(models.Model):
    page = ParentalKey('index.IndexDetailPage', on_delete=models.CASCADE, related_name='internal_links')
    link_copy = models.TextField(blank=True, null=True)
    link_url = models.CharField(max_length=500,blank=True, null=True)
    link_page = models.ForeignKey('wagtailcore.Page', null=True, blank=True, on_delete=models.CASCADE,  related_name='+')

    panels = [
        FieldPanel("link_copy"),
        FieldPanel("link_url"),
        PageChooserPanel("link_page", 'index.IndexDetailPage'),
    ]

    class Meta:
        unique_together = ('page', 'link_page')
    def __str__(self):
        return self.link_page


class IndexPage(RoutablePageMixin, Page):
  print("index")
  custom_title = models.CharField(
      max_length=100,
      blank=False,
      null=False,
      help_text="Overwrites default title"
    )
  content_panels = Page.content_panels + [
    FieldPanel("custom_title")
  ]

  def get_context(self, request, *args, **kwargs):
    context = super().get_context(request, *args, **kwargs)
    context["posts"] = IndexDetailPage.objects.live().public()
    context["categories"] = IndexCategory.objects.all()
    return context

  @route(r"^orderby/(?P<order>[-\w]+)/$", name="orderby_view")
  def orderby_view(self,request,order):
    context = self.get_context(request)
    try:
      orderby = IndexDetailPage.objects.live().public().order_by(order)
    except Exception:
      orderby = None
    if orderby is None:
      pass

    context["posts"] = orderby
    cache.clear()
    return render(request, "index/index_page.html", context)

  @route(r"^tag/(?P<cat_slug>[-\w]+)/$", name="tag_view")
  def tag_view(self,request,cat_slug):
    context = self.get_context(request)
    try:
      category = IndexCategory.objects.get(slug=cat_slug)
    except Exception:
      category = None
    if category is None:
      pass

    context["posts"] = IndexDetailPage.objects.live().public().filter(categories__in=[category])
    print(context["posts"])
    return render(request, "index/index_page.html", context)

    # def category_sort():
    #   print("sorrrrtttt")
    #   parent_page = IndexPage.objects.get(title='Index').specific
    #   cindex_pages = Cindex.objects.all()
      
    #   print(cindex_pages)
    #   for c in cindex_pages:
    #     print(c.custom_title)

    #     new_page = IndexDetailPage(
    #       title = c.custom_title,
    #       about = c.about,
    #       sourceforabouttext = c.sourceforabouttext,
    #       author_founder = c.author_founder,
    #       # pub_date = c.pub_date,
    #       external_link = c.external_link,
    #       external_link_two = c.external_link2,
    #     )
    #     parent_page.add_child(instance=new_page)
    #     new_page.save()
    #     print("done")
    # category_sort()

class CollectionsOrderable(Orderable):
    """This allows us to select one or more blog authors from Snippets."""
    page = ParentalKey('index.IndexDetailPage', on_delete=models.CASCADE, related_name='collections_list')
    curators = models.ForeignKey("index.IndexCurators", on_delete=models.CASCADE, blank=True, related_name='c_list')

    panels = [
        SnippetChooserPanel("curators"),
    ]

    def __str__(self):
      str_return = str(self.curators)
      return str_return

class ImagesOrderable(Orderable):
    """This allows us to select one or more blog authors from Snippets."""
    page = ParentalKey('index.IndexDetailPage', on_delete=models.CASCADE, related_name='images_list')
    images = models.ForeignKey("wagtailimages.Image", null=True, blank=True, on_delete=models.CASCADE)
    caption = models.CharField("caption", max_length=255, null=True, blank=True)
    custom_alt = models.CharField("Custom Alt", max_length=255, null=True, blank=True)

    panels = [
        ImageChooserPanel("images"),
        FieldPanel("caption"),
        FieldPanel("custom_alt"),
    ]

    def __str__(self):
      str_return = str(self.images)
      return str_return

class IndexDetailPage(Page):
  # custom_title = AutoSlugField(populate_from='title')
  about = models.TextField(null=True, blank=True)
  sourceforabouttext = models.CharField("Source for about text", max_length=255, null=True, blank=True)
  categories = ParentalManyToManyField("index.IndexCategory", blank=True)
  pub_date = models.PositiveSmallIntegerField("Date Published / Created", null=True, blank=True)
  end_date = models.PositiveSmallIntegerField("End Date", null=True, blank=True)
  author_founder = models.CharField("Author/Founder", max_length=500, null=True, blank=True)
  contributed_by = models.CharField("Contributed By", max_length=500, null=True, blank=True)
  external_link = models.URLField(null=True, blank=True)
  external_link_two = models.URLField(null=True, blank=True)
  autoincrement_num = models.PositiveSmallIntegerField(null=True, blank=True)
  location = models.CharField("location", max_length=255, null=True, blank=True)

  content_panels = Page.content_panels + [
		FieldPanel('about', classname="full"),
         MultiFieldPanel([
            FieldRowPanel([
        		FieldPanel('pub_date'),
        		FieldPanel('end_date'),
            ]),
            FieldRowPanel([
            	FieldPanel('author_founder'),
            	FieldPanel('location'),
            ]),
            FieldRowPanel([
            	FieldPanel('external_link'),
              FieldPanel('external_link_two'),
            ]),
            FieldRowPanel([
              FieldPanel('contributed_by'),
            ]),
        ], 'Details'),
         MultiFieldPanel([
          InlinePanel('images_list', label='Image'),
          ],
          heading="Image(s)",
        ),
        MultiFieldPanel(
    		[
            FieldPanel("categories", widget=forms.CheckboxSelectMultiple)
            ],
            heading="Categories"
        ),
        MultiFieldPanel(
    		[
            InlinePanel('internal_links', label='Link'),
            ],
            heading="Cross Reference",
            classname="collapsible"
        ),
        MultiFieldPanel([
          InlinePanel('collections_list', label='Curator'),
          ],
          heading="Curator(s)",
        ),
    ]






