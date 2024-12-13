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
            label.removeClass("fucused");
        })
    }
  });

});
