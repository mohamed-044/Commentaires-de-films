import { useState, useEffect } from "react";
import "./App.css";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import FormGroup from "react-bootstrap/FormGroup";
import Form from "react-bootstrap/Form";

function App() {
  const [movie, setMovie] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        // const response = await fetch("https://jsonfakery.com/movies/random/1");
        const response = await fetch("https://movies.digistos.com/");
        if (!response.ok) {
          throw new Error(
            `Erreur HTTP: ${
              response.statusText ? response.statusText + " - " : ""
            }${response.status}`
          );
        }
        const data = await response.json();
        setMovie(data);
        console.log("Film récupéré :", data);
      } catch (error) {
        console.error(error.message);
        setError("Une erreur est survenue lors de la récupération des films.");
      }
    }
    fetchMovie();
  }, []);

  if (movie.lenght === 0) {
    return <p>Chargement...</p>;
  }

  return (
    <Container className="py-4">
      <Row className="g-3">
        {/* <Button>Nouveau film</Button> */}
        {movie.map((movie) => (
          <Card key={movie.id} className="movie-card">
            <Card.Img
              variant="top"
              src={movie.poster_path}
              alt={movie.original_title}
            />
            <Card.Body>
              <Card.Title>{movie.original_title}</Card.Title>
              <Card.Text className="releaseDate">
                {"Sortie le "}
                {movie.release_date}
              </Card.Text>
              <Card.Text className="overview"> {movie.overview}</Card.Text>
              <Card.Text className="voteAverage">
                {"Note moyenne : "}
                {movie.vote_average}
                {"/10"}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
        <Form>
          <Form.Group className="mb-3" controlId="name">
            <Card.Title>Commentaires</Card.Title>
            <Form.Label>Ajouter un commentaire</Form.Label>
            <Form.Control type="text" placeholder="Ecrire un commentaire" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="note">
            <Form.Select name="note">
              <option value="1">1/10</option>
              <option value="2">2/10</option>
              <option value="3">3/10</option>
              <option value="4">4/10</option>
              <option value="5">5/10</option>
              <option value="6">6/10</option>
              <option value="7">7/10</option>
              <option value="8">8/10</option>
              <option value="9">9/10</option>
              <option value="10">10/10</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="isCompleted">
            <Form.Check
              type="checkbox"
              label="J'accepte les conditions générales"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Envoyer
          </Button>
        </Form>
        <Card className="movie-card">
            <Card.Body>
              <Card.Text className="note">
                {"Note :"}
              </Card.Text>
              <Card.Text className="commentary">
                {"Commentaire :"}
              </Card.Text>
              <Button variant="danger" type="submit">
                Supprimer
              </Button>        
            </Card.Body>
          </Card>
      </Row>
    </Container>
  );
}

export default App;
