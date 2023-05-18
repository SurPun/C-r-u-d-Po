const apiUrl = 'https://91mzwuihk7.execute-api.eu-west-2.amazonaws.com/dev/user';

// CREATE
document.getElementById('user-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const github = document.getElementById('github').value;

  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Email: email,
      FirstName: firstName,
      LastName: lastName,
      GitHub: github,
    }),
  };

  try {
    const response = await fetch(apiUrl, requestOptions);
    const data = await response.json();
    console.log(data);

    if (response.status === 200) {
      alert('Successfully submitted data');
    } else {
      alert('Error submitting data');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error submitting data');
  }
});


// READ 
async function fetchItems() {
  try {
    const response = await fetch(apiUrl);
    const items = await response.json();
    let itemsHtml = '';

    items.forEach((item) => {

        function display(item) {
            let data = '';
        
            for (const [key, value] of Object.entries(item)) {
                data += `<p>${key}: ${value}</p>`;
            }
        
            return data;
        }

      itemsHtml += 
        `
        <hr>
        <p>${display(item)}</p>
        `;

    });

    document.getElementById('items').innerHTML = itemsHtml;
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}

fetchItems();

// UPDATE

// DELETE