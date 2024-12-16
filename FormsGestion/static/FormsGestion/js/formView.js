function form_view(){
    response_manager();
    const titles = $(".group-title");
    
    let last_title_text = "";
    titles.each(function () {
        const title = $(this);
        const title_text = title.text();
        if(title_text === last_title_text){
            title.remove();
        }
        title.text(title_text.replace(/-/g, " "));
        last_title_text = title_text;
    });

    const field_groups = $(".form-group");

    field_groups.each(function () {
        const field_group = $(this);
        const group_divs = $(".field-container", field_group);
        let last_field_type = group_divs.eq(0).attr("field_type");
        
        if(group_divs.length <= 1) return;

        let new_container = $('<div>',{
            class: "field-row-container",
        })

        group_divs.eq(0).after(new_container);

        group_divs.each(function () {
            const group_div = $(this);
            const field_type = group_div.attr("field_type");
            if(field_type === last_field_type){
                new_container.append(group_div.remove());
            }
            last_field_type = field_type;
        });
    });

    const radio_inputs = $("input[type='radio']");
    radio_inputs.hide();

    const text_inputs = $("input[type='text']");
    text_inputs.each(function () {
        const text_input = $(this);
        const text_label = text_input.next();
        text_input.on('change', function () {
            text_label.text(text_input.val() != "" ? text_input.val() : text_input.attr("placeholder"));
        });
    });
}

function response_manager() {
   const form = $("#form-view");

   $('input[type="text"]').val('');

   form.on('submit', function (e) {
        e.preventDefault();
        let fields_responses =[];

        const fields = $(".field");

        fields.each(function () {
            const field = $(this);

            const response = {
                "id": $(this).attr("field_id"),
                "response": ""
            };
            
            const field_name = field.attr("name");
            const field_value = field.val();

            if(field.attr("type") === "radio"){
                if(field.is(':checked')){
                    response.response = field_value;
                }
            }else{
                response.response = field_value;
            }

            fields_responses.push(response);
        });

        fields_responses = fields_responses.filter(field => field.response != "");
        console.log(fields_responses);

        $.ajax({
            type: "POST",
            url: "/FormsGestion/forms/save-form-response",
            data: {
                csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
                formId: form.attr("formId"),
                responses: JSON.stringify(fields_responses)
            },
            success: function (response) {
                console.log(response);
                if(response.status == "success"){
                    alert("Formulario guardado");
                }else{
                    alert(response.message);
                }
            }
        });

    });
}


export {form_view}