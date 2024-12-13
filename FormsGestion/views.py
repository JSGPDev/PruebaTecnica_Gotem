from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import FormStructure, FormEntity, FormField, FieldGroup
from SessionManager.models import users

import json

def index(request):
    return render(request, 'index.html')

def form_builder(request):
    return render(request, 'formBuilder.html', {'entitys':[{
        'id': entity.id,
        'name': entity.name,
        'type': entity.type
    }for entity in FormEntity.objects.all()]})

def form_checker(request):
    return create_form(request) if request.POST.get('formId') == "" else update_form(request)
        
def all_forms(request):
    return render(request, 'allForms.html', {'forms': [
        {
            'id': form_object.id,
            'user' : form_object.creator.name,
            'name' : form_object.name,
            'date' : form_object.date
        } for form_object in FormStructure.objects.all()
    ]})

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
        }for group in groups]
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
    return JsonResponse({'status': 'success', 'message': 'aun no implementado'})