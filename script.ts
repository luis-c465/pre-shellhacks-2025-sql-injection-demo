const form = document.querySelector<HTMLFormElement>('#myForm')
const outputDiv = document.querySelector('#output')

if (form && outputDiv) {
  console.log(form)
  form.addEventListener('submit', function (event) {
    event.preventDefault()

    const formData = new FormData(form)
    const username = formData.get('username')
    const password = formData.get('password')

    fetch(form.action, {
      method: form.method,
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json() // Assuming the server responds with JSON
      })
      .then((data) => {
        // Handle the data from the server
        outputDiv.textContent = JSON.stringify(data, null, 2)
        console.log('Success:', data)
      })
      .catch((error) => {
        // Handle any errors
        outputDiv.textContent = `Error: ${error.message}`
        console.error('Error:', error)
      })
  })
}
