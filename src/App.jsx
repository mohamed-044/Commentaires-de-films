import { useState, useEffect } from "react";
import "./App.css";
import { addComment, deleteComment } from "./redux/commentSlice";
import { selectComment } from "./redux/selectors";
import { useSelector, useDispatch } from "react-redux";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { ListGroup } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  text: yup.string()
    .required("Le commentaire est obligatoire")
    .max(500, "Le commentaire doit contenir au maximum 500 caractères"),
  note: yup.string()
    .oneOf(["1", "2", "3", "4", "5"], "Veuillez sélectionner une note")
    .required(),
  acceptConditions: yup
    .boolean()
    .oneOf([true], "Vous devez accepter les conditions générales"),
});

function App() {
  const [movie, setMovie] = useState([]);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const comment = useSelector(selectComment);
  const [isLoading, setIsLoading] = useState(true);

  const handleAddComment = (data) => {
    dispatch(addComment({ text: data.text, note: data.note }));
    reset();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    async function fetchMovie() {
      try {
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
        setIsLoading(false);
        console.log("Film récupéré :", data);
      } catch (error) {
        console.error(error.message);
        setError("Une erreur est survenue lors de la récupération des films.");
        setIsLoading(false);
      }
    }
    fetchMovie();
  }, []);

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Row className="g-3">
            {movie.map((movie) => {
              const dateFr = new Date(movie.release_date).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              });
              return (
                <Card key={movie.id}>
                  <Card.Img
                    variant="top"
                    src={movie.poster_path}
                    alt={movie.original_title}
                  />
                  <Card.Body>
                    <Card.Title>{movie.original_title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {"Sortie le "}
                      {dateFr}
                    </Card.Subtitle>
                    <Card.Text> {movie.overview}</Card.Text>
                    <Card.Text>
                      {"Note moyenne : "}
                      {movie.vote_average / 2}
                      {"/5"}
                    </Card.Text>
                  </Card.Body>
                </Card>
              );
            })}
          </Row>
          <Form onSubmit={handleSubmit(handleAddComment)}>
            <Form.Group className="mb-3" controlId="commentary">
              <Card.Title className="pt-4 pb-2">Commentaires</Card.Title>
              <Form.Label>Ajouter un commentaire</Form.Label>
              <Form.Control
                className="mb-3"
                as="textarea"
                rows={4}
                type="text"
                placeholder="Ecrire un commentaire"
                {...register("text")}
              />
              {errors.text && (
                <Form.Text className="text-danger">
                  {errors.text.message}
                </Form.Text>
              )}
              <Form.Select {...register("note")} className="mb-3">
                <option value="">Choisissez une note</option>
                <option value="1">1/5</option>
                <option value="2">2/5</option>
                <option value="3">3/5</option>
                <option value="4">4/5</option>
                <option value="5">5/5</option>
              </Form.Select>
              {errors.note && (
                <Form.Text className="text-danger mb-3">
                  {errors.note.message}
                </Form.Text>
              )}
              <Form.Check
                type="checkbox"
                className="mb-3"
                label="J'accepte les conditions générales"
                {...register("acceptConditions")}
              />
              {errors.acceptConditions && (
                <Form.Text className="text-danger">
                  {errors.acceptConditions.message}
                </Form.Text>
              )}
              <Button variant="primary" type="submit">
                Ajouter
              </Button>
            </Form.Group>
          </Form>
          {comment.length === 0 ? (
            <ListGroup.Item variant="info" className="text-center p-4">
              Aucun commentaire pour le moment
            </ListGroup.Item>
          ) : (
            <ListGroup>
              {comment.map((comment) => (
                <ListGroup.Item key={comment.id}>
                  <Row className="align-items-center">
                    <Form.Label className="fw-bold">
                      {" "}
                      Note : {comment.note}/5
                    </Form.Label>
                    <Form.Label>{comment.text}</Form.Label>
                    <Stack direction="horizontal" className="justify-content-end">
                      <Button
                        onClick={() => dispatch(deleteComment(comment.id))}
                        variant="danger"
                        size="sm"
                        type="button"
                      >
                        Supprimer
                      </Button>
                    </Stack>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
