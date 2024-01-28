# React Hooks

**Basic Hooks**

## useState

**Note : State updates are not immediate.**

> Problem

```js
import React from 'react';
import { useState } from 'react';

const App = () => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        // You may think on every click the value will increase by
        // 3. But it will not because the setCount function is still
        // using the old values of count.In react we need to use the
        // updater function in useState to grab the latest value.

        setCount(count + 1);
        setCount(count + 1);
        setCount(count + 1);
    };

    return (
        <>
            <div>
                <h3>{count}</h3>
                <button type="button" onClick={handleClick}>
                    Increase
                </button>
            </div>
        </>
    );
};

export default App;
```

> Fix

```js
import React from 'react';
import { useState } from 'react';

const App = () => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        // You may think on every click the value will increase by
        // 3. But it will not because the setCount function is still
        // using the old values of count.In react we need to use the
        // updater function in useState to grab the latest value.

        setCount((prev) => prev + 1);
        setCount((prev) => prev + 1);
        setCount((prev) => prev + 1);
    };

    return (
        <>
            <div>
                <h3>{count}</h3>
                <button type="button" onClick={handleClick}>
                    Increase
                </button>
            </div>
        </>
    );
};

export default App;
```

> Dynamic object Keys form

```js
import React from 'react';
import { useState } from 'react';

const App = () => {
    const [data, setData] = useState({ name: '', email: '' });
    const handleChange = (e) => {
        setData((data) => {
            return { ...data, [e.target.name]: e.target.value };
        });
    };
    return (
        <div>
            <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
            />
            <input
                type="text"
                name="email"
                value={data.email}
                onChange={handleChange}
            />
        </div>
    );
};

export default App;
```

## useEffect

**Component Mount/Unmount**

-   useEffect gets triggered after the page/component in which it is in is rendered.
-   useEffect cleanup function gets triggered after the component which it is in is unmounted.

> App.jsx

```js
import React from 'react';
import { useState } from 'react';
import Hello from './Hello';

const App = () => {
    const [showhello, setShowhello] = useState(false);
    return (
        <>
            {console.log('App rendered!')}
            {showhello ? <Hello /> : ''}
            <button
                type="button"
                onClick={() => {
                    setShowhello(!showhello);
                }}
            >
                CLick
            </button>
            <div>
                <h3>App</h3>
            </div>
        </>
    );
};

export default App;
```

> Hello.jsx

```js
import React, { useEffect } from 'react';

const Hello = () => {
    useEffect(() => {
        console.log(
            'Hello component useEffect is triggered after page has re-rendered!'
        );
        return () => {
            console.log('Unmounted hello!');
        };
    });

    return (
        <>
            {console.log('Render hello!')}
            <h3>hello</h3>
        </>
    );
};

export default Hello;
```

**Event Listeners in useEffect**

Use of cleanup functions.

-   Must cancel the previous event Listeners,otherwise when the component gets
    re-rendered we are going to have multiple event-listeners.

> App.jsx [Problem and Fix 1]

```js
import React, { useEffect } from 'react';
import { useState } from 'react';
import Hello from './Hello';

const App = () => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        // Main
        console.log(
            'This will run after we have painted the DOM with the below JSX'
        );

        // Cleanup [Apprender->cleanup(if any)->Trigger useEffect main]
        return () => {
            console.log('This will run to cancel previous useEffects if any!');
        };
    });
    return (
        <>
            {console.log('App rendered!')}
            {count}
            <button
                type="button"
                onClick={() => {
                    setCount((prev) => prev + 1);
                }}
            >
                Click
            </button>
            <div>
                <h3>App</h3>
            </div>
        </>
    );
};

export default App;
```

> App.jsx [Problem and Fix 2]

```js
import React, { useEffect } from 'react';
import { useState } from 'react';

const App = () => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        // Main
        const fn = () => {
            console.log('Mouse moved!');
        };

        window.addEventListener('mousemove', fn);

        // Cleanup [Apprender->cleanup(if any)->Trigger useEffect main]
        // Going tosave the refrence of function fn of previous useEffect as fn get re-created from scratch
        return () => {
            window.removeEventListener('mousemove', fn);
        };
    });
    return (
        <>
            {console.log('App rendered!')}
            {count}
            <button
                type="button"
                onClick={() => {
                    setCount((prev) => prev + 1);
                }}
            >
                Click
            </button>
            <div>
                <h3>App</h3>
            </div>
        </>
    );
};

export default App;
```

