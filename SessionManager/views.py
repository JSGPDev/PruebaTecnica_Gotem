from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from .models import users

def index(request):
    if request.session.get('logged'):
        return redirect('/FormsGestion')
    return render(request, 'sessions.html')

def login(request):
    try:
        if request.session.get('logged'):
            return redirect('/FormsGestion')

        email = request.POST.get('email')
        password = request.POST.get('password')

        if not email or not password:
            return render(request, 'sessions.html',{'logged': False, 'error': 'Email y contraseña son obligatorios','showAlert':{
                'title': 'Error',
                'text': 'Email y contraseña son obligatorios',
                'timmer': 3000,
                'icon': 'alert-error-icon',
                'can_cancel': False
            } }, status=400)

        user = users.objects.filter(email=email).first()

        if not user:
            return render(request,'sessions.html',{'logged': False, 'error': 'El correo no está registrado','showAlert':{
                'title': 'Error',
                'text': 'El correo no está registrado',
                'timmer': 3000,
                'icon': 'alert-error-icon',
                'can_cancel': False
            }}, status=404)

        if check_password(password, user.password):
            request.session['logged'] = True
            request.session['user_id'] = user.id
            return redirect('/FormsGestion')
        else:
            return render(request,'sessions.html',{'logged': False, 'error': 'La contraseña es incorrecta','showAlert':{
                'title': 'Error',
                'text': 'La contraseña es incorrecta',
                'timmer': 3000,
                'icon': 'alert-error-icon',
                'can_cancel': False
            }}, status=401)

    except Exception as e:
        return render(request,'sessions.html',{'logged': False, 'error': f'Error inesperado: {str(e)}','showAlert':{
            'title': 'Error',
            'text': f'Error inesperado: {str(e)}',
            'timmer': 3000,
            'icon': 'alert-error-icon',
            'can_cancel': False
        }}, status=500)

def logout(request):
    if request.session.get('logged'):
        request.session.flush() 
    return redirect('/')

def register(request):
    try:
        name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if not name or not email or not password:
            return render(request,'sessions.html',{'registered': False, 'error': 'Todos los campos son obligatorios','showAlert':{
                'title': 'Error',
                'text': 'Todos los campos son obligatorios',
                'timmer': 3000,
                'icon': 'alert-error-icon',
                'can_cancel': False
            }}, status=400)

        if len(password) < 8:
            return render(request,'sessions.html',{'registered': False, 'error': 'La contraseña debe tener al menos 8 caracteres','showAlert':{
                'title': 'Error',
                'text': 'La contraseña debe tener al menos 8 caracteres',
                'timmer': 3000,
                'icon': 'alert-error-icon',
                'can_cancel': False
            }}, status=400)

        if users.objects.filter(email=email).exists():
            return render(request,'sessions.html',{'registered': False, 'error': 'El correo ya está registrado','showAlert':{
                'title': 'Error',
                'text': 'El correo ya está registrado',
                'timmer': 3000,
                'icon': 'alert-error-icon',
                'can_cancel': False
            }}, status=409)

        encrypted_password = make_password(password)
        users.objects.create(name=name, email=email, password=encrypted_password)
        return render(request,'sessions.html', {'registered': True, 'showAlert':{
                'title': 'Registrado', 
                'text': 'Te has registrado con exito', 
                'timmer': 3000, 
                'icon': 'alert-success-icon', 
                'can_cancel': False
            }}, status=201)

    except Exception as e:
        return render(request,'sessions.html',{'registered': False, 'error': f'Error inesperado: {str(e)}','showAlert':{
            'title': 'Error',
            'text': f'Error inesperado: {str(e)}',
            'timmer': 3000,
            'icon': 'alert-error-icon',
            'can_cancel': False
        }}, status=500)
