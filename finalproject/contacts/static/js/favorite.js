document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("#FavoriteButton").forEach(button => {
        button.addEventListener("click", function (event) {
            event.stopPropagation();
            const contactWrapper = button.closest(".profile-wrapper");
            const img = button.querySelector("img");
            const isFavorite = img.getAttribute("data-favorite") === "true";

            if (isFavorite) {
                img.setAttribute("data-favorite", "false");
                img.src = img.getAttribute("data-white-src");
                contactWrapper.remove();
            } else {
                img.setAttribute("data-favorite", "true");
                img.src = img.getAttribute("data-red-src");
            }
        });
    });
});
