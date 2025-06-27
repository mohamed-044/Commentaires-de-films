import { useState, useEffect } from "react";
import "./App.css";
import { addComment, deleteComment } from "./redux/commentSlice";
import { selectComment } from "./redux/selectors";
import { useSelector, useDispatch } from "react-redux";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { ListGroup } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";

function App() {
  const [movie, setMovie] = useState([]);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const [input1, setInput1] = useState("");
  const dispatch = useDispatch();
  const comment = useSelector(selectComment);
  const handleAddComment = (e) => {
    e.preventDefault();
    dispatch(addComment({ text: input, note: input1 }));
    setInput("");
    setInput1("1");
  };

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
        <Form onSubmit={handleAddComment}>
          <Form.Group className="mb-3" controlId="commentary">
            <Card.Title>Commentaires</Card.Title>
            <Form.Label>Ajouter un commentaire</Form.Label>
            <Form.Control
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ecrire un commentaire"
            />
            <Form.Select
              name="note"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
            >
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
            <Form.Check
              type="checkbox"
              label="J'accepte les conditions générales"
            />
            <Button variant="primary" type="submit">
              Ajouter
            </Button>
          </Form.Group>
        </Form>

        <ListGroup>
          {comment.map((comment) => (
            <ListGroup.Item key={comment.id}>
              <Row className="align-items-center">
                <Form.Label className="fw-bold">
                  {" "}
                  Note : {comment.note}/10
                </Form.Label>
                <Form.Label>{comment.text}</Form.Label>
                <Stack direction="horizontal" className="justify-content-end">
                  <Button
                    onClick={() => dispatch(deleteComment(comment.id))}
                    variant="danger"
                    size="sm"
                    type="submit"
                  >
                    Supprimer
                  </Button>
                </Stack>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Row>
    </Container>
  );
}

export default App;
