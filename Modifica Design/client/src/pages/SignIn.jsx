import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {Alert, Button, Form, Spinner, Container} from 'react-bootstrap'; // Importa i componenti Bootstrap necessari
import { useUser } from '../components/UserContext.jsx';
import OAuth from '../components/OAuth'; // Assicurati di importare correttamente il componente OAuth

const SignIn = () => {
  const { loading, error, signInStart, signInSuccess, signInFailure } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return signInFailure("Si prega di compilare tutti i campi");
    }

    try {
      signInStart();

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        signInFailure(data.message);
      }

      if (res.ok) {
        signInSuccess(data);
        navigate("/");
      }
    } catch (error) {
      signInFailure(error.message);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row ">
        <div className="jumbotron jumbotron-fluid text-white bg-dark">
          <Container className="text-center">
            <h1 className="display-3">Accedi</h1>
            <p className="lead mb-2">
              Benvenuto! Accedi con la tua email e password o usa il login con Google.
            </p>
          </Container>
        </div>
        </div>

        <div className="row justify-content-center align-items-center">
          <div className="col-md-6 ">
            <div className="card shadow">
              <div className="card-body">
                <Form className="d-flex flex-column gap-4" onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>La tua email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="nome@email.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>La tua password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="********"
                        value={formData.password}
                        onChange={handleChange}
                    />
                  </Form.Group>

                  <Button
                      variant="primary"
                      type="submit"
                      disabled={loading}
                      className="btn btn-info bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white border border-black"

                  >
                    {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2"/>
                          Caricamento...
                        </>
                    ) : (
                        "Accedi"
                    )}
                  </Button>
                </Form>
                <div className="d-flex gap-2 text-sm mt-3">
                  <span>Non hai un account?</span>
                  <Link to="/sign-up" className="text-primary">
                    Registrati
                  </Link>
                </div>

                {error && (
                    <Alert variant="danger" className="mt-3 text-center">
                      {error}
                    </Alert>
                )}
              </div>
            </div>

            {/* Integrazione del componente OAuth */}
            <div className="text-center mt-4">
              <OAuth/>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SignIn;
