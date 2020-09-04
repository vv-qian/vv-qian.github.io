let projectContainerIDs = [];
$(".project-container").each(function () {
  projectContainerIDs.push(this.id);
});

projectContainerIDs.map((id) => {
  // On click
  $(`#${id}`).click(() => {
    history.replaceState(null, null, `${document.location.pathname}#${id}`);
  });
});
