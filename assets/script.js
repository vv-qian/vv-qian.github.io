let projectContainerIDs = [];
$(".project-container").each(function () {
  projectContainerIDs.push(this.id);
});

projectContainerIDs.map((id) => {
  // On click
  $(`#${id}`).click(() => {
    history.replaceState(null, null, `${document.location.pathname}#${id}`);
    toggleDetails();
  });

  // On hover
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

function toggleDetails() {
  if (location.hash) {
    $(`${location.hash} .details`).toggleClass("hidden");
    document
      .getElementById(`${location.hash.replace("#", "")}`)
      .scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
  }
}

window.addEventListener("hashchange", toggleDetails, false);

// On load
$(document).ready(function () {
  toggleDetails();
});
