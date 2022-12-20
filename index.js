/* DOM Elements */
const body = document.querySelector("body");
const header = document.querySelector("header");
const main = document.querySelector("main");
const footer = document.querySelector("footer");
const booksDisplayArea = document.querySelector(".card-area");

// Menu Elements + Menu-form elements
const addBookMenu = document.querySelector(".add-book-menu");
const addBookForm = document.querySelector("form");
const addBookTitle = document.getElementById("title");
const addBookAuthor = document.getElementById("author");
const addBookPages = document.getElementById("pages");
const readBook = document.getElementById("add-read-book");
const addBookError = document.getElementById("error-wrapper");

// buttons
const addBtn = document.querySelector('.main-header ion-icon[name="add-circle"]');
const addBookMenuCloseBnt = document.getElementById("close-btn");
const addBookBtn = document.querySelector(':is([type="submit"],[value="ADD"])');

// MISC/DEBUGGIN
// const logs = document.getElementById("logs");

/* VARIABLES and OBJECTS */
let menuIsActive = false;
let cardActive = false; // if any card is actively selected

// Object that stores books each book is stored with a unique id
const library = {
  0: new Book("Harry Porter", "JK Rowling", 270, false),
};

// stores the id that the current book or book to be added holds
let currentBookId = 1;

// Object representation of a book
function Book(title, author, pages, read) {
  // Book details
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}
// shared method returning info/summary for each book
Book.prototype.info = function () {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${
    this.read ? "already read" : "not read yet"
  }`;
};

// Creates a book from given info and adds it to the book list
function addBookToLibrary(event) {
  // Prevent default behaviour (submitting to server)
  event.preventDefault();

  //   If form is not valid then disable the submit button and do not create bok
  if (!allIsValid()) {
    addBookBtn.disabled = true;
    logErrorMsg(event.currentTarget);
    return;
  }

  // create new book from form
  library[currentBookId] = new Book(
    addBookTitle.value,
    addBookAuthor.value,
    addBookPages.value,
    readBook.checked
  );
  //   increment book id
  currentBookId++;

  // Update the content display with newly added book
  updateBookDisplay();
  //   hide the add menu when done
  closeAddMenu();
}

function removeBookFromLibrary(book_id) {
  delete library[book_id];

  // update book content display
  updateBookDisplay();
}

function displayBooks() {
  // loop through the library
  for (const book_id in library) {
    const book = library[book_id];
    const bookCard = document.createElement("div");
    const bookTitle = document.createElement("h3");
    const bookSummary = document.createElement("p");
    const bookPages = document.createElement('p');
    const bookRead = document.createElement('input');
    const removeIcon = document.createElement("ion-icon");
    // assign card class to bookCard
    bookCard.classList.add("card");
    bookCard.onclick = (e) => toggleSelectCard(e);

    // add an attribute that references the index position of the book in library
    bookCard.setAttribute("book_id", `${book_id}`);
    bookTitle.textContent = book.title;
    bookTitle.classList.add('book-title');

    // add attributes to remove button
    removeIcon.setAttribute("name", "trash-outline");
    // add event listener to allow the delete icon to delete the book
    removeIcon.onclick = () => removeBookFromLibrary(book_id);

    // todo: book summary
    bookSummary.textContent = `Written by ${book.author}`
    bookSummary.classList.add('book-author');
    bookPages.textContent = `${book.pages} pages.`;
    bookPages.classList.add('book-pages');
    // todo: update book read
    bookRead.setAttribute('type', 'checkbox');
    bookRead.setAttribute('name', 'update-book-read');
    bookRead.setAttribute('id', 'update-book-read');
    bookRead.checked = book.read;
    bookRead.onclick = () => toggleBookIsRead(book_id);
  
    // add above elements to card (parent)
    bookCard.appendChild(bookTitle);
    bookCard.append(bookSummary, bookPages, bookRead);
    bookCard.append(removeIcon);
    // add card to DOM content
    booksDisplayArea.appendChild(bookCard);
  }
}

function updateBookDisplay() {
  // Clear current display before update
  clearBookDisplay();
  // display all books
  displayBooks();
}

function clearBookDisplay() {
  booksDisplayArea.innerHTML = "";
}

function toggleBookIsRead(book_id){
  library[book_id].read = !library[book_id].read;
}

function toggleSelectCard(e){
  const element = e.currentTarget;
  console.log("check");
  // unselect any selected cards
  clearAllSelected();

  // toggle selected on the now selected card
  element.classList.add('selected');

  cardActive = true;
  e.stopPropagation();
}

function clearAllSelected(){
  // unselected all cards
  Array.from(document.getElementsByClassName('selected')).forEach(card => {
    // remove selected class
    card.classList.remove('selected');
  });

  cardActive = false;
}

/* 
EVENT LISTENERS
*/
addBtn.onclick = function (e) {
  // Display the add book menu and disabled surrounding content
  addBookMenu.classList.remove("hide");
  menuIsActive = true;
  toggleSurroundingContent(false);
  // stop any other onclick even from firing after this is fired
  e.stopPropagation();
};

addBookMenuCloseBnt.onclick = function () {
  // Close add book menu
  closeAddMenu();
};
/* close add menu button when user clicks outside the add book menu
  Also unselected the selected cards if click event is not triggered
  on any card
*/
body.onclick = (e) => {
  // if no card is selected then unselect any cards
  if(cardActive && !(e.target!=booksDisplayArea && booksDisplayArea.contains(e.target))){
    clearAllSelected();
  }

  // if no menu is active then ignore the 
  if (!menuIsActive) return;
  // if current clicked target is the book menu or any of its children then ignore
  if (e.target === addBookMenu || addBookMenu.contains(e.target)) return;
  // otherwise close the add book menu
  closeAddMenu();
};

// FORM EVENT LISTENERS
addBookTitle.addEventListener("focusout", (e) => onInputChange(e.target));
addBookAuthor.addEventListener("focusout", (e) => onInputChange(e.target));
addBookPages.addEventListener("focusout", (e) => onInputChange(e.target));
addBookTitle.addEventListener("input", (e) => onInputChange(e.target));
addBookAuthor.addEventListener("input", (e) => onInputChange(e.target));
addBookPages.addEventListener("input", (e) => onInputChange(e.target));

/* 
DISABLE SURROUNDING CONTENT WHEN ADD MENU IS ACTIVE
*/
// Disable surrounding content (all content behind the add menu)
function toggleSurroundingContent(status = true) {
  // if true content is enabled, otherwise diabled
  if (status) {
    toggleDisabled(main, true);
    toggleDisabled(header, true);
    toggleDisabled(footer, true);
  } else {
    toggleDisabled(main, false);
    toggleDisabled(header, false);
    toggleDisabled(footer, false);
  }
}

// disable an element or content area
function toggleDisabled(element, status) {
  if (status) {
    //element.input.disabled = false;
    element.setAttribute("aria-disabled", "false");
  } else {
    //element.input.disabled = true;
    element.setAttribute("aria-disabled", "true");
  }
}

/* ADD-BOOK-MENU SETTINGS */
// Stores the current validity states of the form elements
let formCurrentValidity = {
  title: false,
  author: false,
  pages: false,
};

// Close Add Book Menu
function closeAddMenu() {
  // clear forms
  addBookForm.reset();
  // hide form
  addBookMenu.classList.add("hide");
  // enable surrounding content
  toggleSurroundingContent();
  // clear all error/invalid states
  clearInvalidStates();
  clearErrorMsg();
  menuIsActive = false;
  console.log("closing menu");
}

// check if all form elements are valid
const allIsValid = () =>
  Object.values(formCurrentValidity).reduce((totalValidity, bookProperty) => {
    return totalValidity && bookProperty;
  }, true);

// called when input on a form element has changed
function onInputChange(target, ) {
  // if error message is true then log the message

  //   return true if there is an error on the form
  let hasError = () => {
    let res = false;
    switch (target.id) {
      case "title":
        res = inputIsValid(target);
        formCurrentValidity.title = res;
        return !res;
        break;
      case "author":
        res = inputIsValid(target);
        formCurrentValidity.author = res;
        return !res;
        break;
      case "pages":
        res = inputIsValid(target);
        formCurrentValidity.pages = res;
        return !res;
        break;
    }
  };

  //   If we have to log the error and there is an error then log it
  if (hasError()) {
    logErrorMsg(target, true);
    toggleInvalid(target, true);
  } else {
    logErrorMsg(target);
    toggleInvalid(target, false);
  }

  /* Check if all inputfields are valid  
    enable submit button is condition satsfied otherwise disable*/
  if (allIsValid()) addBookBtn.disabled = false;
  else addBookBtn.disabled = true;
}

// return true if form element is valid
function inputIsValid(element) {
  //   if (element.id === "pages")
  return element.value.length > 0 && element.validity.valid;
}

// Logs the errorMessage if its an error otherwise clear current msg if related to given target
function logErrorMsg(target, isError) {
  if (isError) {
    addBookError.textContent = target.getAttribute("aria-errormessage");
  } else {
    // If current logged error is being redacted then clear the error log
    if (target.getAttribute("aria-errormessage") == addBookError.textContent) {
      clearErrorMsg();
    }
  }
}

// Clears the message output in the form
function clearErrorMsg() {
  addBookError.textContent = "";
}

function toggleInvalid(target, status = true){
  target.setAttribute("aria-invalid", status);
}

// Clears the error/invalid state of all form elements
function clearInvalidStates() {
  [...addBookForm.children].forEach((element) =>
    element.removeAttribute("aria-invalid")
  );
}

document.onload = displayBooks();
