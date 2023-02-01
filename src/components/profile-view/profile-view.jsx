import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Import React Bootstrap Components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Figure } from "react-bootstrap";


export class ProfileView extends React.Component {
  constructor() {
    super();
    this.state = {
      Username: null,
      Password: null,
      Email: null,
      Birthday: null,
      FavoriteMovies: [],
      movies: [],
    };
  }

  componentDidMount() {
    const accessToken = localStorage.getItem("token");
    this.getUser(accessToken);
  }

  onLoggedOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setState({
      user: null,
    });
    window.open("/", "_self");
  }

  getUser = (token) => {
    const Username = localStorage.getItem("user");
    axios
      .get(`https://myflix-website.onrender.com/users/${Username}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.setState({
          Username: response.data.Username,
          Password: response.data.Password,
          Email: response.data.Email,
          Birthday: response.data.Birthday,
          FavoriteMovies: response.data.FavoriteMovies,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  editUser = (e) => {
    e.preventDefault();
    const Username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    axios
      .put(
        `https://myflix-website.onrender.com/users/${Username}`,
        {
          username: this.state.Username,
          password: this.state.Password,
          Email: this.state.Email,
          Birthday: this.state.Birthday,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        this.setState({
          username: response.data.Username,
          password: response.data.Password,
          Email: response.data.Email,
          Birthday: response.data.Birthday,
        });

        localStorage.setItem("user", this.state.Username);
        const data = response.data;
        console.log(data);
        console.log(this.state.Username);
        alert("Profile is updated!");
        window.open(`/users/${Username}`, "_self");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  onRemoveFavorite = (movie) => {
    const Username = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    axios
      .delete(
        `https://myflix-website.onrender.com/users/${Username}/movies/${movie._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log(response);
        alert("Movie removed from Favorite Movies!");
        this.componentDidMount();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // Deregister
  onDeleteUser() {
    const Username = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    axios
      .delete(`https://myflix-website.onrender.com/users/${Username}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response);
        alert("Profile has been deleted");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.open(`/`, "_self");
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // Set user values
  setUsername(value) {
    this.setState({
      Username: value,
    });
    this.Username = value;
  }

  setPassword(value) {
    this.setState({
      Password: value,
    });
    this.Password = value;
  }

  setEmail(value) {
    this.setState({
      Email: value,
    });
    this.Email = value;
  }

  setBirthday(value) {
    this.setState({
      Birthday: value,
    });
    this.Birthday = value;
  }

  render() {
    const { movies, onBackClick } = this.props;
    const { FavoriteMovies, Username, Email, Birthday } = this.state;

    return (
      <Container>
        <Row>
          <Col>
            <Card className="user-profile mt-4 bg-dark text-white" style={{ borderRadius: '20px' }}>
              <Card.Header>USER PROFILE</Card.Header>
              <Card.Body>
                <div>
                  <p>Username: {Username}</p>
                  <p>Email: {Email}</p>
                  <p>Birthday: {Birthday}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="update-inputs mt-4 mb-5 bg-dark text-white" style={{ borderRadius: '20px' }}>
              <Card.Header>UPDATE PROFILE</Card.Header>
              <Card.Body>
                <Card.Text>
                  <Form
                    className="update-form"
                    onSubmit={(e) =>
                      this.editUser(
                        e,
                        this.Username,
                        this.Password,
                        this.Email,
                        this.Birthday
                      )
                    }
                  >
                    <Form.Group className="mb-3">
                      <Form.Label>New Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        className="bg-dark"
                        placeholder="New Username"
                        onChange={(e) => this.setUsername(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        className="bg-dark"
                        placeholder="New Password"
                        onChange={(e) => this.setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Update Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="Email"
                        className="bg-dark"
                        placeholder="New Email"
                        onChange={(e) => this.setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label>Birthday</Form.Label>
                      <Form.Control
                        type="date"
                        name="Birthday"
                        className="bg-dark"
                        onChange={(e) => this.setBirthday(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Button
                        variant="primary mt-3 mr-4"
                        type="submit"
                        onClick={() => this.editUser()}
                      >
                        Update User
                      </Button>
                      <Button
                        className="delete-button"
                        variant="danger mt-3"
                        onClick={() => this.onDeleteUser()}
                      >
                        Delete User
                      </Button>
                    </Form.Group>
                  </Form>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row></Row>
        <Card className="bg-dark text-white">
          <Card.Header>
            <h4>Favorite Movies</h4>
          </Card.Header>
          <Card.Body>
            <Row className="text-align-center">
              {FavoriteMovies.length === 0 && (
                <div>No Favorite Movies</div>
              )}
              {FavoriteMovies.length > 0 &&
                movies.map((movie) => {
                  if (
                    movie._id ===
                    FavoriteMovies.find((fav) => fav === movie._id)
                  ) {
                    return (
                      <Col key={movie._id} md={4}>
                        <Figure>
                          <Link to={`/movies/${movie._id}`}>
                            <Figure.Image
                              className="card-img"
                              src={movie.ImagePath}
                              crossOrigin="anonymous"
                              alt={movie.Title}
                            />
                            <Figure.Caption className="text-white">{movie.Title}</Figure.Caption>
                          </Link>
                          <Button
                            className="mt-3"
                            value={movie._id}
                            variant="secondary"
                            onClick={() => this.onRemoveFavorite(movie)}>
                            Remove
                          </Button>
                        </Figure>
                      </Col>
                    );
                  }
                })}
            </Row>
            <div>
              <Button style={{ float: 'left' }} variant="outline-primary" onClick={() => { onBackClick(null); }}>Back</Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

ProfileView.propTypes = {
  User: PropTypes.shape({
    Username: PropTypes.string,
    Password: PropTypes.string,
    Email: PropTypes.string,
    Birthday: PropTypes.string,
    FavoriteMovies: PropTypes.array,
  }),
};