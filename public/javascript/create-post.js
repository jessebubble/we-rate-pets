async function newFormHandler(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="post-title"]').value;
    const image_url = document.querySelector('input[name="image_url"]').value;
    const post_body = document.querySelector('input[name="post-body"]').value;
  
    const response = await fetch(`/api/posts`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            image_url,
            post_body
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
  
    if (response.ok) {
        document.location.replace('/dashboard');
    } 
    else {
        alert(response.statusText);
    }
}
  
document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);