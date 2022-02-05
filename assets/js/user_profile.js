function changeVisibility() {

    let objs = document.querySelectorAll("#user-profile-container input");
    objs.forEach(obj => {
        obj.toggleAttribute("disabled");
    });
}

changeVisibility();