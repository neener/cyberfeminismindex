class NewWindowExternalLinkHandler(LinkHandler):
    identifier = 'external'

    @classmethod
    def expand_db_attributes(cls, attrs):
        href = attrs["href"]
        return '<a href="%s" target="_blank" rel="noopener noreferrer">' % escape(href)

@hooks.register('register_rich_text_features')
def register_rich_text_handlers(features):
    features.register_link_type(NewWindowExternalLinkHandler)