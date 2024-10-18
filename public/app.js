$(document).ready(function () {
    let bookCount = 0; // To keep track of book serial numbers
    let user = {};

    // Collapsible functionality for book details
    $('.collapsible').click(function () {
        $(this).next('.content').slideToggle();
    });

    // Add User Button Click Event
    $('#addUserButton').click(function () {
        const name = $('#userName').val();
        const phone = $('#userPhone').val();
        const email = $('#userEmail').val();

        // Validate user input
        if (!name || !phone || !email) {
            alert("All fields are required!");
            return;
        }

        // Store user info
        user = {
            name: name,
            phone: phone,
            email: email,
            books: []
        };

        // Clear user input fields
        $('#userName').val('');
        $('#userPhone').val('');
        $('#userEmail').val('');

        // Send user data to server
        $.ajax({
            url: '/api/users',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(user),
            success: function (response) {
                alert("User added successfully!");
                user._id = response._id; // Update user object with the returned ID
                console.log("User ID after creation:", user._id);
            },
            error: function (error) {
                console.error("AJAX Error:", error);
                alert("Error adding user: " + (error.responseJSON?.error || "An unknown error occurred."));
            }
        });
    });

    // Add Book Button Click Event
    $('#addBookButton').click(function () {
        if (!user._id) {
            alert("Please add a user first!");
            return;
        }

        const bookTitle = prompt("Enter book title:");
        const author = prompt("Enter author name:");
        const genre = prompt("Enter genre:");
        const yopInput = prompt("Enter year of publication (YYYY-MM-DD):");
        const isbn = prompt("Enter ISBN:");

        // Validate book input
        if (!bookTitle || !author || !genre || !yopInput || !isbn) {
            alert("All fields are required!");
            return;
        }

        // Convert year of publication to Date
        const yop = new Date(yopInput);
        if (isNaN(yop.getTime())) {
            alert("Invalid date format. Please use YYYY-MM-DD.");
            return;
        }

        // Create a book object to be sent to the server
        const newBook = {
            sno: ++bookCount,
            booktitle: bookTitle,
            author: author,
            genre: genre,
            yop: yop.toISOString(), // Store as ISO string for consistency
            isbn: isbn
        };

        // Append book to the table
        appendBookToTable(newBook);
        user.books.push(newBook); // Update user object with the new book

        // Update the user on the server
        updateUserOnServer(user);
    });

    // Function to append book to the table
    function appendBookToTable(book) {
        const bookRow = `<tr>
            <td>${book.sno}</td>
            <td>${book.booktitle}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${new Date(book.yop).toISOString().split('T')[0]}</td>
            <td>${book.isbn}</td>
            <td>
                <button class="edit"><i class="fas fa-edit"></i></button>
                <button class="remove"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`;

        $('#bookTable tbody').append(bookRow);
    }

  // Remove Book Button Click Event
$('#bookTable').on('click', '.remove', function () {
    const row = $(this).closest('tr');
    const bookIndex = row.index(); // Get the index of the book to delete

    // Confirm deletion
    if (confirm("Are you sure you want to delete this book?")) {
        // Get the book ID for the deletion request
        const bookId = user.books[bookIndex]._id; // Assuming each book has an _id field

        // Remove from user object
        user.books.splice(bookIndex, 1); // Remove book from local user object
        row.remove(); // Remove the row from the table
        alert("Book removed!");

        // Send delete request to the server
        $.ajax({
            url: `/api/users/${user._id}/books/${bookId}`, 
            method: 'DELETE',
            success: function () {
                console.log("Book successfully deleted from database.");
                
                // Reassign serial numbers after deletion
                reassignSerialNumbers();

                // Update the user on the server
                updateUserOnServer(user); // Update user with new book list
            },
            error: function (error) {
                console.error("Error deleting book:", error);
                alert("Error deleting book: " + (error.responseJSON?.error || "An unknown error occurred."));
            }
        });
    }
});

// Function to reassign serial numbers
function reassignSerialNumbers() {
    user.books.forEach((book, index) => {
        book.sno = index + 1; // Reassign sno based on the index
    });
}

// Function to update user on the server
function updateUserOnServer(user) {
    $.ajax({
        url: `/api/users/${user._id}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(user),
        success: function () {
            console.log("User updated with changes.");
            refreshBookTable(); // Refresh the table to reflect any changes
        },
        error: function (error) {
            console.error("AJAX Error:", error);
            alert("Error updating user: " + (error.responseJSON?.error || "An unknown error occurred."));
        }
    });
}

// Function to refresh the book table
function refreshBookTable() {
    $('#bookTable tbody').empty(); // Clear the current table
    user.books.forEach((book) => {
        const bookRow = `<tr>
            <td>${book.sno}</td> <!-- Use existing sno -->
            <td>${book.booktitle}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${new Date(book.yop).toISOString().split('T')[0]}</td>
            <td>${book.isbn}</td>
            <td>
                <button class="edit"><i class="fas fa-edit"></i></button>
                <button class="remove"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`;
        $('#bookTable tbody').append(bookRow);
    });
}


    // Edit Book Button Click Event
    $('#bookTable').on('click', '.edit', function () {
        const row = $(this).closest('tr');
        const sno = row.find('td').eq(0).text(); // Get the serial number of the book
        const book = user.books.find(book => book.sno === parseInt(sno)); // Find the book in the user object

        // Prompt for new values
        const updatedTitle = prompt("Edit book title:", book.booktitle) || book.booktitle;
        const updatedAuthor = prompt("Edit author name:", book.author) || book.author;
        const updatedGenre = prompt("Edit genre:", book.genre) || book.genre;
        const updatedYopInput = prompt("Edit year of publication (YYYY-MM-DD):", new Date(book.yop).toISOString().split('T')[0]) || new Date(book.yop).toISOString().split('T')[0];
        const updatedIsbn = prompt("Edit ISBN:", book.isbn) || book.isbn;

        const updatedYop = new Date(updatedYopInput);
        if (isNaN(updatedYop.getTime())) {
            alert("Invalid date format. Please use YYYY-MM-DD.");
            return;
        }

        // Update book in the user object
        Object.assign(book, {
            booktitle: updatedTitle,
            author: updatedAuthor,
            genre: updatedGenre,
            yop: updatedYop.toISOString(), // Store as ISO string
            isbn: updatedIsbn
        });

        // Update the row in the table
        updateBookRow(row, book);
        alert("Book details updated!");

        // Update the user on the server
        updateUserOnServer(user);
    });

    // Function to update the row in the table
    function updateBookRow(row, book) {
        row.find('td').eq(1).text(book.booktitle);
        row.find('td').eq(2).text(book.author);
        row.find('td').eq(3).text(book.genre);
        row.find('td').eq(4).text(new Date(book.yop).toISOString().split('T')[0]); // Format for display
        row.find('td').eq(5).text(book.isbn);
    }

   

    

    // Dump State Button Click Event
    $('#dumpStateButton').click(function () {
        console.log(JSON.stringify(user, null, 2)); // Dump user state in JSON format
        alert("State dumped to console.");
    });

    // Check State Button Click Event
    $('#checkStateButton').click(function () {
        $.ajax({
            url: `/api/users/${user._id}`,
            method: 'GET',
            success: function (response) {
                console.log("Current user state:", JSON.stringify(response, null, 2));
                alert("Current state logged to console.");
            },
            error: function (error) {
                console.error("Error fetching user state:", error);
                alert("Error fetching user state: " + (error.responseJSON?.error || "An unknown error occurred."));
            }
        });
    });
});
