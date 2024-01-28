# React Router

### Install

```sh
npm install react-router-dom@6
```

### Basic Setup

> main.jsx

Wrap entire app with browser router

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
```

Create 2 simple Pages Home,About

> Home.jsx

```js
import React from 'react';

const Home = () => {
    return <div>Home</div>;
};

export default Home;
```

> About.jsx

```js
import React from 'react';

const About = () => {
    return <div>About</div>;
};

export default About;
```

> App.jsx

We use link because it will not refresh the pages.
If we use anchor tags it will refresh the pages.

Wrap Routes inside Route.
Use Route to define single route.

```js
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

const App = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </>
    );
};

export default App;
```

### Router Types

-   Hashrouter : Routes as #
-   unstable_HistoryRouter : Give direct acess to history
-   MemoryRouter: Used for testing.Stores history in memory.
-   StaticRouter : Does not allow to browse pages.

### Dynamic Routes

Create Booklist and Book Component
Goal is read the route paramete like :id.Example: "/abc/xyz/book/:id"

> App.jsx

```js
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Books from './pages/Books';
import Book from './pages/Book';

const App = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link to="/books">Books</Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/books" element={<Books />} />
                <Route path="/books/:id" element={<Book />} />
            </Routes>
        </>
    );
};

export default App;
```

> Books.jsx

```js
import React from 'react';
import { Link } from 'react-router-dom';

const Books = () => {
    return (
        <div>
            <h3>Book List</h3>
            <Link to="/books/1">book 1</Link>
            <br />
            <Link to="/books/2">book 2</Link>
            <br />
            <Link to="/books/3">book 3</Link>
            <br />
        </div>
    );
};

export default Books;
```

> Book.jsx

```js
import React from 'react';
import { useParams } from 'react-router-dom';

const Book = () => {
    const params = useParams();
    return <div>Book {params.id}</div>;
};

export default Book;
```

### Route Specificity

Suppose we have two routes "/books/:id" [1st] "/books/new" [2nd].
In previous version of react router dom what it would had done is gone
with the first match.But newer version will take the hardcoded value as
the possible route option.

> not found

```js
<Route path="*" element={<NotFound />} />
```

### Nesting

> App.jsx

Basic Nesting

```js
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Books from './pages/Books';
import Book from './pages/Book';
import Notfound from './pages/Notfound';

const App = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link to="/books">Books</Link>
                    </li>
                </ul>
            </nav>

            {/* Basic Nesting */}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/books">
                    <Route index element={<Books />} />
                    <Route path=":id" element={<Book />} />
                </Route>

                <Route path="*" element={<Notfound />} />
            </Routes>
        </>
    );
};

export default App;
```

### Basic Nesting by passing a layout in every children routes [shared layout]

> Layout.jsx

Outlet must be added otherwise the dom will painter only with layout's jsx.

```js
import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <h3>This layout is to be shared.</h3>
            <Outlet />
        </>
    );
};

export default Layout;
```

> App.jsx

```js
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Books from './pages/Books';
import Book from './pages/Book';
import Notfound from './pages/Notfound';
import Layout from './pages/Layout';

const App = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link to="/books">Books</Link>
                    </li>
                </ul>
            </nav>

            {/* Basic Nesting */}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/books" element={<Layout />}>
                    <Route index element={<Books />} />
                    <Route path=":id" element={<Book />} />
                </Route>

                <Route path="*" element={<Notfound />} />
            </Routes>
        </>
    );
};

export default App;
```

### Outlet context

> Layout.jsx

Outlet can be used to pass context

```js
import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <h3>This layout is to be shared.</h3>
            <Outlet context={{ hello: 'world', name: 'john' }} />
        </>
    );
};

export default Layout;
```

> Books.jsx

Go to any child route adn access the context value with useContext

```js
import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';

const Books = () => {
    const val = useOutletContext();
    console.log(val);
    return (
        <div>
            <h3>Book List</h3>
            <Link to="/books/1">book 1</Link>
            <br />
            <Link to="/books/2">book 2</Link>
            <br />
            <Link to="/books/3">book 3</Link>
            <br />
        </div>
    );
};

export default Books;
```

### Routes in a seperate file

> BookRoutes.jsx

```js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Books from './pages/Books';
import Book from './pages/Book';
import Layout from './pages/Layout';

const BookRoutes = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Books />} />
                <Route path=":id" element={<Book />} />
            </Route>
        </Routes>
    );
};

export default BookRoutes;
```

> App.jsx

```js
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Notfound from './pages/Notfound';
import BookRoutes from './BookRoutes';

const App = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link to="/books">Books</Link>
                    </li>
                </ul>
            </nav>

            {/* Basic Nesting */}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/books/*" element={<BookRoutes />} />
                <Route path="*" element={<Notfound />} />
            </Routes>
        </>
    );
};

export default App;
```

### useRoute

We can use Js instead to define routes

## Handling Navigation

In NavLink , Link ,Navigate

-   replace (replace last visited page with current page),
-   reloadDocument (referesh the entirepage)

## NavLink

By deafult adds class of active

```js
<NavLink
    to="/"
    style={({ isActive }) => ({ color: isActive ? 'red' : 'black' })}
>
    {({ isActive }) => {
        return isActive ? 'Active Home' : 'Home';
    }}
</NavLink>
```

## Navigate

navigate with a component

```js
<Navigate to="/" />
```

## useNavigate

navigate with a hook

```js
const navigate = useNavigate();

unction onSubmit() {
  // Submit form results
  navigate("/books", { replace: true, state: { bookName: "Fake Title" } })
}
```

## Search Params

Access searchparams

```js
import React from 'react';
import { Link, useOutletContext, useSearchParams } from 'react-router-dom';

const Books = () => {
    const val = useOutletContext();

    // Get search parameters
    const [searchparams, setSearchParams] = useSearchParams();
    console.log(searchparams.get('q'));

    // setSearchParams({ n: e.target.value })

    console.log(val);
    return (
        <div>
            <h3>Book List</h3>
            <Link to="/books/1">book 1</Link>
            <br />
            <Link to="/books/2">book 2</Link>
            <br />
            <Link to="/books/3">book 3</Link>
            <br />
        </div>
    );
};

export default Books;
```

## useLocation

access state data passed from another route

```js
const location = useLocation();
```
