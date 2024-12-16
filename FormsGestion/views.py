from django.shortcuts import render,redirect
from django.http import JsonResponse, HttpResponse
from openpyxl import Workbook

from .models import FormStructure, FormEntity, FormField, FieldGroup, FieldResponse
from SessionManager.models import users

import json

def index(request):
    return redirect('/FormsGestion/forms')

def form_builder(request):
    return render(request, 'formBuilder.html', {'entitys':[{
        'id': entity.id,
        'name': entity.name,
        'type': entity.type
    }for entity in FormEntity.objects.all()],"logged":request.session.get('logged')})

def form_checker(request):
    return create_form(request) if request.POST.get('formId') == "" else update_form(request)
        
def all_forms(request):
    return render(request, 'allForms.html', {'forms': [
        {
            'id': form_object.id,
            'user' : form_object.creator.name,
            'name' : form_object.name,
            'date' : form_object.date
        } for form_object in FormStructure.objects.filter(creator=users.objects.get(id=request.session.get('user_id')))
    ],"logged":request.session.get('logged')})

def create_form(request):
    try:
        if not request.session.get('logged'):
            return JsonResponse({'status': 'error', 'message': 'No estas logueado'})
        
        formName = request.POST.get('name')

        if not formName:
            return JsonResponse({'status': 'error', 'message': 'El nombre del formulario es obligatorio'})
        
        form = FormStructure.objects.create(name=formName, creator=users.objects.get(id=request.session.get('user_id')))
        return JsonResponse({'status': 'success', 'message': 'Formulario creado con exito', 'form':{
            'id': form.id,
            'name': form.name
        }})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f'Error inesperado: {str(e)}'})

def save_array_groups(request):
    try:
        groups = json.loads(request.POST.get('groups'))
        formId = request.POST.get('formId')

        for group in groups:
            group_object = FieldGroup.objects.create(
                name= group.get('name'),
                header= group.get('header'),
                structure= FormStructure.objects.get(id=formId)
            )
            fields = group.get('fields',[])
            for field in fields:
                FormField.objects.create(
                    name=field.get('name'),
                    group=group_object,
                    text=field.get('text'),
                    specials=field.get('specials'),
                    type=FormEntity.objects.get(id=field.get('type')),
                )

        return JsonResponse({'status': 'success', 'message': 'Grupos guardados con exito'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f'Error inesperado: {str(e)}'})

def show_form(request, id):
    form = FormStructure.objects.get(id=id)
    groups = FieldGroup.objects.filter(structure=form)

    data = {
        'form': {
            'id': form.id,
            'name': form.name,
            'date': form.date,},
        'groups': [{
            "id": group.id,
            'name': group.name,
            'header': group.header,
            'fields': []
        }for group in groups],
        "logged":request.session.get('logged')
    }

    for group in data['groups']:
        fields = FormField.objects.filter(group=group['id'])
        for field in fields:
            group['fields'].append({
                'id': field.id,
                'name': field.name,
                'type': field.type.type,
                'tag': field.type.name,
                'text': field.text,
                'specials': field.specials,
            })

    return render(request, 'viewForm.html', data)
    #return JsonResponse(data)

def update_form(request):
    try:
        form_id = request.POST.get('formId')
        form = FormStructure.objects.get(id=form_id)
        form.name = request.POST.get('name')
        form.save()
        return JsonResponse({
            'status': 'success',
            'message': 'Formulario actualizado con éxito',
            'form': {'id': form.id, 'name': form.name}
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f'Error inesperado: {str(e)}'})

def delete_form(request):
    try:
        form_id = request.POST.get('formId')
        form = FormStructure.objects.get(id=form_id)
        form.delete()
        return JsonResponse({'status': 'success', 'message': 'Formulario eliminado conxito'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f'Error inesperado: {str(e)}'})

def save_form_response(request):
    try:
        form_id = request.POST.get('formId')
        user_id = request.session.get('user_id') or 1

        responses = json.loads(request.POST.get('responses'))

        for response in responses:
            FieldResponse.objects.create(
                field=FormField.objects.get(id=response.get('id')),
                user=users.objects.get(id=user_id),
                response=response.get('response')
            )

        return JsonResponse({'status': 'success', 'message': 'Respuesta guardada conxito'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f'Error inesperado: {str(e)}'})
    

def show_form_responses(request, id):
    form = FormStructure.objects.get(id=id)
    responses = FieldResponse.objects.filter(field__group__structure=form)

    if(form.creator.id != request.session.get('user_id')):
        return redirect('/FormsGestion')

    # Verifica si se solicita la descarga del archivo Excel
    if 'download' in request.GET:
        # Crear el archivo Excel
        wb = Workbook()
        ws = wb.active
        ws.title = 'Respuestas'

        # Encabezado de la tabla
        ws.append(['ID Respuesta', 'Usuario', 'Campo', 'Respuesta'])

        # Agregar las respuestas al archivo Excel
        for response in responses:
            ws.append([response.id, response.user.email, response.field.name, response.response])

        # Crear una respuesta HTTP para el archivo Excel
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="respuestas_formulario.xlsx"'

        # Guardar el archivo Excel en la respuesta HTTP
        wb.save(response)
        return response

    # Si no se solicita la descarga, solo se renderiza el HTML
    return render(request, 'formResponses.html', {
        'form': {
            'id': form.id,
            'name': form.name,
            'date': form.date,
            'responses': [{
                'id': response.id,
                'user': response.user.email,
                'field': response.field.name,
                'response': response.response
            } for response in responses],
        },
        "logged":request.session.get('logged')
    })
