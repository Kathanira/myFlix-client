import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Row, Col, Button } from "react-bootstrap";

import './movie-view.scss';

export class MovieView extends React.Component {

  render() {
    const { movie, onBackClick } = this.props;

    return (
      <Row>
        <Col>
      <div className="movie-view">
        <div className="movie-poster">
          <img src={movie.ImagePath} />
        </div>
        <div className="movie-title">
          <span className="label">Title: </span>
          <span className="value">{movie.Title}</span>
        </div>
        <div className="movie-description">
          <span className="label">Description: </span>
          <span className="value">{movie.Description}</span>
        </div>
        <div className="movie-director">
              <span className="label">Director: </span>
              <span className="value">{movie.Director.Name}</span>
            </div>
            <div className="movie-genre">
              <span className="label">Genre: </span>
              <span className="value">{movie.Genre.Name}</span>
        </div>
        <Button className="back-button mt-2"
                  variant="secondary"
                  onClick={() => { onBackClick(null); }}>Back</Button>
       </div>
       </Col>
       </Row>
    );
  }
}
MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Description: PropTypes.string.isRequired,
    }).isRequired,
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Bio: PropTypes.string.isRequired,
      Birth: PropTypes.string.isRequired,
      Death: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onBackClick: PropTypes.func.isRequired,
};