**Fetch Function with useEffect using custom hooks**

Some note :

-   Custom Hooks can have any arbitary name. Good Convention is
    to give the "use" prefix to make the developer understand its
    a hook.It is not a mandatory thing.

*   UseEffect only runs after dom is painted
*   Use Dependency array wisely.Below by adding count useEffect is triggerd when value of count changes.
*   2 phases for a custom default value return phase and value return phase

> App.jsx

```js
import React, { useState } from 'react';
import customhook from './customhook';

const App = () => {
    const [count, setCount] = useState(0);
    const { data, isLoading, isErr } = customhook(count);

    if (isLoading) {
        console.log('Loading renderd!');
        return <div>Loading....</div>;
    }
    if (isErr) {
        return <div>Error....</div>;
    }

    return (
        <div>
            {console.log('App renderd!')}
            <h3>Count : {count}</h3>
            <div>
                <button
                    type="button"
                    onClick={() => {
                        setCount((prev) => prev + 1);
                    }}
                >
                    Click
                </button>
            </div>
            {data}
        </div>
    );
};

export default App;
```

> customhook.jsx

```js
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const customhook = (count) => {
    const [result, setResult] = useState({
        data: [],
        isLoading: true,
        isErr: false
    });

    useEffect(() => {
        const fetchData = async () => {
            console.log('customhook effect triggered!');

            try {
                const data = await fetch(
                    `http://numbersapi.com/${count}/trivia`
                );
                const res = await data.text();
                setResult((data) => {
                    return {
                        ...data,
                        isLoading: false,
                        isErr: false,
                        data: res
                    };
                });
            } catch (err) {
                setResult((data) => {
                    return {
                        ...data,
                        isLoading: false,
                        isErr: true
                    };
                });
            }
        };
        fetchData();
    }, [count]);

    console.log('customhook renderd!');
    return result;
};

export default customhook;
```

## useRef

> Does not trigger re-render and persist the value across multiple re-renders

-   Keep track of times component re-renderd
-   Used in forms

Note: on adding fetchData function in the above codes Dependency array
,it will cause and infinte loop.We can use useRef to strore the reference
of the function , so on re-render the function does not gets created from
scratch.

> Fix liniting errors

```js
import React from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const customhook = (count) => {
    const [result, setResult] = useState({
        data: [],
        isLoading: true,
        isErr: false
    });

    // An object with current variable
    // Get created with the first ct value during initial render , so thats wht ct is passed as an argument
    // Can be done with useState too but a function must be returned from a function, state is initialized during first render.

    const fetchData = useRef(async (ct) => {
        console.log('customhook effect triggered!');

        try {
            const data = await fetch(`http://numbersapi.com/${ct}/trivia`);
            const res = await data.text();
            setResult((data) => {
                return {
                    ...data,
                    isLoading: false,
                    isErr: false,
                    data: res
                };
            });
        } catch (err) {
            setResult((data) => {
                return {
                    ...data,
                    isLoading: false,
                    isErr: true
                };
            });
        }
    });

    useEffect(() => {
        // fetchData();
        fetchData.current(count);
    }, [fetchData.current, count]);

    console.log('customhook renderd!');
    return result;
};

export default customhook;
```

> Form example

```js
import React, { useRef } from 'react';

const App = () => {
    const rf = useRef(null);
    return (
        <div>
            <input
                type="text"
                name="name"
                ref={rf}
                onChange={() => {
                    console.log(rf.current.value);
                }}
            />
        </div>
    );
};

export default App;
```

**Performance Hooks**

## React.memo

In react a child component will re-render if its parent component re-renders,
even if the child components props have not changed.So this can lead to
performace degradation if we have many child components in our app,so
to fix it we can use Reacts memo to tell the component only to re-render when
its props change.But when child component re-renders parent does not re-render,but
the childs child component re-renders.

### A problem where child component re-renders even if its props dont change beacuse its parent component re-renders

> Problem

> App.jsx

```js
import React, { useState } from 'react';
import List from './List';

const data = [
    { id: 1, name: 'Jack' },
    { id: 2, name: 'Joe' }
];

