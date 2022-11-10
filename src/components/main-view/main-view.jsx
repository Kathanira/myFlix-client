import React from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from "../movie-view/movie-view";

export class MainView extends React.Component {

  constructor(){
    super();
    this.state = {
      movies: [
        { _id: "635a4ef51232a560c886d138", 
            Title: 'Silence of the Lambs', 
            Description: 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.', 
            Genre: {
                Name: "Thriller",
                Description:
                  "Thriller film, also known as suspense film or suspense thriller, is a broad film genre that involves excitement and suspense in the audience",
              },
              Director: {
                Name: "Jonathan Demme",
                Bio: "Robert Jonathan Demme was an American producer and screenwriter.",
                Birth: "1944",
                Death: "2017",
              },
              ImagePath:
              "https://www.imdb.com/title/tt0102926/mediaviewer/rm803658241/?ref_=ext_shr_lnk",
            Featured: true,
          },        
        
        { _id: "635a4ef51232a560c886d139", 
        Title: 'Django Unchained', 
        Description: 'Description":"With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation-owner in Mississippi.', 
        Genre:{
            Name:"Drama",
            Description:"In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone."
        },
        Director:{
            Name:"Quentin Tarantino",
            Bio:"Quentin Jerome Tarantino is an American filmmaker and actor. His films are characterized by frequent references to popular culture and film genres, nonlinear storylines, dark humor, stylized violence, extended dialogue, pervasive use of profanity, cameos and ensemble casts.",
            Birth:"1963"
        },
        ImagePath: 'https://www.imdb.com/title/tt1853728/mediaviewer/rm958180352/',
        Featured: false,
    },
        
        
        { _id: "635a4ef51232a560c886d13a", 
        Title: 'Inglourious Basterds', 
        Description: 'In Nazi-occupied France during World War II, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owners vengeful plans for the same.', 
        Genre:{
            Name:"Adventure",
            Description:"The adventure genre is defined by having a strong element of danger in the story. Adventure stories are fast-paced and full of action."
        },
        Director:{
            Name:"Quentin Tarantino",
            Bio:"Quentin Jerome Tarantino is an American filmmaker and actor. His films are characterized by frequent references to popular culture and film genres, nonlinear storylines, dark humor, stylized violence, extended dialogue, pervasive use of profanity, cameos and ensemble casts.","Birth":"1963"
        },
        
        ImagePath: 'https://www.imdb.com/title/tt0361748/mediaviewer/rm3163035648/?ref_=tt_ov_i',
        Featured: false,
    },
      ],
      selectedMovie: null,
    };
  }

  setSelectedMovie(newSelectedMovie) {
    this.setState({
      selectedMovie: newSelectedMovie,
    });
  }

  render() {
    const { movies, selectedMovie } = this.state;


    if (movies.length === 0) return <div className="main-view">The list is empty!</div>;

    return (
      <div className="main-view">
        {selectedMovie
          ? <MovieView movie={selectedMovie} onBackClick={newSelectedMovie => { this.setSelectedMovie(newSelectedMovie); }}/>
          : movies.map(movie => (
            <MovieCard key={movie._id} movie={movie} onMovieClick={(movie) => { this.setSelectedMovie(movie) }}/>
          ))
        }
      </div>
    );
  }

}