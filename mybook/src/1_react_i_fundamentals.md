# React I

> What is React and some of its advantages.

-   React is a **Javascript library for creating user interfaces**.

-   React is all about **components**. Components are **idependent chunks
    of user interfaces** ,which can be pieced up together like lego
    blocks and as a result we will be able to create a complex app.

-   Components are **independent , isolated & resuable** and once they are ready they can
    be used anywhere. So if we want to change a logic in one of the components
    we have do it only in one place and all the instances where we are
    using it will be updated with the new logic.

-   Basically we can **update the logic of components without
    breaking our whole app** ,if we are making an app which is divided
    into multiple isolated components.

-   Under the hood React is very **fast** as it uses something called
    **Virtual DOM** which only updates the components which requires
    updating and without re-rendering our whole app.

### NPX

NPX will only execute the package and will not install the package
globally

### Popluar options to get setup ReactJS

-   Vite (Pronounced as Veet) [https://create-react-app.dev/docs/getting-started]
-   create-react-app [https://vitejs.dev/]

<b>Snippet to setup react with create-react-app</b>

Will craete a folder a named myapp

```sh
npx create-react-app myapp
cd myapp
npm audit fix --force
```

### What is webpack?

Webpack is a tool that helps developers bundle and manage their JavaScript code.
It takes all the different files (assets,scripts,iamges) and dependencies in a project and combines them into a single file,
making it easier to load and run in a web browser. It also optimizes the code by removing
any unnecessary parts.

### What is Babel?

Babel is a JavaScript compiler
Babel is a tool that helps developers write modern
JavaScript code and convert it into a version that can
be understood by older browsers.

### Babel vs Webpack

Babel helps with making modern JavaScript code compatible with older browsers,
while webpack is a tool for bundling and managing JavaScript code
for web development

### Folder Structure

-   **node_modules** : Contains all dependencies required by our app.
-   **public** : Contains static assests including index.html

         index.html
            - title
            - fonts
            - css
            - favicon
            - id="root" - our entire app

-   **src** : Contains all our javascript files . We do all our work here.
    Brain of our app.src/index.js is the JavaScript entry point.
-   **package.json** : Contains info about our projects like name,version,scripts,
    dependencies
-   **package.json.lock** : Contains a snapshot of our dependency tree. Automatically
    generated when installing or updating packages in a JavaScript project.
    It keeps track of the exact versions of all the dependencies
    installed in the project.

---

## React Fundamentals

**export vs export default**

| export (named export)                                            | export default                    |
| ---------------------------------------------------------------- | --------------------------------- |
| Can have muliple export in a single file                         | Can have only single              |
| Imported module should have the same name as the exported module | Imported module can have any name |

> Boiler Plate

-   Delete the src created and recreate the folder
-   Inside src create index.js (entrypoint of our react app)

**Rules for writing components**

-   Always start name with capital letter
-   Must return JSX element.
-   Must self close the component wherever you use it you use it. <br>
    Example : \<\/Hello\>

**What is JSX**

JSX stands for JavaScript XML.
JSX is a syntax extension for JavaScript that allows you to
write HTML-like code in your JavaScript files. It's used
in popular frameworks like React and Vue.js.
JSX code is transpiled into regular JavaScript
code before being executed by the browser.

**Rules for JSX**

-   **Must return one single parent element**. Either enclose the JSX
    return entire with inbuilt html tags or react Fragments.
    React Fragments helps us to let's us to group elements without
    adding extra node

    ```js
    // One way
    return <React.Fragment>...rest of the return</React.Fragment>;

    // Another way
    return <>...rest of the return</>;
    ```

-   **camelCase for defininig property names**

```js
return (
  <div tabIndex={1}>
    <button onClick={myFunction}>click me</button>
    <label htmlFor='name'>Name</label>
    <input readOnly={true} id='name' />
  </div>
)
// in html
<div tabindex="1">
    <button onclick="myFunction()">click me</button>
    <label for='name'>Name</label>
    <input readonly id='name' />
</div>
```

-   **Close every element**

Close every tag that does not even supports closing in HTML5

```js
return <img />;
// or
return <input />;
```

-   **Formatting**

Use () to enclose return statements when returning some
nested elements.We can ignore () when returning just 1
single element.

```js
function Hello() {
    return (
        <>
            <div className="someValue">
                <h3>hello world</h3>
                <ul>
                    <li>
                        <a href="#">hello world</a>
                    </li>
                </ul>
            </div>
            <h2>hello world</h2>
            <input type="text" name="" id="" />
        </>
    );
}
```

**Basic React APP**

> index.js

```js
import React from 'react';
import ReactDOM from 'react-dom/client';

const Hello = () => {
    return <h1>Hello World</h1>;
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Hello />);
```

**Create element in react**

> Using JSX is easier to read than using react's createElement

```js
import React from 'react';
import ReactDOM from 'react-dom/client';

// With JSX
const Hello = () => {
    return <h1>Hello</h1>;
};

// With React craete element
const Hello = () => {
    return React.createElement('h1', {}, 'Hello');
};

// Nested React createElement
const Hello = () => {
    return React.createElement(
        'div',
        {},
        React.createElement('h1', {}, 'Hello')
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Hello />);
```

---

### Simple Booklist App

-   **1. First Steps**

```js
import React from 'react';
import ReactDOM from 'react-dom/client';

// Booklist
const Booklist = () => {
    return (
        <>
            <Book />
            <Book />
            <Book />
        </>
    );
};

// Book
const Book = () => {
    return (
        <>
            <Image />
            <Title />
            <Author />
        </>
    );
};

// Items in Book
const Image = () => {
    return (
        <img
            src="https://m.media-amazon.com/images/I/51TrWpIwMfL.jpg"
            alt="IMG"
        />
    );
};

const Title = () => {
    return <h3>David Copperfield</h3>;
};

const Author = () => {
    return <p>Charles Dickens</p>;
};

// Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Booklist />);
```

-   **2. Adding CSS**

Create an index.css in src

> index.css

```css
/* Reset CSS */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family:
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        Oxygen,
        Ubuntu,
        Cantarell,
        'Open Sans',
        'Helvetica Neue',
        sans-serif;
    background: #f1f5f8;
    color: #222;
}

/* CSS */

.booklist {
    width: 90vw;
    max-width: 1170px;
    margin: 3rem 3rem;
    display: grid;
    gap: 2rem;
}

.book {
    background: #fff;
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
}
.book img {
    width: 100%;
    object-fit: cover;
}
.book h3 {
    margin-top: 1rem;
    font-size: 1rem;
}

/* Media Query */

@media screen and (min-width: 768px) {
    .booklist {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

> index.js

Import the css by mentioning the path at the top of js file

```js
import './index.css';
```

### Local Images

-   local images (public folder) - less performant

-   local images (src folder) - better solution for assets, since under the hood they get optimized.

Note :<b> Whenever using public folder images and writing an URL,
Imagine that u are in public folder and write the image path as
below.I Know its not logical why ./ is used but assume you are
in public folder.You can type in the browser the url
http://localhost:3000/images/\<imgname.ext\> and see the image will
appear that you have placed in the public/image folder.</b>

```js
const Image = () => (
    <img
        src="./images/book-1.jpg"
        alt="Interesting Facts For Curious Minds"
        alt="IMG"
    />
);
```

### JSX CSS

-   {} in JSX means going back to JS Land
-   value is an object with key/value pairs - capitalized and with ''
-   property names should be in camel case

> Example (Inline CSS)

```js
const Author = () => (
    <h4 style={{ color: '#617d98', fontSize: '0.75rem', marginTop: '0.5rem' }}>
        Jordan Moore
    </h4>
);
```

> Alternative option using variables

```js
const Author = () => {
    const inlineHeadingStyles = {
        color: '#617d98',
        fontSize: '0.75rem',
        marginTop: '0.5rem'
    };
    return <h4 style={inlineHeadingStyles}>Jordan Moore </h4>;
};
```

### JSX JS

-   {} in JSX means going back to JS Land
-   value inside must be an expression (return value), can't be a statement

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Booklist
const Booklist = () => {
    return (
        <section className="booklist">
            <Book />
            <Book />
            <Book />
        </section>
    );
};

// Book
const author = 'Charles Dickens'; // variable can be outside
const Book = () => {
    const title = 'David Copperfield'; // variable can be inside
    return (
        <article className="book">
            <img
                src="https://m.media-amazon.com/images/I/51TrWpIwMfL.jpg"
                alt="IMG"
            />
            <h3>{title}</h3>
            <p>{author.toUpperCase()}</p>
            {/* <p>{let x = 6}</p> */}
            <p>${6 + 6}</p>
        </article>
    );
};

// Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Booklist />);
```

### Props Basics

-   Props, short for properties, are a way to pass data from one component to another in React.
-   Props can be named anything like xyz

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const author = 'Charles Dickens';
const title = 'David Copperfield';
const img = 'https://m.media-amazon.com/images/I/51TrWpIwMfL.jpg';

// Booklist
const Booklist = () => {
    return (
        <section className="booklist">
            <Book img={img} title={title} author={author} />
            <Book img={img} title={title} author={author} />
        </section>
    );
};

// Book [Destructuring inside body]

const Book = (props) => {
    const { img, title, author } = props;
    return (
        <article className="book">
            <img src={img} alt={title} />
            <h3>{title}</h3>
            <p>{author.toUpperCase()}</p>
        </article>
    );
};

// Book [Destructuring in the parameter itself]
const Book = ({ img, title, author }) => {
    return (
        <article className="book">
            <img src={img} alt={title} />
            <h3>{title}</h3>
            <p>{author.toUpperCase()}</p>
        </article>
    );
};

// Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Booklist />);
```

### Children props

-   everything we render between component tags
-   mostly use it in Context API
-   special prop, has to be named "children"
-   can place anywhere in JSX

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const author = 'Charles Dickens';
const title = 'David Copperfield';
const img = 'https://m.media-amazon.com/images/I/51TrWpIwMfL.jpg';

// Booklist
const Booklist = () => {
    return (
        <section className="booklist">
            <Book img={img} title={title} author={author}>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Eligendi, repellat.
                </p>
                <button type="button">click me</button>
            </Book>
            <Book img={img} title={title} author={author} />
        </section>
    );
};

// Book
const Book = ({ img, title, author, children }) => {
    return (
        <article className="book">
            <img src={img} alt={title} />
            <h3>{title}</h3>
            <p>{author.toUpperCase()}</p>
            {children}
        </article>
    );
};

// Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Booklist />);
```

### Simple List

Note : **map - creates a new array from calling a function for every array element.** <br/>

Note: **Use Keyprop to assign unique value.The key prop in React is used to uniquely identify
each element in a list of elements that have the same type. This is necessary because React
needs a way to keep track of which elements have changed so that it can efficiently update the UI.**

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const data = [
    {
        author: 'Charles Dickens',
        title: 'David Copperfield',
        img: 'https://m.media-amazon.com/images/I/51TrWpIwMfL.jpg',
        id: 1
    },
    {
        author: 'Charles Dickens',
        title: 'Oliver Twist',
        img: 'https://m.media-amazon.com/images/I/81QGqaKWjXL._AC_UF1000,1000_QL80_.jpg',
        id: 2
    }
];

// const obj = {
//     author: 'Charles Dickens',
//     title: 'Oliver Twist',
//     img: 'https://m.media-amazon.com/images/I/81QGqaKWjXL._AC_UF1000,1000_QL80_.jpg'
// };

const Booklist = () => {
    return (
        <>
            <section className="booklist">
                {data.map(({ author, title, img }, index) => {
                    return (
                        <Book
                            author={author}
                            title={title}
                            img={img}
                            key={index}
                        />
                    );
                })}
            </section>
        </>
    );
};

const Book = (props) => {
    const { author, title, img } = props;
    return (
        <article className="book">
            <img src={img} alt={title} />
            <h3>{title}</h3>
            <p>{author}</p>
        </article>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Booklist />);
```

### Spread Operator

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const data = [
    {
        author: 'Charles Dickens',
        title: 'David Copperfield',
        img: 'https://m.media-amazon.com/images/I/51TrWpIwMfL.jpg',
        id: 1
    },
    {
        author: 'Charles Dickens',
        title: 'Oliver Twist',
        img: 'https://m.media-amazon.com/images/I/81QGqaKWjXL._AC_UF1000,1000_QL80_.jpg',
        id: 2
    }
];

const Booklist = () => {
    return (
        <>
            <section className="booklist">
                {data.map((book, index) => {
                    return <Book {...book} key={index} />;
                })}
            </section>
        </>
    );
};

const Book = (props) => {
    const { author, title, img } = props;
    return (
        <article className="book">
            <img src={img} alt={title} />
            <h3>{title}</h3>
            <p>{author}</p>
        </article>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Booklist />);
```

### Event Basics

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const Booklist = () => {
    return (
        <>
            <section className="booklist">
                <EventBasics />
            </section>
        </>
    );
};

// e can be any name , e signifies event , every event handler function (like onClick,onSubmit) has access to event object
const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submit');
    console.log(e);
};

const handleClick = (e) => {
    console.log('click');
};
const handleChange = (e) => {
    console.log('change');
    console.log(e);
    console.log(e.target.value);
    console.log(e.target.name);
};

// Arrow Functions too have access to event object
const EventBasics = () => {
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="txt" onChange={handleChange} />
            <br />
            <button
                type="button"
                onClick={(e) => {
                    console.log(e);
                }}
            >
                Submit
            </button>
        </form>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Booklist />);
```

### Prop Drilling

-   react data flow - can only pass props down from parent component to child
-   alternatives Context API, redux, other state libraries

### Drilling by passing a function down

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const data = [
    {
        author: 'Charles Dickens',
        title: 'David Copperfield',
        img: 'https://m.media-amazon.com/images/I/51TrWpIwMfL.jpg',
        id: 1
    },
    {
        author: 'Charles Dickens',
        title: 'Oliver Twist',
        img: 'https://m.media-amazon.com/images/I/81QGqaKWjXL._AC_UF1000,1000_QL80_.jpg',
        id: 2
    }
];

const Booklist = () => {
    const getBook = (id) => {
        const k = data.filter((item) => item.id == id);
        return k;
    };
    return (
        <>
            <section className="booklist">
                {data.map((book, index) => {
                    return (
                        <Book
                            newitem="sd"
                            {...book}
                            key={index}
                            getBook={getBook}
                        />
                    );
                })}
            </section>
        </>
    );
};

const Book = (props) => {
    // console.log(props);
    const { author, title, img, id, getBook } = props;
    return (
        <article className="book">
            <img src={img} alt={title} />
            <h3>{title}</h3>
            <p>{author}</p>
            <button
                type="button"
                onClick={() => {
                    console.log(getBook(id));
                }}
            >
                click
            </button>
        </article>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Booklist />);
```

### Local Images (src)

-   better performance because optimized

```js
import img1 from './images/book-1.jpg';
import img2 from './images/book-2.jpg';
import img3 from './images/book-3.jpg';
```

### Vite Setup

-   need to use .jsx extension
-   index.html in the source instead of public
-   assets still in public
-   instead of index.js, need to use main.jsx
-   to spin up dev server - "npm run dev"
-   rest the same - imports/exports, deployment, assets, etc...
