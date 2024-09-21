# Shopping List Manager & File Manager API
### Overview
This Node.js application serves as both a basic File Manager and a REST API for managing a shopping list. It leverages Node.js' file system capabilities to store shopping list data in JSON format and exposes CRUD operations via HTTP endpoints. The application ensures data management through a JSON file, enabling users to add, update, delete, and retrieve shopping list items.

# Features
### File Manager

- [ ] Create a new directory: Initializes a directory to store the shopping list data.
- [ ] Create a JSON file: Generates a shopping-list.json file within the directory to hold shopping list items.
- [ ] Read and parse the JSON file: Reads and parses the JSON data for easy manipulation.
- [ ] Update the JSON file: Saves new or updated shopping list items to the file.
- [ ] Shopping List API
- [ ] CRUD Operations: Supports creating, reading, updating, and deleting shopping list items using HTTP methods.
- [ ] GET /shopping-list: Retrieve all shopping list items.
- [ ] POST /shopping-list: Add a new item to the shopping list.
- [ ] PUT /shopping-list/:id: Update an existing item in the shopping list.
- [ ] DELETE /shopping-list/:id: Remove an item from the shopping list.
- [ ] Error Handling and Validation: Ensures that data is validated before storage and handles errors gracefully.
- [ ] Requirements
- [ ] Node.js (v12+)
- [ ] Postman or a similar tool for API testing

### Installation
Clone the repository:

bash
Copy code
```
git clone https://github.com/princemashumu/File-Manager-and-a-REST-API.git
cd File-Manager-and-a-REST-API
```
Install the necessary dependencies:

bash
Copy code
```
npm install
Start the server:
```
bash
Copy code
node app.js
The server will be running on http://localhost:3000.

### Endpoints

- [ ] GET /shopping-list

### Description: Retrieve all items from the shopping list.
Response:
200 OK: Returns an array of shopping list items.
500 Internal Server Error: If an error occurs while reading the file.


- [ ] POST /shopping-list

### Description: Add a new item to the shopping list.
Request Body:
json
Copy code
```
{
  "name": "Item Name",
  "quantity": 1
}
```
### Response:
201 Created: Returns the newly created item.
400 Bad Request: If the request body is missing name or quantity fields or if they are invalid.

- [ ] PUT /shopping-list/:id

### Description: Update an existing item in the shopping list.
Request Body:
json
```
Copy code
{
  "name": "Updated Item Name",
  "quantity": 2
}
```
Response:
200 OK: Returns the updated item.
400 Bad Request: If the request body is invalid.
404 Not Found: If the item with the specified id does not exist.

- [ ] DELETE /shopping-list/:id

### Description: Delete an item from the shopping list.
Response:
204 No Content: If the item is successfully deleted.
404 Not Found: If the item with the specified id does not exist.

### Error Handling & Validation

- [ ] Validates that the name field is a non-empty string.
- [ ] Validates that the quantity field is a positive number.
- [ ] Returns appropriate HTTP status codes and error messages for invalid data or failed operations.

### Testing

- [ ] Use Postman or a similar tool to test each endpoint for the CRUD operations.
- [ ] Verify that the file operations (read, write, update) are functioning correctly by checking the shopping-list.json file in the data directory.

### Future Enhancements

- [ ] Implement user authentication for secure access to the API.
- [ ] Add a front-end interface for managing the shopping list.
- [ ] Store shopping list data in a database instead of a JSON file for scalability.


### Contact
For any questions or support, please contact princemashumu@yahoo.com.
