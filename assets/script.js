let projectContainerIDs = [];
$(".project-container").each(function () {
  projectContainerIDs.push(this.id);
});

projectContainerIDs.map((id) => {
  $(`#${id}`).click(() => {
    $(`#${id} .details`).toggleClass("hidden");
    document.getElementById(`${id}`).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  });
  $(`#${id}`).hover(
    function () {
      if (
        $(this).find(".details").hasClass("hidden") ||
        !$(this).find(".details").length
      ) {
        $(this).addClass("hover");
      }
    },
    function () {
      $(this).removeClass("hover");
    }
  );
});
