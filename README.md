# User Management and Book Catalog Application

## Overview
This web application allows users to manage their personal information (name, phone number, and email address) and maintain a catalog of books. The app includes features for adding, editing, and deleting records, ensuring a seamless user experience with responsive design.

## Features
- **User Input Validation**: Ensures valid entries for name, phone number, and email address with error handling.
- **Editable Rows**: Clickable buttons allow users to edit or delete records directly within the table.
- **JSON State Dump**: At any time, users can export the current state of the application in JSON format, capturing user details and their associated book records.
- **Responsive Design**: The user interface is designed to be pleasing and functional on various devices.


## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ghoshnirupom/Donate-A-Book.git
   cd Donate-A-Book

2. Install dependencies: npm install
3. Start the application : npm start

Usage
Enter your name, phone number, and email in the respective fields.
Click the "+" button to add a new record.
Use the "edit" button to make existing rows editable, and the "delete" button to remove records.
Click on the state dump button to view the current state in JSON format.
JSON Format
The exported JSON format includes:

{
  "name": "Name entered by user",
  "phone": "Phone number entered by user",
  "email": "email address entered by user",
  "books": [
    {
      "sno": "auto increment number",
      "booktitle": "Book title entered by user",
      "author": "Author name entered by user",
      "genre": "Genre entered by user",
      "yop": "Year of publishing entered by user",
      "isbn": "ISBN number entered by user"
    }
    // Additional book entries...
  ]
}

Contributing
Contributions are welcome! Please fork the repository and create a pull request for any enhancements or bug fixes.

License
This project is licensed under the MIT License.

Acknowledgments
React for the front-end framework.
Bootstrap for responsive design components.
