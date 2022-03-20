const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// extract env vars
const {
  MARIADB_HOST,
  MARIADB_USER,
  MARIADB_PASSWORD,
  MARIADB_DATABASE,
  REACT_APP_NAME,
  REACT_APP_API_ROUTE,
  REACT_APP_API_PORT,
  NODE_ENV,
  CORS,
} = process.env

// add mariadb database connection
const db = mysql.createPool({
  host: MARIADB_HOST,
  user: MARIADB_USER, 
  password: MARIADB_PASSWORD,
  database: MARIADB_DATABASE
})

const PORT = REACT_APP_API_PORT || 3000

// debug info
const debug = true
if (debug || NODE_ENV === 'development') {
  console.log('API ⚙️ ~ REACT_APP_API_ROUTE', REACT_APP_API_ROUTE)
  console.log('API ⚙️ ~ CORS', CORS)
  console.log('API ⚙️ ~ NODE_ENV', NODE_ENV)
  console.log('API ⚙️ ~ PORT', PORT)
}

// cors
const corsOptions = {
  origin: CORS ? CORS.split(',') : true,
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}
app.use(cors(corsOptions))

// add an express method to parse the POST method
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  res.send("REST API")
});

// get all of the reviews in the database
app.get('/api/get', (req, res, next) => {
  const SelectQuery = "SELECT * FROM lagoon_reviews";
  db.query(SelectQuery, (err, result) => {
    if (err) console.log("Error: ", err);
    // console.log("Reviews: ", result);
    res.send(result)
  })
})

// add a review to the database
app.post("/api/insert", cors(corsOptions), (req, res, next) => {
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
app.delete("/api/delete/:reviewId", cors(corsOptions), (req, res, next) => {
  const id = req.params.reviewId;
  const DeleteQuery = "DELETE FROM lagoon_reviews WHERE id = ?";
  db.query(DeleteQuery, id, (err, result) => {
    if (err) console.log("Error delete: ", err);
    console.log(result);
  })
})

// update a review
app.put("/api/update/:reviewId", cors(corsOptions), (req, res, next) => {
  const reviewUpdate = req.body.reviewUpdate;
  const id = req.params.reviewId;
  const UpdateQuery = "UPDATE lagoon_reviews SET review = ? WHERE id = ?";
  db.query(UpdateQuery, [reviewUpdate, id], (err, result) => {
    if (err) console.log(err)
    console.log(result);
  })
})

app.listen('3000', () => { 
  console.log(`api server started on port: ${PORT}`);
})