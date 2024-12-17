$(document).ready(function () {

  $(".unSelected form").hide();

  $(".selectLogin").click(function () {
    $("#login").addClass("unSelected").removeClass("selected");
    $("#register").addClass("selected").removeClass("unSelected");
    $(".unSelected form").fadeOut(250);
    $(".selected form").fadeIn(250);
  });

  $(".selectRegister").click(function () {
    $("#register").addClass("unSelected").removeClass("selected");
    $("#login").addClass("selected").removeClass("unSelected");
    $(".unSelected form").fadeOut(250);
    $(".selected form").fadeIn(250);
  });

  $("label").click(function () {
      if($(this).hasClass("fucused") === false){
        var label = $(this);
        label.addClass("fucused");

        const target = $("input[name=" + $(this).attr("for") + "]");

        target.focus();

        target.focusout(function () {
            if(!target.hasClass("password")) label.text(target.val() !== "" ? target.val() : target.attr("placeholder"));
            label.removeClass("fucused");
        })
    }
  });
  
  $("form").each(function() {
    const form = $(this);
    const email_field = form.find("input[name=email]");
    const label = form.find("label[for=email]");
  
    email_field.change(function (e) { 
      label.text(e.target.value);
    });

    const password_label = form.find("label[for=password]");
    const password_field = form.find("input[name=password]");

    password_label.click(function () {
      password_field.attr('type', 'text');
    });

    password_field.focusout(function () {
      password_field.attr('type', 'password');

    });
  });



});
