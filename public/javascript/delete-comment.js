async function deleteFormHandler(event) {
    event.preventDefault();
  
    const comment_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    const response = await fetch(`/api/comments/${comment_id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        document.location.replace('/dashboard/');
    } 
    else {
        alert(response.statusText);
    }
}
  
document.querySelector('.delete-comment-btn').addEventListener('click', deleteFormHandler);