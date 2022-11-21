import React from "react";
import { Button, Container, Col, Row } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";

export class DirectorView extends React.Component {
  render() {
    const { director, onBackClick, directorMovies } = this.props;

    return (
      <Container className="director-view">
        <Row>
          <Col>
            <h1>{director.Name}</h1>
            <p>Birth: {director.Birth}</p>
            {director.Death > 0 && <p>Death: {director.Death}</p>}
          </Col>
        </Row>
        <Row>
          <Col>{director.Bio}</Col>
        </Row>
     
        <Row>
          {directorMovies?.map((movie) => (
            <Col lg={4} md={6}>
              <MovieCard key={movie._id} movie={movie}>
                {movie.Title}
              </MovieCard>
            </Col>
          ))}
        </Row>
        <Button
          className="mt-3 backBtn"
          onClick={() => {
            onBackClick(null);
          }}
          variant="secondary"
        >
          Go Back
        </Button>
      </Container>
    );
  }
}