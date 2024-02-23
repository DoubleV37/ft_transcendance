from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.profile, name='profile'),
    path('profilext/', views.profilext, name='profilext'),
    path('settings/', views.settings, name='settings'),
]
