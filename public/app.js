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
        alert("User added! You can now add books.");
    });

    // Add Book Button Click Event
    $('#addBookButton').click(function () {
        if (!user.name) {
            alert("Please add a user first!");
            return;
        }

        const bookTitle = prompt("Enter book title:");
        const author = prompt("Enter author name:");
        const genre = prompt("Enter genre:");
        const yop = prompt("Enter year of publication:");
        const isbn = prompt("Enter ISBN:");

        // Validate book input
        if (!bookTitle || !author || !genre || !yop || !isbn) {
            alert("All fields are required!");
            return;
        }

        bookCount++;
        const bookRow = `<tr>
            <td>${bookCount}</td>
            <td>${bookTitle}</td>
            <td>${author}</td>
            <td>${genre}</td>
            <td>${yop}</td>
            <td>${isbn}</td>
            <td>
                <button class="edit">Edit</button>
                <button class="remove">Remove</button>
            </td>
        </tr>`;

        $('#bookTable tbody').append(bookRow);

        // Store book info in user object
        user.books.push({
            sno: bookCount,
            booktitle: bookTitle,
            author: author,
            genre: genre,
            yop: yop,
            isbn: isbn
        });
    });

    // Delegate click events for Edit and Remove buttons
    $('#bookTable').on('click', '.remove', function () {
        const row = $(this).closest('tr');
        const sno = row.find('td').eq(0).text();
        user.books = user.books.filter(book => book.sno !== parseInt(sno)); // Remove from user object
        row.remove();
        alert("Book removed!");
    });

    $('#bookTable').on('click', '.edit', function () {
        const row = $(this).closest('tr');
        const sno = row.find('td').eq(0).text();
        const book = user.books.find(book => book.sno === parseInt(sno));

        // Prompt for new values
        const updatedTitle = prompt("Edit book title:", book.booktitle) || book.booktitle;
        const updatedAuthor = prompt("Edit author name:", book.author) || book.author;
        const updatedGenre = prompt("Edit genre:", book.genre) || book.genre;
        const updatedYop = prompt("Edit year of publication:", book.yop) || book.yop;
        const updatedIsbn = prompt("Edit ISBN:", book.isbn) || book.isbn;

        // Update book in the user object
        book.booktitle = updatedTitle;
        book.author = updatedAuthor;
        book.genre = updatedGenre;
        book.yop = updatedYop;
        book.isbn = updatedIsbn;

        // Update the row in the table
        row.find('td').eq(1).text(updatedTitle);
        row.find('td').eq(2).text(updatedAuthor);
        row.find('td').eq(3).text(updatedGenre);
        row.find('td').eq(4).text(updatedYop);
        row.find('td').eq(5).text(updatedIsbn);

        alert("Book details updated!");
    });

    // Dump State Button Click Event
    $('#dumpStateButton').click(function () {
        console.log(JSON.stringify(user, null, 2)); // Dump user state in JSON format
        alert("State dumped to console.");
    });
});
