from django.urls import path

from . import views

urlpatterns = [
    path('', views.index),
    path('forms', views.all_forms),
    path('forms/create', views.form_builder),
    path('forms/new', views.form_checker),
    path('forms/save-form-groups', views.save_array_groups),
    path('forms/show/<int:id>', views.show_form),
    path('forms/delete-form', views.delete_form),
    path('forms/save-form-response', views.save_form_response),
    path('forms/show-responses/<int:id>', views.show_form_responses),
]