const App = () => {
    const [count, setCount] = useState(0);
    return (
        <div>
            <h3>Count : {count}</h3>
            <button
                type="button"
                onClick={() => {
                    setCount((prev) => prev + 1);
                }}
            >
                Click
            </button>
            <List people={data} />
        </div>
    );
};

export default App;
```

> List.jsx

```js
import React from 'react';
import Person from './Person';
const List = ({ people }) => {
    return (
        <div>
            {people.map((person) => {
                return <Person key={person.id} {...person} />;
            })}
        </div>
    );
};
export default List;
```

> Person.jsx

```js
const Person = ({ name }) => {
    return (
        <div>
            <h4>{name}</h4>
        </div>
    );
};
export default Person;
```

> Fix

Move the counter to a seperate component.So that component becomes
a child component of App.jsx when attached to App.jsx.So when counter
renders then the counter and all its child component of counter will re-renders
not app.jsx.

### Add react.memo() will only re-render a component if its props have changed

```js
import React, { useState } from 'react';
import Person from './Person';
const List = ({ people }) => {
    return (
        <div>
            {people.map((person) => {
                return <Person key={person.id} {...person} />;
            })}
        </div>
    );
};
export default React.memo(List);
```

## useCallback

> Cache a functions reference so that its does not gets created from scratch and its
> refrence change

Tip : Either use Dependency array or set state updater function if want to use latest value of a state.

> App.jsx

```js
import React, { useCallback, useState } from 'react';
import List from './List';

const data = [
    { id: 1, name: 'Jack' },
    { id: 2, name: 'Joe' },
    { id: 3, name: 'Jay' },
    { id: 4, name: 'Jase' }
];

const App = () => {
    const [count, setCount] = useState(0);
    const [res, setRes] = useState(data);

    const removePerson = useCallback(
        (id) => {
            // Still going to use the value of res it was first created on initial render
            const data = res.filter((p) => p.id != id);
            setRes(data);

            // Way 1
            // setRes((prev) => {
            //     return prev.filter((p) => p.id != id);
            // });

            // Way 2
        },
        [res]
    );

    return (
        <div>
            <h3>Count : {count}</h3>
            <button
                type="button"
                onClick={() => {
                    setCount((prev) => prev + 1);
                }}
            >
                Click
            </button>
            <List people={res} removePerson={removePerson} />
        </div>
    );
};

export default App;
```

> List.jsx

```js
import React, { useState } from 'react';
import Person from './Person';
const List = ({ people, removePerson }) => {
    return (
        <div>
            {people.map((person) => {
                return (
                    <Person
                        key={person.id}
                        {...person}
                        removePerson={removePerson}
                    />
                );
            })}
        </div>
    );
};
export default React.memo(List);
```

> Person.jsx

```js
const Person = ({ name, id, removePerson }) => {
    return (
        <div>
            <button
                type="button"
                onClick={() => {
                    removePerson(id);
                }}
            >
                Remove
            </button>
            <h4>{name}</h4>
        </div>
    );
};
export default Person;
```

## useMemo

> Cache a single value which takes a long time to compute

```js
import React, { useMemo, useState } from 'react';
import { slow } from './slowfunc';

const data = [
    { id: 1, name: 'Jack' },
    { id: 2, name: 'Joe' },
    { id: 3, name: 'Jay' },
    { id: 4, name: 'Jase' }
];

const App = () => {
    const [count, setCount] = useState(0);

    // Will be run only on first reder

    const val = useMemo(() => slow(), []);
    console.log(val);

    return (
        <div>
            <h3>Count : {count}</h3>
            <button
                type="button"
                onClick={() => {
                    setCount((prev) => prev + 1);
                }}
            >
                Click
            </button>
        </div>
    );
};

export default App;
```

**Useful Hooks**

## useContext (Context API)

> main.jsx

```js
import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

export const userctx = createContext(null);
ReactDOM.createRoot(document.getElementById('root')).render(
    <userctx.Provider value={{ name: 'sdas', id: 1 }}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </userctx.Provider>
);
```

> About.jsx

```js
import React, { useContext } from 'react';
import { userctx } from '../main';

const About = () => {
    const val = useContext(userctx);
    console.log(val);
    return <div>About</div>;
};

export default About;
```
