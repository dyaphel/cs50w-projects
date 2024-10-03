document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.like-btn').forEach(button => {
        button.onclick = function() {
            const postId = this.dataset.postId;
            const likeIcon = document.getElementById(`like-icon-${postId}`);
            const likeCountElement = document.getElementById(`like-count-${postId}`);
            fetch(`/like/${postId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                },
            })
            .then(response => response.json())
            .then(data => {
                const liked = data.liked;  
                const likeCount = data.likes;

                if (liked) {
                    likeIcon.src = "../../static/network/icon/arrow-heart-red.svg";
                } else {
                    likeIcon.src = "../../static/network/icon/arrow-heart.svg";
                }
                likeCountElement.textContent = likeCount;
            })
            .catch(error => console.error('Error:', error));
        };
    });
});