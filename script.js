const apiUrl = 'https://luknbgfi2d.execute-api.eu-west-2.amazonaws.com/dev/user';

// CREATE
document.getElementById('user-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const github = document.getElementById('github').value;

  const requestOptions = {
    method: 'POST',
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
      // Refresh the page
      location.reload();
      
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
          data += `<p><span class="key-display">${key}</span>: <span class="value-display">${value}</span></p>`;
        }
    
        // Edit Button
        data += `<button class="edit-button" data-item-id="${item.Email}" onclick="editItem('${item.Email}')"><i class="fa-solid fa-pen"></i></button>`;
            
        // Delete Button
        data += `<button class="delete-button" data-item-id="${item.Email}"><i class="fa-sharp fa-solid fa-trash"></i></button>`;
    
        return data;
      }
    
      itemsHtml +=
        `
        <div class="item">${display(item)}</div>
        <hr>
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

// DELETE
async function deleteItem(itemId) {
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
    alert('Error deleting data');
  }
}

fetchItems();


// UPDATE
async function editItem(itemId) {
  const response = await fetch(apiUrl);
  const items = await response.json();
  // Find the item in the items array using the itemId (email)
  const item = items.find(item => item.Email === itemId);

  // Populate the form with the item's values
  document.getElementById('edit-email').value = item.Email;
  document.getElementById('edit-firstname').value = item.FirstName;
  document.getElementById('edit-lastname').value = item.LastName;
  document.getElementById('edit-github').value = item.Github;

  // Open the modal or form
  document.getElementById('edit-modal').style.display = 'block';
}

// Add an event listener for the form submission
document.getElementById('edit-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get the updated values from the form
  const updatedItem = {
    Email: document.getElementById('edit-email').value,
    FirstName: document.getElementById('edit-firstname').value,
    LastName: document.getElementById('edit-lastname').value,
    Github: document.getElementById('edit-github').value
  };

  // Send a PATCH request to the Lambda function with the updated values
  const response = await fetch(apiUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedItem)
  });

  if (response.status === 200) {
    // Refresh the page
    location.reload();
    
    alert('Successfully Patched data');
  } else {
    alert('Error Patching data');
  }
  // Close the modal 
  document.getElementById('edit-modal').style.display = 'none';
});

// Close Modal function
function closeModal() {
  document.getElementById('edit-modal').style.display = 'none';
}
