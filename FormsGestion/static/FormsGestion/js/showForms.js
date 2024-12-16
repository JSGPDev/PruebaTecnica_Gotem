function show_forms(){
    const delete_buttons = $(".delete-form");

    delete_buttons.each(function () {
        const button = $(this)
        button.on("click", function () {
            alert("Are you sure you want to delete this form?");
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
}

export { show_forms };