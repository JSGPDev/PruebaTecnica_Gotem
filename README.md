# Generador de Formularios Dinámicos

Este repositorio contiene el código fuente de un generador de formularios dinámicos desarrollado como parte de una prueba técnica. La aplicación permite a los usuarios crear, personalizar, administrar y llenar formularios de manera intuitiva, además de descargar las respuestas en formato Excel.

## Características

- **Creación de formularios:** Los usuarios pueden agregar campos personalizados como:
  - Opción Única (radio buttons).
  - Texto (campo de entrada simple).
  - Lista Desplegable (select).
- **Configuración avanzada de campos:**
  - Personalizar el nombre del campo.
  - Agregar opciones a campos de tipo "Opción Única" y "Lista Desplegable".
- **Visualización en tiempo real:** Los formularios se actualizan dinámicamente conforme se añaden campos.
- **Administración de formularios:** Sistema para listar y administrar formularios creados.
- **Control de cuentas:** Gestión de usuarios para rastrear quién crea y llena los formularios.
- **Exportación:** Descarga de respuestas de formularios en formato Excel.
- **Responsive Design:** Interfaz adaptativa para diferentes dispositivos.

## Tecnologías Utilizadas

- **Frontend:** HTML, CSS y JQuery.
- **Backend:** Django.
- **Base de Datos:** MySQLite.

## Instalación y Ejecución

### Prerrequisitos

- Python 3.9 o superior.
- Django 4.0 o superior.
- Pip para instalar las dependencias.

### Pasos para configurar el entorno:

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/JSGPDev/PruebaTecnica_Gotem.git
   cd PruebaTecnica_Gotem
   ```

2. Crear un entorno virtual (opcional pero recomendado):
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows usar venv\Scripts\activate
   ```

3. Instalar las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

4. Aplicar las migraciones:
   ```bash
   python manage.py migrate
   ```

5. Iniciar el servidor de desarrollo:
   ```bash
   python manage.py runserver
   ```

6. Acceder a la aplicación en el navegador en: [http://127.0.0.1:8000](http://127.0.0.1:8000)

### Credenciales de Prueba

- **Usuario administrador:**
  - Usuario: `admin`
  - email: `admin@admin.admin`
  - Contraseña: `admin1234`

## Uso

1. Acceder al panel de creación de formularios para diseñar uno nuevo.
2. Configurar los campos necesarios y guardar el formulario.
3. Compartir el enlace para que otros usuarios puedan llenarlo.
4. Descargar las respuestas en formato Excel desde la interfaz de administración.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, crea un fork del repositorio y realiza un pull request con tus cambios.

## Contacto

Cualquier duda o sugerencia, por favor contáctame en: jgonzalezprietodeveloper@gmail.com.
