function form_builder(){
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

        alert(form_id);

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
                }else{
                    alert(response.message);
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

        if (new_field.length === 0) {
            new_field = $("<div>", {
                class: "form-group column",
                group: `${group_indicator}`,
                id: `${group_indicator}`,
                html: group_name != last_name ? `<h2 class="group-title left-arrow secondary-background muted-color">${group_name}</h2>` : ""
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

            alert("titulo del grupo insertado "+ inserted_field_title.text()); 
            inserted_field.before(inserted_field_title);
        }

        const doc_header_instance = $(`#${group_indicator}-header`);

        const labbel = $("<label>",{
            for: `${field_type}-${field_name}`,
            text: field_text.replace(/-/g," ")
        });

        switch (field_type) {
            case "input":
                created_object = $("<input>", {
                    type: field_tag,
                    name: field_name,
                    group: `group|${field_type}|${field_name}`,
                    id: "input-" + field_name,
                    placeholder: field_text
                });
            break;
    
            case "select":
                const select = $("<select>", {
                    name: field_name,
                    group: `group|${field_type}|${field_name}`,
                    id: "select-" + field_name,
                    html: `<option value="" disabled selected>${field_text}</option>`
                });

                const select_options_controller = $("<div>",{
                    class: "row",
                    group: `group|${field_name}`
                });

                const new_options_name = $("<input>",{
                    type: "text",
                    group: `group|${field_name}`,
                    id: field_name + "-new-option",
                    placeholder: "Agregar opcion"
                })

                const new_option_name_label = $("<label>",{
                    for: field_name + "-new-option",
                    text: "Agregar Opcion"
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
                    id: `${field_tag}-${field_name}`,
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

        setup_text_labels();
            
        if(!groups.find(group => group.header === group_header))
            {
                alert("crear grupo");
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
            alert("Ingrese un nombre");
        }else{
            select.append(`<option value="${new_option_name}">${new_option_name}</option>`);
            input.val("");
            select.focus();

            g.fields.find(field => field.object === select).specials = select.html();
            console.log(g.fields.find(field => field.object === select).specials);
            alert("Opcion agregada");
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
                    alert("Formulario guardado");
                    groups = [];
                }else{
                    alert(response.message);
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

export {form_builder};