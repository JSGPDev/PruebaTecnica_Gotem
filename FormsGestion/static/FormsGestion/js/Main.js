import { form_builder } from "./formBuilder.js";
import { form_view } from "./formView.js";
import { show_forms } from "./showForms.js";

$(document).ready(function () {
    const doc_title = $("main").attr("doc-title");
    switch (doc_title) {
        case "form-builder":
            form_builder();    
        break;
        case "show-forms":
            show_forms();
        break;
        case "form-view":
            form_view()
        break;
    }
});
