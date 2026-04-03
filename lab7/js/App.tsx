import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  RootState,
  clearMessages,
  fetchPosts,
  fetchUsers,
  fetchComments,
  createPost,
} from "./store";

const Header: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) =>
    location.pathname === path ? "active" : "";

  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
          <li>
            <Link to="/posts" className={`nav-link ${isActive("/posts")}`}>
              Посты
            </Link>
          </li>
          <li>
            <Link to="/users" className={`nav-link ${isActive("/users")}`}>
              Пользователи
            </Link>
          </li>
          <li>
            <Link
              to="/comments"
              className={`nav-link ${isActive("/comments")}`}
            >
              Комментарии
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="footer">
    <p>© 2♡26 API Dashboard</p>
  </footer>
);

interface DataCardProps {
  title: string;
  children: React.ReactNode;
  meta?: string;
}

const DataCard: React.FC<DataCardProps> = ({ title, children, meta }) => (
  <article className="data-card">
    <h4>{title}</h4>
    <div>{children}</div>
    {meta && <div className="meta">{meta}</div>}
  </article>
);

const PostsSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error, successMessage } = useSelector(
    (state: RootState) => state.api,
  );
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", body: "", userId: 1 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createPost(formData));
    setShowForm(false);
    setFormData({ title: "", body: "", userId: 1 });
  };

  const handleCloseMessage = () => {
    dispatch(clearMessages());
  };

  return (
    <section className="api-section">
      <h2>Посты</h2>
      <p className="api-description">
        Полноценное управление контентом: создание, редактирование и публикация
        материалов
      </p>

      <section className="controls">
        <button onClick={() => dispatch(fetchPosts())} className="btn btn-get">
          Получить посты
        </button>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-post">
          {showForm ? "Скрыть форму" : "Создать пост"}
        </button>
      </section>

      {error && (
        <div className="error-message">
          ❌ {error} <button onClick={handleCloseMessage}>×</button>
        </div>
      )}
      {successMessage && (
        <div className="success-message">
          ✅ {successMessage} <button onClick={handleCloseMessage}>×</button>
        </div>
      )}

      {showForm && (
        <section className="form-section">
          <h3>Создать пост</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Заголовок</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                placeholder="Введите заголовок"
              />
            </div>
            <div className="form-group">
              <label htmlFor="body">Содержимое</label>
              <textarea
                id="body"
                value={formData.body}
                onChange={(e) =>
                  setFormData({ ...formData, body: e.target.value })
                }
                required
                placeholder="Введите текст поста"
                rows={4}
              />
            </div>
            <div className="form-group">
              <label htmlFor="userId">ID пользователя</label>
              <input
                type="number"
                id="userId"
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: Number(e.target.value) })
                }
                min="1"
                max="10"
              />
            </div>
            <button type="submit" className="btn btn-submit">
              Создать
            </button>
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => setShowForm(false)}
            >
              Отмена
            </button>
          </form>
        </section>
      )}

      {loading && <div className="loader">Загрузка...</div>}
      {!loading && posts.length > 0 && (
        <div className="data-container">
          {posts.slice(0, 10).map((post) => (
            <DataCard
              key={post.id}
              title={post.title}
              meta={`ID: ${post.id} | Автор: ${post.userId}`}
            >
              {post.body}
            </DataCard>
          ))}
        </div>
      )}
    </section>
  );
};

const UsersSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, successMessage } = useSelector(
    (state: RootState) => state.api,
  );

  const handleCloseMessage = () => {
    dispatch(clearMessages());
  };

  return (
    <section className="api-section">
      <h2>Пользователи</h2>
      <p className="api-description">
        Каталог пользователей с подробной информацией и контактами
      </p>

      <section className="controls">
        <button onClick={() => dispatch(fetchUsers())} className="btn btn-get">
          Получить пользователей
        </button>
      </section>

      {error && (
        <div className="error-message">
          ❌ {error} <button onClick={handleCloseMessage}>×</button>
        </div>
      )}
      {successMessage && (
        <div className="success-message">
          ✅ {successMessage} <button onClick={handleCloseMessage}>×</button>
        </div>
      )}

      {loading && <div className="loader">Загрузка...</div>}
      {!loading && users.length > 0 && (
        <div className="data-container">
          {users.slice(0, 10).map((user) => (
            <DataCard
              key={user.id}
              title={user.name}
              meta={`ID: ${user.id} | Город: ${user.address.city}`}
            >
              <p>Email: {user.email}</p>
              <p>Телефон: {user.phone}</p>
            </DataCard>
          ))}
        </div>
      )}
    </section>
  );
};

const CommentsSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { comments, loading, error, successMessage } = useSelector(
    (state: RootState) => state.api,
  );

  const handleCloseMessage = () => {
    dispatch(clearMessages());
  };

  return (
    <section className="api-section">
      <h2>Комментарии</h2>
      <p className="api-description">
        Модерация отзывов: просмотр и управление комментариями
      </p>

      <section className="controls">
        <button
          onClick={() => dispatch(fetchComments())}
          className="btn btn-get"
        >
          Получить комментарии
        </button>
      </section>

      {error && (
        <div className="error-message">
          ❌ {error} <button onClick={handleCloseMessage}>×</button>
        </div>
      )}
      {successMessage && (
        <div className="success-message">
          ✅ {successMessage} <button onClick={handleCloseMessage}>×</button>
        </div>
      )}

      {loading && <div className="loader">Загрузка...</div>}
      {!loading && comments.length > 0 && (
        <div className="data-container">
          {comments.slice(0, 10).map((comment) => (
            <DataCard
              key={comment.id}
              title={comment.name}
              meta={`ID: ${comment.id} | Пост: ${comment.postId}`}
            >
              {comment.body}
            </DataCard>
          ))}
        </div>
      )}
    </section>
  );
};

const HomePage: React.FC = () => (
  <main className="main">
    <section className="hero">
      <h1>API Dashboard</h1>
      <p className="hero-description">
        Добро пожаловать в панель управления API. Выберите раздел для начала
        работы:
      </p>
      <div className="hero-buttons">
        <Link to="/posts" className="btn btn-primary">
          📌 Посты
        </Link>
        <Link to="/users" className="btn btn-primary">
          👥 Пользователи
        </Link>
        <Link to="/comments" className="btn btn-primary">
          💬 Комментарии
        </Link>
      </div>
    </section>

    <aside className="info-panel">
      <h3>📚 Информация об API</h3>
      <section>
        <h4>JSONPlaceholder</h4>
        <q>Бесплатный тестовый REST API для прототипирования</q>
        <p>Поддерживает все HTTP методы: GET, POST, PUT, PATCH, DELETE</p>
      </section>
    </aside>
  </main>
);

const PostsPage: React.FC = () => (
  <main className="main">
    <PostsSection />
  </main>
);

const UsersPage: React.FC = () => (
  <main className="main">
    <UsersSection />
  </main>
);

const CommentsPage: React.FC = () => (
  <main className="main">
    <CommentsSection />
  </main>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/comments" element={<CommentsPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
