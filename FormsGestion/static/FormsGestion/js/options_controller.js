$(document).ready(function () {
    const options = $('#options-container').addClass("options-closed");
    const nav = $('#options-nav').fadeOut(500);

    $('#options-icon').click(function () {
        $(this).fadeOut(0);
        $(this).fadeIn(500);
        options.toggleClass("options-open options-closed");
        if(options.hasClass("options-open")){
            nav.remove();
            options.after(nav);
            nav.fadeIn(500);
        }else if(options.hasClass("options-closed")){
            nav.remove();
            options.append(nav);
            nav.fadeOut(500);
        }
    });
})