from django.utils.deprecation import MiddlewareMixin
from django.shortcuts import redirect
from django.template.response import TemplateResponse
import re

class SessionMiddleware(MiddlewareMixin):
    def process_request(self, request):
        is_logged = request.session.get('logged')

        acepted_urls = ['/admin', '/session']
        self.dynamic_patterns = [
            r'^/FormsGestion/forms/show/\d+$'
        ]
        current_url = request.path
        if not is_logged and current_url != '/' and not any(current_url.startswith(url) for url in acepted_urls):
            if not any(re.match(pattern, current_url) for pattern in self.dynamic_patterns):
                return redirect('/')