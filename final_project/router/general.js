const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) =>
{
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password)
  {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user already exists
  if (users.find((user) => user.username === username))
  {
    return res.status(409).json({ message: "User already exists" });
  }

  // Register new user
  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered" });
});


// Get the book list available in the shop
// Get the book list available in the shop using async/await with Axios
public_users.get('/', async function (req, res)
{
  try
  {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).send(response.data);
  }
  catch (error)
  {
    return res.status(500).json({ message: "Error retrieving book list" });
  }
});

// Get book details based on ISBN
// Get book details based on ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res)
{
  const isbn = req.params.isbn;

  try
  {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  }
  catch (error)
  {
    return res.status(500).json({ message: "Error retrieving book by ISBN" });
  }
});

  
// Get book details based on author
// Get book details based on author using async/await with Axios
public_users.get('/author/:author', async function (req, res)
{
  const author = req.params.author;

  try
  {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  }
  catch (error)
  {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let result = {};

  Object.keys(books).forEach((key) =>
  {
    if (books[key].title === title)
    {
      result[key] = books[key];
    }
  });

  return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
