import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Spinner, Container, Form, Button } from 'react-bootstrap';
import OAuth from '../components/OAuth';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('All fields are required!');
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }

      setLoading(false);

      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  console.log(formData);

  return (
      <div className="min-vh-100 d-flex align-items-center">
        <Container>
          <div className="row">
            <div className="jumbotron jumbotron-fluid text-white bg-dark">
              <Container className="text-center">
                <h1 className="display-3">Registrati</h1>
                <p className="lead mb-2">
                  Benvenuto! Registrati con la tua email e password per entrare nella community.
                </p>
              </Container>
            </div>
          </div>

          <div className="row justify-content-center align-items-center">
            <div className="col-md-6">
              <div className="card shadow">
                <div className="card-body">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="username" className="mb-3">
                      <Form.Label>Il tuo username </Form.Label>
                      <Form.Control type="text" placeholder="Username" onChange={handleChange} />
                    </Form.Group>

                    <Form.Group controlId="email" className="mb-3">
                      <Form.Label>La tua email</Form.Label>
                      <Form.Control type="email" placeholder="nome@email.com" onChange={handleChange} />
                    </Form.Group>

                    <Form.Group controlId="password" className="mb-3">
                      <Form.Label>La tua password</Form.Label>
                      <Form.Control type="password" placeholder="Password" onChange={handleChange} />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={loading} className="w-100">
                      {loading ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            <span className="pl-3">Loading...</span>
                          </>
                      ) : (
                          'Registrati'
                      )}
                    </Button>

                    <div className="d-flex gap-2 text-sm mt-3">
                      <span>Hai già un account?</span>
                      <Link to="/sign-in" className="text-primary">
                        Accedi
                      </Link>
                    </div>

                    {errorMessage && (
                        <Alert variant="danger" className="mt-3">
                          {errorMessage}
                        </Alert>
                    )}
                  </Form>
                </div>
              </div>
              <OAuth />
            </div>
          </div>
        </Container>
      </div>
  );
};

export default SignUp;

