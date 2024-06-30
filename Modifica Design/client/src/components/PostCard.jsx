import { Link } from 'react-router-dom';
import '../css/PostCard.css';  // Assicurati di creare questo file CSS

export default function PostCard({ post }) {
    return (
        <div className='post-card position-relative border border-teal-500 overflow-hidden rounded-lg transition-all'>
            <Link to={`/post/${post.slug}`}>
                <img
                    src={post.image}
                    alt='post cover'
                    className='post-image w-100 object-cover transition-all duration-300'
                />
            </Link>
            <div className='p-3 d-flex flex-column gap-2'>
                <p className='text-lg font-weight-semibold text-truncate'>{post.title}</p>
                <span className='font-italic text-sm'>{post.category}</span>
                <Link
                    to={`/post/${post.slug}`}
                    className='btn btn-outline-teal btn-block position-absolute transition-all duration-300 text-center py-2 rounded-0 read-article-link'
                >
                    Leggi articolo
                </Link>
            </div>
        </div>
    );
}
