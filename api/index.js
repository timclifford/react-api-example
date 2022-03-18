const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Add mariadb database connection
const db = mysql.createPool({
  host: process.env.MARIADB_HOST,
  user: process.env.MARIADB_USER, 
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE
})

// Enable cors security headers
app.use(cors())
// add an express method to parse the POST method
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// get all of the reviews in the database
app.get('/api/get', (req, res) => {
  const SelectQuery = "SELECT * FROM lagoon_reviews";
  db.query(SelectQuery, (err, result) => {
    if (err) console.log("Error: ", err);
    // console.log("Reviews: ", result);
    res.send(result)
  })
})

// add a review to the database
app.post("/api/insert", (req, res) => {
  const name = req.body.setName;
  const company = req.body.setCompany;
  const review = req.body.setReview;
  const InsertQuery = "INSERT INTO lagoon_reviews (name, company, review) VALUES (?, ?, ?)";
  db.query(InsertQuery, [name, company, review], (err, result) => {
    if (err) console.log("Error insert: ", err);
    console.log(result)
  })
})

// delete a review from the database
app.delete("/api/delete/:reviewId", (req, res) => {
  const id = req.params.reviewId;
  const DeleteQuery = "DELETE FROM lagoon_reviews WHERE id = ?";
  db.query(DeleteQuery, id, (err, result) => {
    if (err) console.log("Error delete: ", err);
    console.log(result);
  })
})

// update a review
app.put("/api/update/:reviewId", (req, res) => {
  const reviewUpdate = req.body.reviewUpdate;
  const id = req.params.reviewId;
  const UpdateQuery = "UPDATE lagoon_reviews SET review = ? WHERE id = ?";
  db.query(UpdateQuery, [reviewUpdate, id], (err, result) => {
    if (err) console.log(err)
    console.log(result);
  })
})

app.listen('3000', () => { })