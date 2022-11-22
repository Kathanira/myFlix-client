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

import './profile-view.scss';

export function ProfileView(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    // Declare hook for each input
    const [usernameErr, setUsernameErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [birthdayErr, setBirthdayErr] = useState('');
    const { user, favoriteMovies, removeFavorite, onBackClick } = props;

// Validate user inputs
const validate = () => {
    let isReq = true;
    if (!username) {
      setUsernameErr('Username required');
      isReq = false;
    } else if (username.length < 2) {
      setUsernameErr('Username must be 2 or more characters');
      isReq = false;
    }
    if (!password) {
      setPasswordErr('Password required');
      isReq = false;
    } else if (password.length < 6) {
      setPasswordErr('Password must be 6 or more characters');
      isReq = false;
    }
    if (!email) {
      setEmailErr('Email required');
      isReq = false;
    } else if (email.indexOf('@') === -1) {
      setEmailErr('Email must be a valid email address');
      isReq = false;
    }

    return isReq;
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const isReq = validate();
    const token = localStorage.getItem('token');
    if (isReq && token !== null && user !== null) {
      axios
        .put(
          `https://myflix-firstmovieapp.herokuapp.com/users/${user}`,

          {
            Username: username,
            Password: password,
            Email: email,
            Birthday: birthday,
          },

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          const data = res.data;
          updateUser(data.Username);
          localStorage.setItem('user', data.Username);
          alert(
            'Update successful! Your changes will be visible after the next login.'
          );
        })
        .catch((e) => {
          console.error(e);
          alert('Unable to update user infos :(');
        });
    }
  };
  const handleDelete = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (confirm('Are you sure? This cannot be undone!')) {
      axios
        .delete(`https://myflix-firstmovieapp.herokuapp.com/users/${user}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          alert(`Your account has been deleted. We're sorry to see you go!`);
          localStorage.clear();
          deleteUser({});
          window.open('/', '_self');
        })
        .catch((e) => console.log(e));
    }
  };
  return (
    <Container className="profile-container">
      <Card bg="dark" text="light" className="profile-card">
        <Card.Header className="text-center" as="h5">
          Profile
        </Card.Header>
        <Card.Body>
          <CardGroup>
            <Card bg="dark" border="dark" text="light">
              <span className="label text-center headline-profile-update">
                Update profile information
              </span>
              <Form>
                <Form.Group
                  className="profile-form-group-username"
                  controlId="formGroupUsername"
                >
                  <Form.Label>Username:</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                  {usernameErr && <p>{usernameErr}</p>}
                </Form.Group>
                <Form.Group
                  className="profile-form-group-password"
                  controlId="formGroupPassword"
                >
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password must be 6 or more characters"
                    minLength="6"
                    required
                  />
                  {passwordErr && <p>{passwordErr}</p>}
                </Form.Group>
                <Form.Group
                  className="profile-form-group-email"
                  controlId="formGroupEmail"
                >
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                  {emailErr && <p>{emailErr}</p>}
                </Form.Group>
                <Form.Group
                  className="profile-form-group-birthday"
                  controlId="formGroupBirthday"
                >
                  <Form.Label>Date of birth:</Form.Label>
                  <Form.Control
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    placeholder="Enter your birthday"
                  />
                  {birthdayErr && <p>{birthdayErr}</p>}
                </Form.Group>
                <Button
                  className="button-profile-view-update"
                  variant="secondary"
                  type="submit"
                  onClick={handleUpdate}
                >
                  Update
                </Button>
              </Form>
              <span className="label headline-profile-mini-cards">
                My favorite movies
              </span>
            </Card>
            <Card bg="dark" border="dark" text="light">
              <span className="label text-center headline-profile-delete">
                Delete account
              </span>
              <Col>
                <Button
                  className="button button-profile-view-delete"
                  variant="danger"
                  type="submit"
                  onClick={handleDelete}
                >
                  DELETE ACCOUNT PERMANENTLY
                </Button>
              </Col>
            </Card>
          </CardGroup>
          <CardGroup className="card-group-profile-mini-cards">
            {favoriteMovies.map((m) => (
              <Col
                md={6}
                lg={3}
                key={m._id}
                className="profile-movie-card-mini"
              >
                <Card className="h-100" bg="dark" text="light">
                  <Link
                    to={`/movies/${m._id}`}
                    className="profile-movie-card-link"
                  >
                    <Card.Img
                      variant="top"
                      crossOrigin="anonymous | use-credentials"
                      src={m.ImagePath}
                    />
                    <Card.Body>
                      <Card.Title>{m.Title}</Card.Title>
                    </Card.Body>
                  </Link>
                  <Button
                    className="button-profile-view-remove-favorite"
                    variant="outline-danger"
                    size="sm"
                    type="button"
                    onClick={() => removeFavorite(m._id)}
                  >
                    Remove
                  </Button>
                </Card>
              </Col>
            ))}
          </CardGroup>
        </Card.Body>
        <Card.Footer className="text-right">
          <Button
            className="button-profile-view-back"
            variant="secondary"
            onClick={() => {
              onBackClick();
            }}
          >
            Back
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
}

