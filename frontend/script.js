const apiUrl = 'https://rvv24kxgo7.execute-api.eu-west-2.amazonaws.com/Prod/user';

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
