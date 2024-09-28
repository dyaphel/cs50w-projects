document.addEventListener('DOMContentLoaded', function() {
    let activePostId = null;  // Keep track of the currently edited post

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.onclick = function() {
            const postId = this.dataset.postId;
            const postContent = document.getElementById(`post-content-${postId}`);
            const editArea = document.getElementById(`edit-post-${postId}`);
            const editButton = this;
            const saveButton = document.getElementById(`save-btn-${postId}`);

            if (activePostId && activePostId !== postId) {
                alert("You can only edit one post at a time.");
                return;
            }
            document.querySelectorAll('.edit-btn').forEach(btn => {
                if (btn !== editButton) {
                    btn.style.display = 'none';
                }
            });

            // Set the active post to the current one being edited
            activePostId = postId;
            editButton.style.display = 'none';
            editArea.style.display = 'block';
            postContent.style.display = 'none';
            saveButton.style.display = 'block';
            saveButton.onclick = function() {
                const newContent = editArea.value;

                fetch(`/edit/${postId}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                    },
                    body: JSON.stringify({
                        body: newContent
                    })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        postContent.innerHTML = newContent;
                        editArea.style.display = 'none';
                        saveButton.style.display = 'none';
                        postContent.style.display = 'block';
                        editButton.style.display = 'block';
                        document.querySelectorAll('.edit-btn').forEach(btn => {
                            btn.style.display = 'block';
                        });
                        activePostId = null;

                    } else {
                        console.error("Failed to update post.");
                    }
                })
                .catch(error => console.error('Error:', error));
            };
        };
    });
});