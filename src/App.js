import React, {
    Component
} from 'react';
import {
    Route
} from 'react-router-dom';
import * as BooksAPI from './utils/BooksAPI';
import ListBooks from './components/list/List';
import SearchBooks from './components/search/Search';
import './App.css';

//BookApp react component class
class BooksApp extends Component {
    state = {
        books: [],
        showSearchPage: false
    }
    //DOM Initialization
    componentDidMount() {
        BooksAPI.getAll().then(filtered =>
            this.setState({
                books: filtered
            })
        );
    }
    //update the shelf
    updateBook = (book, shelf) => {
        this.setState(previousState => {
            if (shelf === 'none') {
                return {
                    books: previousState.books.filter(
                        currentBook => currentBook.id !== book.id
                    )
                };
            }
            return {
                books: previousState.books.map(currentBook => {
                    if (currentBook.id === book.id) {
                        currentBook.shelf = shelf;
                    }
                    return currentBook;
                })
            };
        });
    };
    //add book to the shelf
    addBook = (book, shelf) => {
        this.setState(previousState => {
            book.shelf = shelf;
            previousState.books.push(book);
            return {
                books: previousState.books
            };
        });
    };
    //check new book or not
    checkIsNewBook = book => {
        const shelfBooks = this.state.books.filter(
            shelfBook => shelfBook.id === book.id
        );
        return shelfBooks.length === 0;
    };
    //change shelf
    changeShelfOfBook = (book, shelf) => {
        if (this.checkIsNewBook(book)) {
            this.addBook(book, shelf);
        } else {
            this.updateBook(book, shelf);
        }

        BooksAPI.update(book, shelf);
    };

    //update Search status
    updateSearchStatus = showSearchPage => {
        this.setState({
            showSearchPage: true
        });
    }
    //starting render
    render() {
            return ( <
                div className = "app" >
                <
                Route exact path = "/"
                render = {
                    () =>
                    <
                    ListBooks
                    books = {
                        this.state.books
                    }
                    updateBook = {
                        this.changeShelfOfBook
                    }
                    />} / >
                    <
                    Route
                    path = "/search"
                    render = {
                        () =>
                        <
                        SearchBooks
                        books = {
                            this.state.books
                        }
                        updateBook = {
                            this.changeShelfOfBook
                        }
                        showSearchPage = {
                            this.updateSearchStatus
                        }
                        />} / >
                        <
                        /div>
                    );
                }
            }
            export default BooksApp
