$(document).ready(function () {
    doc_title = $("main").attr("doc-title");
    switch (doc_title) {
        case "form-builder":
            form_builder();    
        break;
        case "forms":
            show_forms();
        break;
    }
});

function form_builder(){
    let groups = [];
    let last_header = "";

    $("#new-field-text").hide();
    $("#new-field-name").hide();


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
                }else{
                    alert(response.message);
                }
            }
        })
    });

    $("#new-field-type").change(function () {
        const field_type = $("#new-field-type option:selected").attr('entityType');
        
        if(field_type !== 'null'){$("#new-field-name").show(); $("#new-field-text").show();}else{$("#new-field-name").hide(); $("#new-field-text").hide();}
        
    })

    $("#add-field").click(function (e) {
        e.preventDefault();
        const form = $("#form-building");
        const field_type = $("#new-field-type option:selected").attr('entityType');
        const field_entity_id = $("#new-field-type option:selected").val();
        const field_tag = $("#new-field-type option:selected").text();
        const field_name = $("#new-field-name").val().replace(/ /g, "-");
        const field_text = $("#new-field-text").val();

        const group_name = $("#new-group-name").val().replace(/ /g, "-");
        const group_header = $("#new-group-header").val();
    
        let new_field = $(`#group\\|${group_name}\\|div`);

        let object;

        if (new_field.length === 0) {
            new_field = $("<div>", {
                class: "column",
                group: `group|${group_name}|div`,
                id: `group|${group_name}|div`,
                html: `<h2>${group_name}</h2>`
            });
        } else {
            console.log("Elemento ya existe. Usando el existente.");
        }

        if(group_header !== last_header){
            last_header = group_header;
            const field_header = $("<p>",{
                class:"group-header",
                html: last_header
            })
            new_field.append(field_header);
        }

        const labbel = $("<label>",{
            for: field_name,
            text: field_tag === 'radio' ? field_text : field_name.replace("-"," ")
        });

        new_field.append(labbel);
    
        switch (field_type) {
            case "input":
                object = $("<input>", {
                    type: field_tag,
                    name: field_name,
                    group: `group|${field_type}|${field_name}`,
                    id: "input-" + field_name,
                    placeholder: field_text
                });
                new_field.append(object);
            break;
    
            case "select":
                const select = $("<select>", {
                    name: field_name,
                    group: `group|${field_type}|${field_name}`,
                    id: "select-" + field_name,
                    html: `<option value="" disabled selected>Seleccione una opcion</option>`
                });

                object = select;

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
    
                const add_option_btn = $("<button>", {
                    type: "button",
                    class: "add-option",
                    group: `group|${field_name}`,
                    id: "add-option-" + field_name,
                    html: "Agregar Opcion"
                });

                select_options_controller.append(new_options_name);
                select_options_controller.append(add_option_btn);
    
                // Agrega el evento dinámicamente al botón
                add_option_btn.on("click", function () {
                    add_option_to(group_header,select, new_options_name);
                });
                
                new_field.append(select);
                new_field.append(select_options_controller);
            break;
    
            default:
                alert("Seleccione un campo");
                break;
        }
    
        $("#form-building").append(new_field);
        
        if(!groups.find(group => group.header === group_header)){alert("crear grupo");push_to_groups(group_name,group_header);}
        let group = groups.find(group => group.header === group_header);
        group.fields.push(create_field(field_entity_id,field_name,field_text,'',object));
    });

    function update_form_id(new_id){
        $("#form-building").attr("formId", new_id);
    }

    function add_option_to(group_header,select, input){
        g=groups.find(group => group.header === group_header);
        console.log(g.fields.find(field => field.object === select).specials);
        new_option_name = input.val();
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
            url: "save-form-groups/",
            data: {
                csrfmiddlewaretoken: csrfmiddlewaretoken,
                formId: form_id,
                groups: JSON.stringify(groups)
            },
            success: function (response) {
                console.log(response);
            }
        })
    }

    function push_to_groups(group_name,group_header){
        new_group = {
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
}

function show_forms(){

}