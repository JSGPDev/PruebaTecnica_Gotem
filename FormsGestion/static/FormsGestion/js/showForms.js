function show_forms(){
    const delete_buttons = $(".delete-form");

    delete_buttons.each(function () {
        const button = $(this)
        button.on("click", function () {
            showAlert('Cuidado', 'alert-warning-icon', 'Esta seguro de eliminar el formulario? No se podra revertir', true, false, () => {
                const form_id = $(this).attr("formId");
                $.ajax({
                    type: "POST",
                    url: "forms/delete-form",
                    data: {
                        csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
                        formId: form_id
                    },
                    success: function (response) {
                        if (response.status == "success") {
                            $(`[formId="${form_id}"]`).remove();
                        } else {
                            alert(response.message);
                        }
                    }
                });
            });
        });
    });
}

export { show_forms };