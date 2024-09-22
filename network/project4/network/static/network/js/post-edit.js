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
            // Hide all other edit buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                if (btn !== editButton) {
                    btn.style.display = 'none';
                }
            });


            // Set the active post to the current one being edited
            activePostId = postId;

            // Hide the edit button, show the textarea and save button
            editButton.style.display = 'none';
            editArea.style.display = 'block';
            postContent.style.display = 'none';
            saveButton.style.display = 'block';

            // On clicking the save button
            saveButton.onclick = function() {
                const newContent = editArea.value;

                // Send the new content to the server via AJAX
                fetch(`/edit-post/${postId}/`, {
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
                        // Update the post content and reset the view
                        postContent.innerHTML = newContent;
                        editArea.style.display = 'none';
                        saveButton.style.display = 'none';
                        postContent.style.display = 'block';
                        editButton.style.display = 'block';
                        // Show all edit buttons again after saving
                        document.querySelectorAll('.edit-btn').forEach(btn => {
                            btn.style.display = 'block';
                        });

                        // Reset the active post ID after saving
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