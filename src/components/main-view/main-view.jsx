import React from 'react';
import axios from 'axios';
import PropTypes from "prop-types";

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import { RegistrationView } from '../registration-view/registration-view';
import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from "../movie-view/movie-view";
import { Navbar } from "../navbar/navbar";
import { DirectorView } from "../director-view/director-view";
import { GenreView } from "../genre-view/genre-view";
import ProfileView from "../profile-view/profile-view";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import './main-view.scss';

export class MainView extends React.Component {

  constructor() {
    super();
    this.state = {
      movies: [],
      favoriteMovies: [],
      selectedMovie: null,
      user: null,
      registered: true,
    };
  }
  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem("user"),
      });
      this.getMovies(accessToken);
    }
  }

  getMovies(token) {
    axios
      .get("https://myflix-firstmovieapp.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Assign the result to the state
        this.setState({
          movies: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  addFavorite(movieId) {
    let { user, favoriteMovies } = this.props;
    const token = localStorage.getItem('token');
    if (favoriteMovies.some((favId) => favId === movieId)) {
      console.log('Movie already added to favorites!');
    } else {
      if (token !== null && user !== null) {
        this.props.addFavorite(movieId);
        axios
          .post(
            `https://myflix-firstmovieapp.herokuapp.com/users/${user}/movies/${movieId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(() => {
            console.log(`Movie successfully added to favorites!`);
          })
          .catch((e) => {
            console.error(e);
          });
      }
    }
  }

  removeFavorite(movieId) {
    let { user } = this.props;
    const token = localStorage.getItem('token');
    if (token !== null && user !== null) {
      this.props.removeFavorite(movieId);
      axios
        .delete(
          `https://myflix-firstmovieapp.herokuapp.com/users/${user}/movies/${movieId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          console.log(`Movie successfully removed from favorites!`);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }


/* When a user successfully logs in, this function updates the `user` property in state to that *particular user*/

onLoggedIn(authData) {
  console.log(authData);
  this.setState({
    user: authData.user.Username
  });

  localStorage.setItem('token', authData.token);
  localStorage.setItem('user', authData.user.Username);
  this.getMovies(authData.token);
}

onLoggedOut() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  this.setState({
    user: null
  });
}

toRegister(registered) {
  this.setState({
    registered,
  });
}

/*handleFavorite = (movieId, action) => {
  const { user, favoriteMovies } = this.state;
  const accessToken = localStorage.getItem("token");
  const username = user;
  if (accessToken !== null && username !== null) {
    // Add MovieID to Favorites (local state & webserver)
    if (action === "add") {
      this.setState({ favoriteMovies: [...favoriteMovies, movieId] });
      axios
        .put(
          `https://myflix-firstmovieapp.herokuapp.com/users/${username}/movies/${movieId}`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )
        .then((res) => {
          console.log(`Movie added to ${username} Favorite movies`);
          alert(`Movie added to ${username} Favorite movies`);
        })
        .catch(function (error) {
          console.log(error);
        });

      // Remove MovieID from Favorites (local state & webserver)
    } else if (action === "remove") {
      this.setState({
        favoriteMovies: favoriteMovies.filter((id) => id !== movieId),
      });
      axios
        .delete(
          `https://myflix-firstmovieapp.herokuapp.com/users/${username}/favorites/${movieId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )
        .then((res) => {
          console.log(`Movie removed from ${username} Favorite movies`);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
};*/
render() {
  const { movies, user, favoriteMovies } = this.state;
  return (
    <Router>
      <Navbar user={user} />
      <Row className="main-view justify-content-md-center mt-3">
        <Route
          exact
          path="/"
          render={() => {
            if (!user)
              return (
                <Col>
                  <LoginView 
                  movies={movies}
                  onLoggedIn={(user) => this.onLoggedIn(user)} />
                </Col>
              );
            if (movies.length === 0) return <div className="main-view" />;
            return movies.map((m) => (
              <Col md={3} key={m._id}>
                <MovieCard movie={m} />
              </Col>
            ));
          }}
        />
        <Route
          path="/register"
          render={() => {
            if (user) return <Redirect to="/" />;
            return (
              <Col>
                <RegistrationView />
              </Col>
            );
          }}
        />

        {/* route for link on main-view to profile-view */}

        <Route
            path={`/users/${user}`}
            render={({ history }) => {

              if (!user)
                return (
                  <Col>
                    <LoginView
                      movies={movies}
                      onLoggedIn={(user) => this.onLoggedIn(user)}
                    />
                  </Col>
                );
              if (movies.length === 0) return <div className="main-view" />;

              if (!user) return <Redirect to="/" />;
              return (
                <Col>
                  <ProfileView
                   movies={movies}
                   favoriteMovies={favoriteMovies.map((movieId) => {
                     return movies.find((m) => m._id === movieId);
                   })}
                   user={user}
                   removeFavorite={this.removeFavorite.bind(this)}
                   onBackClick={() => history.goBack()}
                   addFavorite={this.addFavorite}
                  />
                </Col>
              );
            }}
          />

        <Route
          path="/movies/:movieId"
          render={({ match, history }) => {
            if (!user)
              return (
                <Col>
                  <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                </Col>
              );
            if (movies.length === 0) return <div className="main-view" />;
            return (
              <Col md={8}>
                <MovieView
                  movie={movies.find((m) => m._id === match.params.movieId)}
                  onBackClick={() => history.goBack()}
                  handleFavorite={this.handleFavorite}
                />
              </Col>
            );
          }}
        />

        <Route
          path="/directors/:name"
          render={({ match, history }) => {
            if (!user)
              return (
                <Col>
                  <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                </Col>
              );
            if (movies.length === 0) return <div className="main-view" />;
            return (
              <Col md={8}>
                <DirectorView
                  director={
                    movies.find((m) => m.Director.Name === match.params.name)
                      .Director
                  }
                  onBackClick={() => history.goBack()}
                />
              </Col>
            );
          }}
        />

        <Route
          path="/genres/:name"
          render={({ match, history }) => {
            if (!user)
              return (
                <Col>
                  <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                </Col>
              );
            if (movies.length === 0) return <div className="main-view" />;
            return (
              <Col md={8}>
                <GenreView
                  genre={
                    movies.find((m) => m.Genre.Name === match.params.name)
                      .Genre
                  }
                  onBackClick={() => history.goBack()}
                />
              </Col>
            );
          }}
        />
      </Row>
    </Router>
  );
}
}

ProfileView.propTypes = {
  user: PropTypes.string.isRequired,
  movies: PropTypes.array.isRequired,
  favoriteMovies: PropTypes.array.isRequired,
};

let mapStateToProps = (state) => {
  return {
    movies: state.movies,
    user: state.user,
    favoriteMovies: state.favoriteMovies,
  };
};

export default connect(mapStateToProps, {
  setMovies,
  setUser,
  setFavorites,
  addFavorite,
  removeFavorite,
})(MainView);

/*render() {
  const { movies, selectedMovie, user, favoriteMovies } = this.state;
  return (
    <Router>
      <Navbar user={user} />

      <Row className="main-view justify-content-md-center">
        <Route
          exact
          path="/"
          render={() => {
            if (!user)
              return (
                <Col>
                  <LoginView
                    md={4}
                    onLoggedIn={(user) => this.onLoggedIn(user)}
                  />
                </Col>
              );
            if (movies.length === 0) return <div className="main-view" />;
            return movies.map((m) => (
              <Col md={8} key={m._id}>
                <MovieCard movie={m} />
              </Col>
            ));
          }}
        />

        <Route
          path="/register"
          render={() => {
            console.log("Registering User");
            if (user) return <Redirect to="/" />;
            return (
              <Col>
                <RegistrationView
                  onLoggedIn={(user) => this.onLoggedIn(user)}
                />
              </Col>
            );
          }}
        />

        <Route
          path={`/users/:username`}
          render={({ history }) => {
            if (!user) return <Redirect to="/" />;
            return (
              <Col>
                <ProfileView
                  movies={movies}
                  goBack={history.goBack}
                  favoriteMovies={favoriteMovies || []}
                  handleFavorite={this.handleFavorite}
                />
              </Col>
            );
          }}
        />

        <Route
          path={`/user-update/:username`}
          render={({ match, history }) => {
            if (!user) return <Redirect to="/" />;
            return (
              <Col>
                <UserUpdate
                  user={user}
                  onBackClick={() => history.goBack()}
                />
              </Col>
            );
          }}
        />

        <Route
          path="/movies/:movieId"
          render={({ match, history }) => {
            // console.log("movies route user", user);
            if (!user)
              return (
                <Col>
                  <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                </Col>
              );
            if (movies.length === 0) return <div className="main-view" />;
            return (
              <Col md={8}>
                <MovieView
                  movie={movies.find((m) => m._id === match.params.movieId)}
                  onBackClick={() => history.goBack()}
                  handleFavorite={this.handleFavorite}
                />
              </Col>
            );
          }}
        />

        <Route
          path="/directors/:directorName"
          render={({ match, history }) => {
            console.log("movies route director", user);
            if (!user)
              return (
                <Col>
                  <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                </Col>
              );
            if (movies.length === 0) return <div className="main-view" />;
            return (
              <Col md={8}>
                <DirectorView
                  movie={movies.find(
                    (m) => m.Director.Name === match.params.directorName
                  )}
                  onBackClick={() => history.goBack()}
                />
              </Col>
            );
          }}
        />

        <Route
          path="/genres/:genreName"
          render={({ match, history }) => {
            console.log(
              movies.find((m) => m.Genre.Name === match.params.genreName)
            );
            console.log("movies route genre", user);
            if (!user)
              return (
                <Col>
                  <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                </Col>
              );
            if (movies.length === 0) return <div className="main-view" />;
            return (
              <Col md={8}>
                <GenreView
                  movie={movies.find(
                    (m) => m.Genre.Name === match.params.genreName
                  )}
                  onBackClick={() => history.goBack()}
                />
              </Col>
            );
          }}
        />

        <Route
          path="/home"
          render={() => {
            console.log("Selecting Movie");
            if (user) return <Redirect to="/" />;
            return (
              <Row className="main-view justify-content-md-center">
                {selectedMovie ? (
                  <Col md={8}>
                    <MovieView
                      movie={selectedMovie}
                      onBackClick={(newSelectedMovie) => {
                        this.setSelectedMovie(newSelectedMovie);
                      }}
                    />
                  </Col>
                ) : (
                  movies.map((movie) => (
                    <Col md={4}>
                      <MovieCard
                        key={movie._id}
                        movie={movie}
                        onMovieClick={(newSelectedMovie) => {
                          this.setSelectedMovie(newSelectedMovie);
                        }}
                      />
                    </Col>
                  ))
                )}
              </Row>
            );
          }}
        />
      </Row>
    </Router>
  );
} // end of render()
}

/*render() {
  const { movies, user } = this.state;
  return (
    <Router>
      <Navbar user={user} />
      <Row className="main-view justify-content-md-center mt-3">
        <Route
          exact
          path="/"
          render={() => {
            if (!user)
              return (
                <Col>
                  <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                </Col>
              );
            if (movies.length === 0) return <div className="main-view" />;
            return movies.map((m) => (
              <Col md={3} key={m._id}>
                <MovieCard movie={m} />
              </Col>
            ));
          }}
        />
        <Route
          path="/register"
          render={() => {
            if (user) return <Redirect to="/" />;
            return (
              <Col>
                <RegistrationView />
              </Col>
            );
          }}
        />

        <Route
          path="/movies/:movieId"
          render={({ match, history }) => {
            if (!user)
              return (
                <Col>
                  <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                </Col>
              );
            if (movies.length === 0) return <div className="main-view" />;
            return (
              <Col md={8}>
                <MovieView
                  movie={movies.find((m) => m._id === match.params.movieId)}
                  onBackClick={() => history.goBack()}
                />
              </Col>
            );
          }}
        />

        <Route
          path="/directors/:name"
          render={({ match, history }) => {
            if (!user)
              return (
                <Col>
                  <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                </Col>
              );
            if (movies.length === 0) return <div className="main-view" />;
            return (
              <Col md={8}>
                <DirectorView
                  director={
                    movies.find((m) => m.Director.Name === match.params.name)
                      .Director
                  }
                  onBackClick={() => history.goBack()}
                />
              </Col>
            );
          }}
        />

        <Route
          path="/genres/:name"
          render={({ match, history }) => {
            if (!user)
              return (
                <Col>
                  <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                </Col>
              );
            if (movies.length === 0) return <div className="main-view" />;
            return (
              <Col md={8}>
                <GenreView
                  genre={
                    movies.find((m) => m.Genre.Name === match.params.name)
                      .Genre
                  }
                  onBackClick={() => history.goBack()}
                />
              </Col>
            );
          }}
        />
      </Row>
    </Router>
  );
}
}

export default MainView;*/

/*render() {
  const { movies, user } = this.state;

  if (!user) return <Row>
    <Col>
      <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
    </Col>
  </Row>
  if (movies.length === 0) return <div className="main-view" />;
  
  return (
    
    <Router>
      <Row className="main-view justify-content-md-center">
        <Route exact path="/" render={() => {
          return movies.map(m => (
            <Col md={3} key={m._id}>
              <MovieCard movie={m} />
            </Col>
          ))
        }} />
        <Route path="/movies/:movieId" render={({ match }) => {
          return <Col md={8}>
            <MovieView movie={movies.find(m => m._id === match.params.movieId)} />
          </Col>
        }} />

      </Row>
    </Router>
    
  );
}
}*/
