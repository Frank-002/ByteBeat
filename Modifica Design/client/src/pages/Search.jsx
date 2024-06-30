import { Button, Form, FormControl, FormGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData({ ...sidebarData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card">
            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                <FormGroup className="mb-3">
                  <Form.Label className="font-weight-bold">Cerca:</Form.Label>
                  <FormControl
                    type="text"
                    id="searchTerm"
                    placeholder="Cerca..."
                    value={sidebarData.searchTerm}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup className="mb-3">
                  <Form.Label className="font-weight-bold">Ordine:</Form.Label>
                  <Form.Select id="sort" value={sidebarData.sort} onChange={handleChange}>
                    <option value="desc">Più recente</option>
                    <option value="asc">Più vecchio</option>
                  </Form.Select>
                </FormGroup>
                <FormGroup className="mb-3">
                  <Form.Label className="font-weight-bold">Categoria:</Form.Label>
                  <Form.Select
                    id="category"
                    value={sidebarData.category}
                    onChange={handleChange}
                  >
                    <option value="uncategorized">Seleziona categoria</option>
                    <option value="sport">Sport</option>
                    <option value="animali">Animali</option>
                    <option value="scienza">Scienza</option>
                    <option value="arte">Arte</option>
                    <option value="notizie">Notizie</option>
                  </Form.Select>
                </FormGroup>
                <Button variant="primary" type="submit" className="w-100">
                  Applica filtri
                </Button>
              </Form>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center mb-4">Post trovati:</h1>
          <div className="row">
            {!loading && posts.length === 0 && (
              <p className="text-xl text-gray-500 text-center">Nessun post trovato.</p>
            )}
            {loading && <p className="text-xl text-gray-500 text-center">Loading...</p>}
            {!loading &&
              posts.map((post) => (
                <div key={post._id} className="col-md-6 mb-4">
                  <PostCard post={post} />
                </div>
              ))}
          </div>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="btn btn-outline-primary d-block mx-auto mt-4"
            >
              Mostra di più
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
