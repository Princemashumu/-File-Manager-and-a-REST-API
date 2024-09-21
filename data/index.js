const http = require('http');
const fs = require('fs');
const path = require('path');

// Directory and file paths
const dataDir = path.join(__dirname, 'data');
const shoppingListFile = path.join(dataDir, 'shopping-list.json');

// Ensure the data directory and JSON file exist
const initializeFileManager = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
    console.log(`Directory created: ${dataDir}`);
  }

  if (!fs.existsSync(shoppingListFile)) {
    fs.writeFileSync(shoppingListFile, JSON.stringify([]));
    console.log(`File created: ${shoppingListFile}`);
  }
};

// Read and parse JSON data from file
const readShoppingList = () => {
  try {
    const data = fs.readFileSync(shoppingListFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading shopping list file:', error);
    return [];
  }
};

// Write new data to JSON file
const writeShoppingList = (data) => {
  try {
    fs.writeFileSync(shoppingListFile, JSON.stringify(data, null, 2));
    console.log('Shopping list updated.');
  } catch (error) {
    console.error('Error writing to shopping list file:', error);
  }
};

// Initialize the file manager
initializeFileManager();

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/shopping-list') && req.method === 'GET') {
    // GET /shopping-list - Retrieve all items
    try {
      const shoppingList = readShoppingList();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(shoppingList));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Error retrieving shopping list' }));
    }

  } else if (req.url.startsWith('/shopping-list') && req.method === 'POST') {
    // POST /shopping-list - Add a new item
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const newItem = JSON.parse(body);
        if (!newItem.name || typeof newItem.name !== 'string' || newItem.name.trim() === '') {
          throw new Error('Invalid name field');
        }
        if (typeof newItem.quantity !== 'number' || newItem.quantity <= 0) {
          throw new Error('Invalid quantity field');
        }

        const shoppingList = readShoppingList();
        newItem.id = shoppingList.length ? shoppingList[shoppingList.length - 1].id + 1 : 1;
        shoppingList.push(newItem);
        writeShoppingList(shoppingList);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newItem));

      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
      }
    });

  } else if (req.url.match(/\/shopping-list\/\d+/) && req.method === 'PUT') {
    // PUT /shopping-list/:id - Update an existing item
    const id = parseInt(req.url.split('/')[2]);
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const updatedItem = JSON.parse(body);
        if (!updatedItem.name || typeof updatedItem.name !== 'string' || updatedItem.name.trim() === '') {
          throw new Error('Invalid name field');
        }
        if (typeof updatedItem.quantity !== 'number' || updatedItem.quantity <= 0) {
          throw new Error('Invalid quantity field');
        }

        const shoppingList = readShoppingList();
        const index = shoppingList.findIndex(item => item.id === id);
        if (index !== -1) {
          shoppingList[index] = { ...shoppingList[index], ...updatedItem };
          writeShoppingList(shoppingList);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(shoppingList[index]));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Item not found' }));
        }

      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
      }
    });

  } else if (req.url.match(/\/shopping-list\/\d+/) && req.method === 'DELETE') {
    // DELETE /shopping-list/:id - Delete an item
    const id = parseInt(req.url.split('/')[2]);
    const shoppingList = readShoppingList();
    const filteredList = shoppingList.filter(item => item.id !== id);
    if (shoppingList.length !== filteredList.length) {
      writeShoppingList(filteredList);
      res.writeHead(204);
      res.end();
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Item not found' }));
    }

  } else {
    // Handle unknown routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



