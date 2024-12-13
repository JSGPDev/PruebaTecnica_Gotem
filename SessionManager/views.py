from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from .models import users

# Verifica si la sesión ya se inició; redirecciona al home o muestra el selector de formularios.
def index(request):
    if request.session.get('logged'):
        return redirect('/FormsGestion')
    return render(request, 'sessions.html')

# Verifica si la sesión ya inició, o intenta iniciar sesión con las credenciales proporcionadas.
def login(request):
    try:
        # Verificar si la sesión ya está activa
        if request.session.get('logged'):
            return redirect('/FormsGestion')

        # Tomar los valores del formulario
        email = request.POST.get('email')
        password = request.POST.get('password')

        if not email or not password:
            return render(request, 'sessions.html',{'logged': False, 'error': 'Email y contraseña son obligatorios'}, status=400)

        user = users.objects.filter(email=email).first()

        # Verificar si el correo existe
        if not user:
            return render(request,'sessions.html',{'logged': False, 'error': 'El correo no está registrado'}, status=404)

        # Verificar la contraseña encriptada
        if check_password(password, user.password):
            # Iniciar sesión
            request.session['logged'] = True
            request.session['user_id'] = user.id
            return redirect('/FormsGestion')
        else:
            return render(request,'sessions.html',{'logged': False, 'error': 'La contraseña es incorrecta'}, status=401)

    except Exception as e:
        return render(request,'sessions.html',{'logged': False, 'error': f'Error inesperado: {str(e)}'}, status=500)

# Cierra la sesión si está activa
def logout(request):
    if request.session.get('logged'):
        request.session.flush()  # Borra todos los datos de sesión
    return redirect('/')

# Registra un nuevo usuario si los datos proporcionados son válidos
def register(request):
    try:
        # Tomar los valores del formulario
        name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if not name or not email or not password:
            return render(request,'sessions.html',{'registered': False, 'error': 'Todos los campos son obligatorios'}, status=400)

        # Verificar si la contraseña tiene al menos 8 caracteres
        if len(password) < 8:
            return render(request,'sessions.html',{'registered': False, 'error': 'La contraseña debe tener al menos 8 caracteres'}, status=400)

        # Verificar si el correo ya está registrado
        if users.objects.filter(email=email).exists():
            return render(request,'sessions.html',{'registered': False, 'error': 'El correo ya está registrado'}, status=409)

        # Encriptar la contraseña y crear el usuario
        encrypted_password = make_password(password)
        users.objects.create(name=name, email=email, password=encrypted_password)
        return render(request,'sessions.html', {'registered': True}, status=201)

    except Exception as e:
        return render(request,'sessions.html',{'registered': False, 'error': f'Error inesperado: {str(e)}'}, status=500)
