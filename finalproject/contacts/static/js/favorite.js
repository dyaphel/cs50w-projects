document.addEventListener("DOMContentLoaded", function () {
   
    document.querySelectorAll("#FavoriteButtonContact, #FavoriteButtonGroup").forEach(button => {
        button.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevent the click from triggering other events
            const profileWrapper = button.closest(".profile-wrapper");
            const img = button.querySelector("img");
            const isFavorite = img.getAttribute("data-favorite") === "true";

        
            if (isFavorite) {
                img.setAttribute("data-favorite", "false");
                img.src = img.getAttribute("data-white-src");
            } else {
                img.setAttribute("data-favorite", "true");
                img.src = img.getAttribute("data-red-src");
            }

            // Remove the element from the DOM
            profileWrapper.remove();
        });
    });    
});
