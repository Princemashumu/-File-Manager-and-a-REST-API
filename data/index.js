const http = require('http'); // Import HTTP module to create a server
const fs = require('fs'); // Import File System module to handle file operations
const path = require('path'); // Import Path module to manage file paths

// Define directory and file paths
const dataDir = path.join(__dirname, 'data'); // Directory for storing data files
const shoppingListFile = path.join(dataDir, 'shopping-list.json'); // Path to the shopping list JSON file

// Function to initialize the data directory and JSON file if they don't exist
const initializeFileManager = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir); // Create directory if it doesn't exist
    console.log(`Directory created: ${dataDir}`);
  }

  if (!fs.existsSync(shoppingListFile)) {
    fs.writeFileSync(shoppingListFile, JSON.stringify([])); // Create an empty JSON file
    console.log(`File created: ${shoppingListFile}`);
  }
};

// Function to read and parse JSON data from the file
const readShoppingList = () => {
  try {
    const data = fs.readFileSync(shoppingListFile, 'utf8'); // Read file contents
    return JSON.parse(data); // Parse JSON data
  } catch (error) {
    console.error('Error reading shopping list file:', error);
    return []; // Return an empty array if an error occurs
  }
};

// Function to write new data to the JSON file
const writeShoppingList = (data) => {
  try {
    fs.writeFileSync(shoppingListFile, JSON.stringify(data, null, 2)); // Write data with formatting
    console.log('Shopping list updated.');
  } catch (error) {
    console.error('Error writing to shopping list file:', error);
  }
};

// Initialize the file manager to ensure required files exist
initializeFileManager();

// Create an HTTP server
const server = http.createServer((req, res) => {
  if (req.url.startsWith('/shopping-list') && req.method === 'GET') {
    // GET /shopping-list - Retrieve all shopping list items
    try {
      const shoppingList = readShoppingList();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(shoppingList));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Error retrieving shopping list' }));
    }
  } else if (req.url.startsWith('/shopping-list') && req.method === 'POST') {
    // POST /shopping-list - Add a new item to the shopping list
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // Accumulate request body data
    });
    req.on('end', () => {
      try {
        const newItem = JSON.parse(body); // Parse received data
        
        // Validate input fields
        if (!newItem.name || typeof newItem.name !== 'string' || newItem.name.trim() === '') {
          throw new Error('Invalid name field');
        }
        if (typeof newItem.quantity !== 'number' || newItem.quantity <= 0) {
          throw new Error('Invalid quantity field');
        }

        const shoppingList = readShoppingList();
        newItem.id = shoppingList.length ? shoppingList[shoppingList.length - 1].id + 1 : 1; // Assign a new ID
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
    // PUT /shopping-list/:id - Update an existing item in the shopping list
    const id = parseInt(req.url.split('/')[2]); // Extract item ID from URL
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // Accumulate request body data
    });
    req.on('end', () => {
      try {
        const updatedItem = JSON.parse(body); // Parse received data
        
        // Validate input fields
        if (!updatedItem.name || typeof updatedItem.name !== 'string' || updatedItem.name.trim() === '') {
          throw new Error('Invalid name field');
        }
        if (typeof updatedItem.quantity !== 'number' || updatedItem.quantity <= 0) {
          throw new Error('Invalid quantity field');
        }

        const shoppingList = readShoppingList();
        const index = shoppingList.findIndex(item => item.id === id);
        if (index !== -1) {
          shoppingList[index] = { ...shoppingList[index], ...updatedItem }; // Update item
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
    // DELETE /shopping-list/:id - Remove an item from the shopping list
    const id = parseInt(req.url.split('/')[2]); // Extract item ID from URL
    const shoppingList = readShoppingList();
    const filteredList = shoppingList.filter(item => item.id !== id); // Remove item
    if (shoppingList.length !== filteredList.length) {
      writeShoppingList(filteredList);
      res.writeHead(204); // No Content response
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

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
