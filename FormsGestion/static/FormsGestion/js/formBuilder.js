function form_builder(){
    responsive_setup();

    let groups = [];
    let last_header = "";
    let last_name = "";

    $("#new-field-text-container").hide();
    $("#new-field-name-container").hide();

    setup_text_labels();

    $("#create-form").click(function () {
        const form = $("#form-building");
        const form_id = $("#form-building").attr("formId");
        const new_form_name = $("#new-form-name").val();
        const csrfmiddlewaretoken = $("input[name='csrfmiddlewaretoken']").val();

        $.ajax({
            type: form.attr("method"),
            url: form.attr("action"),
            data: {
                csrfmiddlewaretoken: csrfmiddlewaretoken,
                name: new_form_name,
                formId: form_id
            },
            success: function (response) {
                console.log(response);
                if(response.status == "success"){
                    console.log(response.form.id);
                    update_form_id(response.form.id);
                    save_form_groups(response.form.id);
                    showAlert('Correcto', 'alert-success-icon', 'Formulario guardado', false, 1000);
                }else{
                    showAlert('Error', 'alert-error-icon', response.message, false, false);
                }
            }
        })
    });

    $("#new-field-type").change(function () {
        const field_type = $("#new-field-type option:selected").attr('entityType');
        
        if(field_type !== 'null'){
            $("#new-field-text-container").show();
        }
        else{
            $("#new-field-text-container").hide();
        }
        
    })

    $("#add-field").click(function (e) {
        e.preventDefault();
        const form = $("#form-building");
        const field_type = $("#new-field-type option:selected").attr('entityType');
        const field_entity_id = $("#new-field-type option:selected").val();
        const field_tag = $("#new-field-type option:selected").text();
        const field_name = $("#new-group-name").val().replace(/ /g, "-");
        const field_text = $("#new-field-text").val();

        const group_name = $("#new-group-name").val().replace(/ /g, "-");
        const group_header = $("#new-group-header").val();
        const group_indicator = `${group_name}_${group_header}`.replace(/[^a-zA-Z0-9_-]/g, "");
        
        let new_field = $(`#${group_indicator}`);

        let created_object;
        let created_object_specials;

        if (group_name === "") {showAlert('Error', 'alert-error-icon', 'El nombre del grupo no puede estar vacío.', false, false); return;}
        if (group_header === "") {showAlert('Error', 'alert-error-icon', 'El encabezado del grupo no puede estar vacío.', false, false); return;}
        if (field_text === "") {showAlert('Error', 'alert-error-icon', 'El texto del campo no puede estar vacío.', false, false); return;}

        if (new_field.length === 0) {
            new_field = $("<div>", {
                class: "form-group column",
                group: `${group_indicator}`,
                id: `${group_indicator}`,
                html: group_name != last_name ? `<h2 group="${group_indicator}" class="group-title left-arrow secondary-background muted-color">${group_name}</h2>` : ""
            });
        } else {
            console.log("Elemento ya existe. Usando el existente.");
        }

        last_name = group_name;

        if(group_header !== last_header && $(`#${group_indicator}-header`).length === 0){
            last_header = group_header;
            const field_header = $("<p>",{
                class:`group_header`,
                id:`${group_indicator}-header`,
                html: last_header
            })
            new_field.append(field_header);
            $("#form-building").append(new_field);

            const inserted_field = $(`#${group_indicator}`);
            const inserted_field_title = inserted_field.find('.group-title').remove();

            inserted_field.before(inserted_field_title);
        }

        const doc_header_instance = $(`#${group_indicator}-header`);

        const labbel = $("<label>",{
            for: `${field_type}-${field_name}-${field_text}`,
            text: field_text.replace(/-/g," ")
        });

        switch (field_type) {
            case "input":
                created_object = $("<input>", {
                    type: field_tag,
                    name: field_name,
                    group: `group|${field_type}|${field_name}`,
                    id: "input-" + field_name + "-" + field_text,
                    placeholder: field_text
                });
            break;
    
            case "select":
                const select = $("<select>", {
                    name: field_name,
                    group: `group|${field_type}|${field_name}`,
                    id: "select-" + field_name + "-" + field_text,
                    html: `<option value="" disabled selected>${field_text}</option>`
                });

                const select_options_controller = $("<div>",{
                    class: "row add_option_bottons_container",
                    group: `group|${field_name}`
                });

                const new_options_name = $("<input>",{
                    type: "text",
                    group: `group|${field_name}`,
                    id: field_name + "-new-option",
                    placeholder: "Opcion"
                })

                const new_option_name_label = $("<label>",{
                    for: field_name + "-new-option",
                    style: "width: 100%",
                    text: "Opcion"
                })
    
                const add_option_btn = $("<button>", {
                    type: "button",
                    class: "add-option full-width",
                    group: `group|${field_name}`,
                    id: "add-option-" + field_name,
                    html: "Agregar Opcion"
                });

                const new_option_input = $("<div>", {
                    class: "row field-container",
                })

                new_option_input.append(new_options_name);
                new_option_input.append(new_option_name_label);

                select_options_controller.append(new_option_input);
                select_options_controller.append(add_option_btn);
    
                // Agrega el evento dinámicamente al botón
                add_option_btn.on("click", function () {
                    add_option_to(group_header,select, new_options_name);
                });
                
                created_object = select;
                created_object_specials = select_options_controller;
            break;
    
            default:
                created_object = $(`<${field_tag}>`, {
                    name: field_name,
                    group: `group|${field_type}|${field_name}`,
                    id: `${field_tag}-${field_name}-${field_text}`,
                    text: field_text
                });

                if (field_tag === "textarea") {
                    created_object.attr("placeholder", field_text);
                }

                console.warn(`Elemento genérico creado con el tag: ${field_tag}`);
            break;
        }

        if(created_object_specials !== undefined)doc_header_instance.after(created_object_specials);

        const field_container = $("<div>",{
            class: "field-container",
        })
        field_container.append(created_object);
        if(field_type !== "select")field_container.append(labbel);

        doc_header_instance.after(field_container);

        const erase_icon = $('<span>',{
            class: "remove-field trash-icon",
            parent_group: group_indicator
        });

        field_container.append(erase_icon);

        erase_icon.on("click", function () {
            showAlert('Eliminar Campo', 'alert-warning-icon', 'Desea eliminar el campo?', true, false, () => {
                
                const field_object = created_object;
            
                const group = groups.find(group => 
                    group.fields.some(field => field.object === field_object)
                );
            
                if (group) {
                    group.fields = group.fields.filter(field => field.object !== field_object);
                    
                    console.log(group.fields);
            
                    if (group.fields.length === 0) {
                        groups = groups.filter(g => g !== group);
                        $(`[group=${group_indicator}]`).remove();
                        last_header = '';
                        last_name = '';
                    }
                }
            
                const field_next_div = $(this).parent().next('.add_option_bottons_container');
                if(field_next_div.length > 0){
                    field_next_div.remove();
                }

                $(this).parent().remove();


                console.log(groups);
            });
        });

        setup_text_labels();
            
        if(!groups.find(group => group.header === group_header))
            {
                push_to_groups(group_name,group_header);
            }
        let group = groups.find(group => group.header === group_header);
        group.fields.push(create_field(field_entity_id,group_header,field_text,'',created_object));

    });

    function update_form_id(new_id){
        $("#form-building").attr("formId", new_id);
    }

    function add_option_to(group_header,select, input){
        const g=groups.find(group => group.header === group_header);

        console.log(g.fields.find(field => field.object === select).specials);

        const new_option_name = input.val();
        if(new_option_name == ""){
            showAlert('Error', 'alert-error-icon', 'Debe ingresar una opcion', false, false);
            return;
        }else{
            select.append(`<option value="${new_option_name}">${new_option_name}</option>`);
            input.val("");
            select.focus();

            g.fields.find(field => field.object === select).specials = select.html();
            console.log(g.fields.find(field => field.object === select).specials);
            showAlert('Correcto', 'alert-success-icon', 'Opcion agregada', false, 1000);
        }
    }

    function save_form_groups(form_id){
        const csrfmiddlewaretoken = $("input[name='csrfmiddlewaretoken']").val();

        $.ajax({
            type: "POST",
            url: "save-form-groups",
            data: {
                csrfmiddlewaretoken: csrfmiddlewaretoken,
                formId: form_id,
                groups: JSON.stringify(groups)
            },
            success: function (response) {
                console.log(response);
                if(response.status == "success"){
                    showAlert('Correcto', 'alert-success-icon', 'Formulario guardado', false, 1000);
                    groups = [];
                }else{
                    showAlert('Error', 'alert-error-icon', response.message, false, false);
                }
            }
        })
    }

    function push_to_groups(group_name,group_header){
        const new_group = {
            'name': group_name,
            'header': group_header,
            'fields': []
        }

        groups.push(new_group);
    }

    function create_field(fieldtype,name,text,specials,object){
        const new_field = {
            'type': fieldtype,
            'name': name,
            'text': text,
            'specials': specials,
            'object': object
        }

        return new_field;
    }

    function setup_text_labels(){
        const texts = $('input[type="text"]')

        texts.each(function () {
            const text = $(this);
            const labbel = text.next("label");
    
            text.on("change",function () {
                labbel.text(text.val() != "" ? text.val() : text.attr("placeholder"));
            })
        });
    }
}

function responsive_setup(){
    $('#show-buider-controls div').click(function () {
        $('.buider-controls').addClass('buider-controls-open');
        $(this).fadeOut(1000);
    });

    $('#close-buider-controls').click(function () {
        $('.buider-controls').removeClass('buider-controls-open');
        $('#show-buider-controls div').fadeIn(1000);
    });

    $('#create-form').click(function () {
        if($('.buider-controls').hasClass('buider-controls-open')){
            $('.buider-controls').removeClass('buider-controls-open');
            $('#show-buider-controls div').fadeIn(1000);
        }
    });

    $('#add-field').click(function () {
        if($('.buider-controls').hasClass('buider-controls-open')){
            $('.buider-controls').removeClass('buider-controls-open');
            $('#show-buider-controls div').fadeIn(1000);
        }
    });
}

export {form_builder};