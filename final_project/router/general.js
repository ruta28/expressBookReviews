const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// REGISTER — Task 6
public_users.post("/register", (req, res) =>
{
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password)
  {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.find((user) => user.username === username))
  {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});


// =======================
// TASK 10 — Get all books (Async / Axios)
// =======================
public_users.get('/', async (req, res) =>
{
  try
  {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  }
  catch (error)
  {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});


// =======================
// TASK 11 — Get book by ISBN (Async / Axios)
// =======================
public_users.get('/isbn/:isbn', async (req, res) =>
{
  const isbn = req.params.isbn;

  try
  {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

    if (!response.data)
    {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(response.data);
  }
  catch (error)
  {
    return res.status(500).json({ message: "Error retrieving book by ISBN" });
  }
});


// =======================
// TASK 12 — Get books by Author (Async / Axios)
// =======================
public_users.get('/author/:author', async (req, res) =>
{
  const author = req.params.author;

  try
  {
    const response = await axios.get(`http://localhost:5000/author/${author}`);

    if (Object.keys(response.data).length === 0)
    {
      return res.status(404).json({ message: "No books found for this author" });
    }

    return res.status(200).json(response.data);
  }
  catch (error)
  {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});


// =======================
// TASK 13 — Get books by Title (Async / Axios)
// =======================
public_users.get('/title/:title', async (req, res) =>
{
  const title = req.params.title;

  try
  {
    const response = await axios.get(`http://localhost:5000/title/${title}`);

    if (Object.keys(response.data).length === 0)
    {
      return res.status(404).json({ message: "No books found with this title" });
    }

    return res.status(200).json(response.data);
  }
  catch (error)
  {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});


// GET BOOK REVIEW — Task 5
public_users.get('/review/:isbn', (req, res) =>
{
  const isbn = req.params.isbn;

  if (!books[isbn])
  {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
