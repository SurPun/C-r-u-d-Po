const apiUrl = 'https://rvv24kxgo7.execute-api.eu-west-2.amazonaws.com/Prod/user';

async function fetchItems() {
  try {
    const response = await fetch(apiUrl);
    const items = await response.json();
    let itemsHtml = '';

    items.forEach((item) => {
      itemsHtml += 
        `<p>
            Email: ${item.UserId}<br>
            Name: ${item.FirstName} ${item.LastName}
        </p>

        <p>${item}</p>
        `;
    });

    document.getElementById('items').innerHTML = itemsHtml;
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}

fetchItems();
