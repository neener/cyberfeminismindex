from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.shortcuts import render

from wagtail.core.models import Page
from wagtail.search.models import Query

from wagtail.contrib.routable_page.models import RoutablePageMixin, route
from django.shortcuts import render

from index.models import IndexDetailPage
from index.models import IndexCategory

from django.template.loader import render_to_string
from django.http import JsonResponse
from wagtail.search import index

def autocomplete_search(request):
    search_categories = IndexCategory.objects.all()
    if request.is_ajax():
        search_query = request.GET.get('q', None)
        search_results_ajax = IndexDetailPage.objects.live().search(search_query)

        html = render_to_string(
            template_name="search/search-results-partial.html", 
            context={'search_query': search_query, "search_results": None, "search_results_ajax": search_results_ajax,'search_categories': search_categories}
        )
        data_dict = {"html_from_view": html}

        return JsonResponse(data=data_dict, safe=False)


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

    return render(request, 'search/search.html', {
        'search_query': search_query,
        'search_results': search_results,
        'search_categories': search_categories,
    })
