$(document).ready(function() {

  $(".about-container").one("mouseover", function() {
    // how to track whether or not user is scrolling up or down?
    $(".description").prepend("data, ");
    setTimeout(function() {
      $(".description").append(", cs");
    }, 700);
    setTimeout(function() {
      $(".description").append(", design");
    }, 1400);
  });

  $(window).load(function() {
    var counter = 0;
    var name = "Vanessa Qian";
    var splitted = name.split("");
    var interval = setInterval(function () {
      $(".name").append(splitted[counter]);
      counter++;
      if (counter == name.length) {
        clearInterval(interval);
      }
    }, 200);

    setTimeout(function() {
      $(".name-container").css("width", "50%");
    }, 2800);

    setTimeout(function() {
      $(".img").fadeIn(600);
    }, 3000);
  });

  $(window).scroll(function(event) {
    console.log("yoyoyo");
    var currScroll = $(this).scrollTop();
    if (currScroll >= 30) { //scrolling up
      $(".arrow-container1").addClass("change-opacity");
    }
    if (currScroll >= 800) {
      $(".arrow-container2").addClass("change-opacity");
    }
    if (currScroll == 0) {
      $(".arrow-container1").removeClass("change-opacity");
      $(".arrow-container2").removeClass("change-opacity");
    }
  });


});
