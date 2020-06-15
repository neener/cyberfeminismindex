from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.shortcuts import render

from wagtail.core.models import Page
from wagtail.search.models import Query

from wagtail.contrib.routable_page.models import RoutablePageMixin, route
from django.shortcuts import render

from index.models import IndexDetailPage
from index.models import IndexCategory


def search(request):
    search_query = request.GET.get('query', None)
    page = request.GET.get('page', 1)

    search_categories = IndexCategory.objects.all()

    # Search
    if search_query:
        search_results = IndexDetailPage.objects.live().search(search_query)
        query = Query.get(search_query)

        # Record hit
        query.add_hit()
    else:
        search_results = IndexDetailPage.objects.none()

    # Pagination
    # paginator = Paginator(search_results, 10)
    # try:
    #     search_results = paginator.page(page)
    # except PageNotAnInteger:
    #     search_results = paginator.page(1)
    # except EmptyPage:
    #     search_results = paginator.page(paginator.num_pages)

    return render(request, 'search/search.html', {
        'search_query': search_query,
        'search_results': search_results,
        'search_categories': search_categories,
    })
