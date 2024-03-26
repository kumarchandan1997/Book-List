// Create Book Class
class Book {
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

// Create UI Class
/* Whenever you are creating a method inside of a class where this keyword
 * hasn't been used, it is a good case of making that method as static method.
 * this keyword doesn't work inside static method.
**/
class UI {
	// Add Book To List
	static addBookToList(book){
		// If the no book present message showing then delete it first
		if(document.getElementById('no-books')) {
			document.getElementById('no-books').remove();
		}

		const list = document.getElementById('book-list');
		// Create tr element
		const row = document.createElement('tr');
		// Insert Columns
		row.innerHTML = `
		<td>${book.title}</td>
		<td>${book.author}</td>
		<td>${book.isbn}</td>
		<td><a href="#" class="delete">X</a></td>
		`;
		// Append the created row to list
		list.appendChild(row);
	}

	// No Books to Show
	static noBooksToShow() {
		// Fetch books from local storage and if there is nothing there then show this
		const list = document.getElementById('book-list');
		// Create tr element
		const row = document.createElement('tr');
		// Insert Columns
		row.innerHTML = `
		<td id="no-books" style="text-align:center;" colspan="4">No books to show</td>
		`;
		// Append the created row to list
		list.appendChild(row);
	}

	// Delete Book
	static deleteBook(target) {
		if(target.classList.contains('delete')) {
			if(confirm('Are you sure about deleting this book?')) {
				target.parentElement.parentElement.remove();
				// Show message that the book has been deleted
				UI.showAlert('The selected book has been deleted.', 'success');
			}
		}
	}

	// Show Alert
	static showAlert(msg, className){
		// Create Alert Div
		const div = document.createElement('div');
		// Add CSS classes
		div.classList.add('alert', className);
		// Add the message
		div.appendChild(document.createTextNode(msg));
		// Insert the alert into the DOM
		// Get a parent - (Put it within)
		const container = document.querySelector('.container');
		// Get the form - (Put it before)
		const form = document.querySelector('#book-form');
		// Insert the Alert (1st Param = What we wanna insert, 2nd Param = Insert before what)
		container.insertBefore(div, form);

		// Timeout after 3 sec
		setTimeout(function () {
			document.querySelector('.alert').remove();
		}, 3000);
	}

	// Clear Form Fields
	static clearFormFields() {
		// Create an Array of the form field ids that we want to clear
		const fieldIDs = ['title', 'author', 'isbn'];
		// Run a forEach loop through the array and clear them all
		fieldIDs.forEach(function (id) {
			document.getElementById(id).value = '';
		});
	}
}

// Local Storage Class
class LocalStorage {
	// Fetch Books from Local Storage
	static getBooks() {
		let books;
		// Check if there is any data in local storage for books,
		// if so, fetch it else instantiate books variable to an empty array
		if(localStorage.getItem('books') === null || localStorage.getItem('books') === '') {
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem('books'));
		}
		return books;
	}

	// Display Books to the users
	static showBooks() {
		// Fetch the books from the local storage
		const books = LocalStorage.getBooks();
		// Loop through books if it not empty
		if(books.length > 0) {
			books.forEach(function(book) {
				// Add each book to list using the addBookToList static method of UI class
				UI.addBookToList(book);
			});
		} else {
			// call UI.noBooksToShow static method
			UI.noBooksToShow();
		}
	}

	// Add books to Local Storage
	static addBooks(book) {
		// Fetch the books from the local storage
		const books = LocalStorage.getBooks();

		// Add the newly added data to the array by PUSHing
		books.push(book);

		// Set the local storage with the newly fetched item
		localStorage.setItem('books', JSON.stringify(books));
	}

	// Remove Book from Local Storage
	static removeBooks(isbn) {
		// Fetch the Books from the Local Storage
		const books = LocalStorage.getBooks();

		// Check if there is any contents in the books then loop through it
		if(books.length > 0) {
			books.forEach(function(book, index) {
				// Check if the ISBN coming to the function is === the ISBN present, then delete it
				if( book.isbn === isbn ) {
					books.splice(index, 1);
				}
			});
			// Set the Local Storage to the updated data
			localStorage.setItem('books', JSON.stringify(books));
		} else {
			// Show error message saying that Book cannot be deleted
			UI.showAlert('Book cannot be deleted.', 'error');
		}
	}

}

// Event Listener for DOMContentLoaded to call the showBooks method
document.addEventListener('DOMContentLoaded', LocalStorage.showBooks);

// Event Listeners for Add Book
document.getElementById('book-form').addEventListener('submit', function (e) {
	// Get form field values
	const title = document.querySelector('#title').value,
		author = document.getElementById('author').value,
		isbn = document.querySelector('#isbn').value;

	// Instantiate Book object
	const book = new Book(title, author, isbn);

	// Validate the form fields
	if (title === '' || author === '' || isbn === '') {
		// Show Error Alert
		UI.showAlert('Please fill is all fields.', 'error');
	} else {
		// Add Book to list in the UI
		UI.addBookToList(book);

		// Add Books to Local Storage
		LocalStorage.addBooks(book);

		// Show Book Successfully Added Alert
		UI.showAlert('Book has successfully been added.', 'success')

		// Clear Form Fields
		UI.clearFormFields();
	}

	// Stop form default behaviors i.e. reloading the page when submitted
	e.preventDefault();
});

// Event Listener for Deleting Books
document.getElementById('book-list').addEventListener('click', function(e) {
	if (e.target.classList.contains('delete')) {
		// Call the deleteBook() static method to remove the book from UI
		UI.deleteBook(e.target);

		// Delete the book from the Local Storage by passing the unique ISBN number
		LocalStorage.removeBooks(e.target.parentElement.previousElementSibling.textContent);

		// Check if there is no more books present in the list then show the No Book Present message by calling UI.noBooksToShow()
		if( document.querySelectorAll('#book-list tr').length === 0 ) {
			UI.noBooksToShow();
		}
	}
	// Prevent Default Behavior
	e.preventDefault();
});