ProfileView.propTypes = {
  user: PropTypes.string.isRequired,
  favoriteMovies: PropTypes.array.isRequired,
  removeFavorite: PropTypes.func.isRequired,
  onBackClick: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {
  deleteUser,
  updateUser,
})(ProfileView);


/*export default class ProfileView extends React.Component {
    constructor() {
      super();
      this.state = {
        Username: null,
        Password: null,
        Email: null,
        Birthday: null,
        FavoriteMovies: [],
      };
    }
  componentDidMount() {
    const accessToken = localStorage.getItem("token");
    this.getUser(accessToken);
  }

  onRemoveFavorite = (movie) => {
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    console.log(movie)
    axios
      .delete(
        `https://myflix-firstmovieapp.herokuapp.com/users/${username}/movies/${movie}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log(response);
        alert("Movie was removed from favorites.");
        this.componentDidMount();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
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
      .get(`https://myflix-firstmovieapp.herokuapp.com/users/${Username}`, {
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
        `https://myflix-firstmovieapp.herokuapp.com/users/${Username}`,
        {
          Username: this.state.Username,
          Password: this.state.Password,
          Email: this.state.Email,
          Birthday: this.state.Birthday,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log(response)
        this.setState({
          Username: response.data.Username,
          Password: response.data.Password,
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
        console.error(error);
      });
  };

  // Deregister
  onDeleteUser() {
    const Username = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    axios
      .delete(`https://myflix-firstmovieapp.herokuapp.com/users/${Username}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response);
        alert("Profile has been deleted!");
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
    console.warn("setBirthday", value);
    this.setState({
      Birthday: value,
    });
    this.Birthday = value;
  }
  test(){
    alert('works')
  }
  render() {
    const { movies } = this.props;
    const { FavoriteMovies, Username, Email, Birthday, Password } = this.state;

    const myFavoritesMovies = [];
    for (let index = 0; index < movies.length; index++) {
      const movie = movies[index];
      if (FavoriteMovies.includes(movie._id)) {
        myFavoritesMovies.push(movie);
      }
    }

    return (
      <Container>
        <Row>
          <Col>
            <Card className="user-profile">
              <Card.Header>User Profile</Card.Header>
              <Card.Body>
                <>
                  <p>Name: {Username}</p>
                  <p>Email: {Email}</p>
                  <p>Birthday: {Birthday}</p>
                </>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="update-inputs">
              <Card.Header>Update Profile</Card.Header>
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
                    <Form.Group>
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="Username"
                        placeholder="New Username"
                        onChange={(e) => this.setUsername(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="Password"
                        placeholder="New Password"
                        onChange={(e) => this.setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="Email"
                        placeholder="New Email"
                        onChange={(e) => this.setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Birthday</Form.Label>
                      <Form.Control
                        type="date"
                        name="Birthday"
                        onChange={(e) => this.setBirthday(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Button
                        variant="warning"
                        type="submit"
                        onClick={(e) => this.editUser(e)}
                      >
                        Update User
                      </Button>
                      <Button
                        className="delete-button"
                        variant="danger"
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
        <Card className="favmov-inputs">
          <Card.Body>
            <Row>
              <Col xs={12}>
                <h4>Favorite Movies</h4>
              </Col>
            </Row>
            <Row>
              {myFavoritesMovies.map((movie) => (
                <Col key={movie._id} className="fav-movie">
                  <Figure>
                    <Link to={`/movies/${movie._id}`}>
                      <Figure.Image src={movie.ImagePath} alt={movie.Title} />
                      <Figure.Caption>{movie.Title}</Figure.Caption>
                    </Link>
                  </Figure>
                  <Button
                    className="remove"
                    variant="secondary"
                    onClick={()=>{this.onRemoveFavorite(movie._id)}}
                  >
                    Remove from the list
                  </Button>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}*/