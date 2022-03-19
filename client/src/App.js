/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-globals */
import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import env from "@beam-australia/react-env";
import { Button, Container, Card, Row } from 'react-bootstrap';

const API_ROUTE = process.env.NODE_ENV === "development" ? `${process.env.REACT_APP_API_ROUTE}` : env("API_ROUTE")

console.log("REACT_APP_API_ROUTE: ", env("API_ROUTE"));
console.log("REACT_APP_NAME: ", env("NAME"));

class App extends Component {
  constructor(props) {
    super(props)
      this.state = {
        setName: '',
        setCompany: '',
        setReview: '',
        fetchData: [],
        reviewUpdate: ''
      }
  }

  handleChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value
    this.setState({
      [nam]: val
    })
  }

  handleChange2 = (event) => {
    this.setState({
      reviewUpdate: event.target.value
    })
  }

  componentDidMount() {
    axios.get(`${API_ROUTE}/api/get`)
      .then((response) => {
        this.setState({
          fetchData: response.data
        })
      })
  }

  submit = () => {
    axios.post(`${API_ROUTE}/api/insert`, this.state)
      .then(() => { alert('success post') })
    console.log(this.state)
    document.location.reload();
  }

  delete = (id) => {
    if (confirm("Do you want to delete? ")) {
      axios.delete(`${API_ROUTE}/api/delete/${id}`)
      document.location.reload()
    }
  }

  edit = (id) => {
    axios.put(`${API_ROUTE}/api/update/${id}`, this.state)
    document.location.reload();
  }

  render() {
    let card = this.state.fetchData.map((val, key) => {
      return (
        <React.Fragment>
          <Card style={{ width: '18rem' }} className='m-2'>
            <Card.Body>
              <Card.Title>{val.name}</Card.Title>
              <Card.Text>
                {val.company}
              </Card.Text>
              <Card.Text>
                {val.review}
              </Card.Text>
              <input name='reviewUpdate' onChange={this.handleChange2} placeholder='Update Review' ></input>
              <Button className='m-2' onClick={() => { this.edit(val.id) }}>Update</Button>
              <Button onClick={() => { this.delete(val.id) }}>Delete</Button>
            </Card.Body>
          </Card>
        </React.Fragment>
      )
    })

    return (
      <div className='app'>
        <h1>Lagoonised React App with Express API</h1>
        <div className='form'>
          <input name='setName' placeholder='Enter Name' onChange={this.handleChange} />
          <input name='setCompany' placeholder='Enter Company Name' onChange={this.handleChange} />
          <input name='setReview' placeholder='Enter Review' onChange={this.handleChange} />
        </div>

        <Button className='my-2' variant="primary" onClick={this.submit}>Submit</Button> <br /><br/>
        <Container>
          <Row>
            {card}
          </Row>
        </Container>
      </div>
    );
  }
}
export default App;