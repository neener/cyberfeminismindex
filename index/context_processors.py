def add_variable_to_context(request):
	from index.models import IndexDetailPage

	return {
        'index_context': IndexDetailPage.objects.live().public()
    }

def add_collections_to_context(request):
	from index.models import IndexCurators

	return {
        'index_collections': IndexCurators.objects.all()
    }