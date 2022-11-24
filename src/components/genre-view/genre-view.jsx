import React from "react";
import { Button, Container, Col, Row } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";

export class GenreView extends React.Component {
  render() {
    const { genre, onBackClick, genreMovies } = this.props;

    return (
      <Container className="genre-view">
        <Row>
          <Col>
            <h1>{genre.Name}</h1>
          </Col>
        </Row>
        <Row>
          <p>{genre.Description}</p>
        </Row>
    

        <Row>
          {genreMovies?.map((movie) => (
            <Col lg={4} md={6}>
              <MovieCard key={movie._id} movie={movie}>
                {movie.Title}
              </MovieCard>
            </Col>
          ))}
        </Row>

        <Button
          className="mt-4"
          onClick={() => {
            onBackClick();
          }}
          variant="secondary"
        >
          Go Back
        </Button>
      </Container>
    );
  }
}