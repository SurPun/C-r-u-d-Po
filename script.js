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

        // Delete Button
        data += `<button class="delete-button" data-item-id="${item.Email}">Delete</button>`;

        return data;
      }

      itemsHtml +=
        `
        <hr>
        <div class="item">${display(item)}</div>
        `;
    });

    document.getElementById('items').innerHTML = itemsHtml;

    // Event listeners for Delete Button
    const deleteButtons = document.getElementsByClassName('delete-button');
    for (const button of deleteButtons) {
      button.addEventListener('click', async function() {
        const itemId = this.getAttribute('data-item-id');

        // Delete Item
        await deleteItem(itemId);

        // Remove item from the DOM
        this.closest('.item').remove();
      });
    }

  } catch (error) {
    console.error('Error fetching items:', error);
  }
}

async function deleteItem(itemId) {
  // HTTP Method
  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Email: itemId,
    }),
  };

  try {
    const response = await fetch(apiUrl, requestOptions);
    const data = await response.json();
    console.log(data);

    if (response.status === 200) {
      alert('Successfully deleted data');
    } else {
      alert('Error deleting data');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Server Error');
  }
}

fetchItems();

// UPDATE
