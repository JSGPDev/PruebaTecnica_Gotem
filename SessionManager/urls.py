from django.urls import path

from . import views

urlpatterns = [
    path('', views.index),
    path('session/login', views.login),
    path('session/logout', views.logout),
    path('session/register', views.register),
]