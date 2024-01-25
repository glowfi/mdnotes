# React II

**Note : When a state value changes in a React component, the component will
re-render to reflect the new changes. This includes both unmounting
and mounting the component.**

### React Hooks

#### useState

It returns an array with 2 elements first element is the current
state value and second element is the function to update the state.

State is used to store and manage data that can change over time,
such as user input, API responses, or the current state of a component.

Note : **We need to use state to trigger re-render ,otherwise
suppose we are doing the samething using pure js we had to
come up with our own logic to trigger re-render.**

> Triggering re-render manually using vanilla js

```js
const App = () => {
    let count = 0;

    const handleClick = () => {
        count += 1;
        console.log(count);
        let k = document.getElementById('changeme');
        k.innerHTML = `${count}`;
    };
    return (
        <>
            <h1 id="changeme">{count}</h1>
            <button type="button" onClick={handleClick}>
                click
            </button>
        </>
    );
};

export default App;
```

> Basic useState example using counter

```js
import { useState } from 'react';

const App = () => {
    const [count, setCount] = useState(0);
    const handleClick = () => {
        // We trigger re-render on updates and value is preserved
        setCount((c) => c + 1); // Can pass any values and any name
    };

    return (
        <>
            <h1>{count}</h1>
            <button type="button" onClick={handleClick}>
                click
            </button>
        </>
    );
};

export default App;
```

**Intial render and re-render**

-   In a React application, the initial render is the first
    time that the component tree is rendered to the DOM. It
    happens when the application first loads, or when the root
    component is first rendered. This is also known as
    "mounting" the components.

-   Re-renders, on the other hand, happen when the component's
    state or props change, and the component needs to be
    updated in the DOM to reflect these changes. React uses a
    virtual DOM to optimize the process of updating the actual
    DOM, so that only the necessary changes are made.

There are a few ways that you can trigger a re-render in a
React component:

-   By changing the component's state or props. When the
    component's state or props change, React will re-render
    the component to reflect these changes.

-   When the parent element re-renders, even if the
    component's state or props have not changed.

**Hooks rules**

-   **starts with "use" (both custom and react inbuilt hooks)**
-   **must be invoked inside a component**
-   **dont call hooks conditionally**
-   **set function do not update immediately. Do not expect synchronous behaviour.**
    **use the count function above log the value in handleClick function to verify.**

> Basic array clearAll and clearOne example with useState

```js
import { useState } from 'react';

const App = () => {
    const data = [
        { name: 'abc', id: 1 },
        { name: 'def', id: 2 },
        { name: 'hello', id: 3 }
    ];
    const [people, setPeople] = useState(data);

    const clearAll = () => {
        setPeople([]);
    };
    const clearOne = (id) => {
        const newData = people.filter((p) => {
            return p.id != id;
        });

        setPeople(newData);
    };

    return (
        <>
            {people.map(({ name, id }, idx) => {
                return (
                    <div key={id}>
                        <h1>{name}</h1>
                        <button
                            type="button"
                            onClick={() => {
                                clearOne(id);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                );
            })}
            <br />
            <button type="button" onClick={clearAll}>
                Delete all
            </button>
        </>
    );
};

export default App;
```

#### Automatic Batching

In React, "batching" refers to the process of grouping
multiple state updates into a single update. This can be
useful in certain cases because it allows React to
optimize the rendering of your components by minimizing
the number of DOM updates that it has to perform.

By default, React uses a technique called "auto-batching"
to group state updates that occur within the same event
loop into a single update. This means that if you call the
state update function multiple times in a short period of
time, React will only perform a single re-render for all
of the updates.

React v18 ensures that state updates invoked from any
location will be batched by default. This will batch state
updates, including native event handlers, asynchronous
operations, timeouts, and intervals.

#### Cyclic behaviour with objects

```js
import { useState } from 'react';

const App = () => {
    const data = [
        { name: 'abc', id: 1 },
        { name: 'def', id: 2 },
        { name: 'hello', id: 3 }
    ];
    const [idx, setIdx] = useState(0);
    const [people, setPeople] = useState(data[idx]);

    const length = data.length;

    return (
        <div>
            <h1>{people.name}</h1>
            <button
                type="button"
                onClick={() => {
                    let newIdx = (idx + 1) % length;
                    setIdx(newIdx);
                    setPeople(data[newIdx]);
                }}
            >
                Show {data[(idx + 1) % length].name}
            </button>
        </div>
    );
};

export default App;
```

#### Getting old values

-   By default react will grab old values and increase it by 1 in
    the setTimeout function. Because in the 3 seconds timespan the
    setvalue function is still referencing the old value i.e. 0
    so to fix it we use a callback.We typically use this callback
    if we have some functionality which dependes on latest value.
    To simulate that synchronous beahviour we do as it is below.
    To preserve the value we use the callback , the value does not
    gets preserved if no callback is used.

*   The reason why in your code the log function logs an outdated value is
    because of closure - the count value is a const, and it is set when
    the component is first rendered. So when you click the button, the value
    of count is not the new value, but the one it was when it was
    first rendered (i.e. -> always going to be one less than you expect).

**[When inside function it will have the same value as it had in its first render]**<br/>
**Refer closures**
[Issue](https://github.com/facebook/react/issues/14010)

-   In this code, log happens on every re-render. Since clicking the button
    calls setCount, the state changes, and a re-render occurs. When that
    happens, the log is executed, and you get the latest value

**React hooks do not update value immediately**

React hooks do not update values immediately because of the way they are designed
to work. When a state value is updated using hooks, React schedules a
re-render of the component. During this re-render, the updated value
is applied to the component and any subsequent code that
relies on the updated value is executed.
If you need to perform some action immediately after a state update,
you can use the useEffect hook to run side effects after the
component has rendered with the updated values.

> fixed

```js
import { useState, useEffect } from 'react';

const App = () => {
    const [count, setCount] = useState(0);
    const handleCLick = () => {
        setCount((oldval) => oldval + 1); // this will work and get the latest value
        console.log(count); // will not work still
    };
    console.log(count); // will work
    return (
        <>
            <div>
                <h1>{count}</h1>
                <button type="button" onClick={handleCLick}>
                    click
                </button>
            </div>
        </>
    );
};

export default App;
```

> Example with setTimeout

```js
import { useState } from 'react';

const App = () => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setTimeout(() => {
            // will reference old value
            // setCount(count + 1);

            // will reference latest value and preserve value between renders
            // must use return statement
            setCount(oldval =>
                oldval + 1;
            );
        }, 3000);
    };

    return (
        <>
            <h1>{count}</h1>
            <button type="button" onClick={handleClick}>
                click
            </button>
        </>
    );
};

export default App;
```

#### useEffect

useEffect is a hook in React that allows you to perform side
effects in function components.There is no need for urban
dictionary - basically any work outside of the component. Some

Its a way of telling react what to do on component re-render.
Perform side-effects i.e actions that occur outside the DOM.
examples of side effects are: subscriptions, fetching data,
directly updating the DOM, re-registering and de-registering
event listeners, timers, etc.

Note : **If you a noramal JS function and calling it inside a component
it will re-run after every re-render**

```js
import { useState, useEffect } from 'react';

const App = () => {
    const [count, setCount] = useState(0);
    const handleCLick = () => {
        setCount((oldval) => oldval + 1);
        console.log(count);
    };

    const hello = () => {
        console.log('hello');
        //setCount(count + 1); // cause inifinite re-reender
    };

    // will get called after re-renders
    hello();

    return (
        <>
            <div>
                <h1>{count}</h1>
                <button type="button" onClick={handleCLick}>
                    click
                </button>
            </div>
        </>
    );
};

export default App;
```

-   accepts two arguments (second optional)
-   first argument - callback function
-   second argument — dependency array
-   **by default runs on each render (initial and re-render)
    cb can't return promise (so can't make it async)**
-   **dont make the callback of useEffect async ever**
-   if dependency array empty [I runs only on initial render]

> Why use it

useEffect is used in React to perform side effects in functional components. Side effects
are actions that occur outside of the component, such as fetching data from
an API, subscribing to events, or manipulating the DOM.

The useEffect hook allows you to specify a function that will be
executed after every render of the component. This function can perform any
necessary side effects. It can also return a cleanup function that will be
executed before the component is unmounted or before the next render.

By using useEffect, you can ensure that side effects are only performed when
necessary and avoid unnecessary re-renders. It helps to keep the component's
logic organized and separate from the rendering logic.

> Why useEffect runs twice {You will see this behaviour while fetching and logging data from API}?

-   component appears more than once in a page
-   somehting higher up the tree is unmounting and remounting
-   reaact strictmode is on

> useEffect fetch data from an API

```js
import { useState, useEffect } from 'react';

const App = () => {
    const URL = 'https://api.github.com/users';
    const [people, setPeople] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const data = await fetch(URL);
            const resp = await data.json();
            return resp;
        };

        getData().then((data) => {
            console.log(data);
            setPeople(data);
        });
    }, []);

    return (
        <>
            <div>
                {people.map(({ login, avatar_url }, idx) => {
                    return (
                        <div key={idx}>
                            <img src={avatar_url} alt={login} width={'100px'} />
                            <h1 key={idx}>{login}</h1>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default App;
```

### Multiple returns

```js
import { useEffect, useState } from 'react';

const App = () => {
    const URL = 'https://api.github.com/users/QuincyLarson';
    const [iserror, setisError] = useState(false);
    const [isloading, setisLoading] = useState(true);
    const [people, setPeople] = useState([]);

    // Making Useeffect run on initial render only otherwise it will keep hitting the api on each re-render
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(URL);
                const json = await response.json();
                console.log(response);

                // By default fetch api does not take HTTP code in range of 4xx-5xx as errors
                // Instead it considers status code to be indicative of success
                if (!response.ok) {
                    setisLoading(false);
                    setisError(true);
                    return;
                }
                setPeople(json);
                setisLoading(false);
            } catch (err) {
                setisError(true);
                setisLoading(false);
            }
        };

        getData();
    }, []);

    // If is loading show loading

    if (isloading) {
        return (
            <>
                <h1>Loading ...</h1>
            </>
        );
    }

    // If Error show error

    if (iserror) {
        return (
            <>
                <h1>Error</h1>
            </>
        );
    }

    // show data

    return (
        <>
            <h1>{JSON.stringify(people, null, 8)}</h1>
        </>
    );
};

export default App;
```

### Order matters

-   Order matters : We should not destructure any user properties
    before getting the results.

-   Use optional chaining to spit back an empty value if not present

### Location of fetch function

if we are placing the fetch function outside the Useeffect
don not place the fetch function name into the dependency
array because on re-render fetch function will be recreated
and we will encounter an inifinite loop.

### Toggling a component using ternary operator

```js
import { useState } from 'react';

const Hello = () => {
    return <h1>Hello</h1>;
};

const App = () => {
    const [isvisible, setIsvisible] = useState(false);
    return (
        <>
            {isvisible ? <Hello /> : ''}
            <button
                type="button"
                onClick={() => {
                    setIsvisible(!isvisible);
                }}
            >
                click
            </button>
        </>
    );
};

export default App;
```

### login logout with ternary

```js
import { useState } from 'react';

const App = () => {
    const [user, setUser] = useState(null);
    return (
        <>
            {user ? (
                <Loggedin {...user} setUser={setUser} />
            ) : (
                <Loggedout setUser={setUser} />
            )}
        </>
    );
};

const Loggedin = ({ name, setUser }) => {
    return (
        <>
            <button
                type="button"
                onClick={() => {
                    setUser(null);
                }}
            >
                Logout
            </button>
            <h1>Hello {name}</h1>
        </>
    );
};

const Loggedout = ({ setUser }) => {
    return (
        <>
            <button
                type="button"
                onClick={() => {
                    setUser({ name: 'johndoe' });
                }}
            >
                Login
            </button>
            <h1>Logged out</h1>
        </>
    );
};

export default App;
```

### Cleanup Function

In the below code since we are re-rendering the component conditionally
what we are doing is we are mounting and unmounting the component.One
thing to note is that useEffect runs on inital render and on every
re-render.But in the below code we have setup useEffect to run
on inital load but since we are **Toggling the component conditionally
we are repeating the initial render process everytime we specially mount,
as a result useEffect will executed**.

> Example showing useEffect will run on remounting the components as it repeats the initial re-render process

```js
import { useEffect, useState } from 'react';

const Hello = () => {
    // will run everytime we remount the component as its the initial render
    useEffect(() => {
        console.log('useefect ran..');
    }, []);
    return <h3>hello</h3>;
};

const App = () => {
    const [toggle, setisToggled] = useState(false);
    return (
        <>
            {toggle ? <Hello /> : ''}
            <button
                type="button"
                onClick={() => {
                    setisToggled(!toggle);
                }}
            >
                toggle
            </button>
        </>
    );
};

export default App;
```

### Cleanup function setInterval example to tun somehting on mount and unmount

```js
import { useEffect, useState } from 'react';

const Hello = () => {
    // Do not make the useEffect callback async as it expects only a function to reurn in our case its cleanup function
    useEffect(() => {
        // will run on component mount
        const id = setInterval(() => {
            console.log('useefect ran..');
        }, 1000);

        // will run on component unmount
        return () => {
            console.log('cleanup');
            clearInterval(id);
        };
    }, []);
    return <h3>hello</h3>;
};

const App = () => {
    const [toggle, setisToggled] = useState(false);
    console.log('render');
    return (
        <>
            {toggle ? <Hello /> : ''}
            <button
                type="button"
                onClick={() => {
                    setisToggled(!toggle);
                }}
            >
                toggle
            </button>
        </>
    );
};

export default App;
```

#### Folder structure and named export

When working with react we can use index.js to group export all components needed

```
   Navbar (Folder)
      - index.css
      - index.js -> [import first from first;import second from second ]and then [export {first,second}]
      - first component
      - second component
```

Now from App.jsx we just now import components like<br/>
`import {first,second} from ./Navbar`<br/>
No need to mention any file name as index.js is entrypoint

#### Leverage everything known till now

> List.jsx [Iterates over all People]

```js
import React from 'react';
import Person from './Person';

const List = (props) => {
    const { data } = props;
    return (
        <div>
            {data.map((p, idx) => {
                return (
                    <div key={idx}>
                        <Person {...p} />
                    </div>
                );
            })}
        </div>
    );
};

export default List;
```

> Person.jsx [Component to show only one person and details like name]

Uses optional chaining

```js
import React from 'react';

const Person = (props) => {
    // const { name, nickName } = props;
    const { level } = props;
    // const lev = level && level[0] && level[0].count;
    const lev = level?.[0].count || 0;

    return (
        <div style={{ border: '2px solid black' }}>
            <h1> {props.name}</h1>
            <p> {props.nickName}</p>
            <p> {lev}</p>
        </div>
    );
};

export default Person;
```

> App.jsx [Show the list]

```js
import List from './List';

const data = [
    { id: 1, name: 'bob', nickName: 'Stud Muffin' },
    { id: 2, name: 'peter', nickName: 'Hello World', level: [{ count: 3 }] }
];

const App = () => {
    return (
        <>
            <List data={data} />
        </>
    );
};

export default App;
```

### Controlled Input

> App.jsx [Displays the form and previous list of people]

```js
import { useState } from 'react';
import List from './List';

const data = [
    { id: 1, name: 'bob', nickName: 'Stud Muffin' },
    { id: 2, name: 'peter', nickName: 'Hello World', level: [{ count: 3 }] }
];

const ControlledInput = ({ setPeople, people }) => {
    const [name, setName] = useState('');
    const [nickName, setNickname] = useState('');
    return (
        <>
            <form>
                <div>
                    <p>Name</p>
                    <input
                        type="text"
                        name=""
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <p>nickName</p>
                    <input
                        type="text"
                        name=""
                        value={nickName}
                        onChange={(e) => {
                            setNickname(e.target.value);
                        }}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => {
                        console.log(name);
                        console.log(nickName);
                        setPeople((people) => {
                            return [
                                ...people,
                                {
                                    name: name,
                                    nickName: nickName,
                                    id: new Date()
                                }
                            ];
                        });
                    }}
                >
                    SUbmit
                </button>
            </form>
        </>
    );
};

const App = () => {
    const [people, setPeople] = useState(data);
    return (
        <>
            <ControlledInput setPeople={setPeople} people={people} />
            <List data={people} setPeople={setPeople} people={people} />
        </>
    );
};

export default App;
```

> List.jsx [Iterates over all people]

```js
import React from 'react';
import Person from './Person';

const List = (props) => {
    const { data, setPeople, people } = props;
    return (
        <div>
            {data.map((p, idx) => {
                return (
                    <div key={idx}>
                        <Person {...p} setPeople={setPeople} people={people} />
                    </div>
                );
            })}
        </div>
    );
};

export default List;
```

> People.jsx [Remove functionality on click based on id]

```js
import React from 'react';

const Person = (props) => {
    // const { name, nickName } = props;
    const { level, setPeople, people, id } = props;
    // const lev = level && level[0] && level[0].count;
    const lev = level?.[0].count || 0;

    const handleRemove = () => {
        // const newData = people.filter((p) => p.id != id);
        const newData = people.filter((p) => {
            if (id != p.id) {
                return p;
            }
        });
        setPeople(newData);
    };

    return (
        <div style={{ border: '2px solid black' }}>
            <h1> {props.name}</h1>
            <p> {props.nickName}</p>
            <p> {lev}</p>
            <button type="button" onClick={handleRemove}>
                Remove
            </button>
        </div>
    );
};

export default Person;
```

### Multiple inputs

For multiple inputs use square bracket notation to use the Javascript's
inbuilt dynamic object key feature.

### Checkbox

To access checkbox make checked = the state value and
onChange make the e.target.checked = current state value

### Select statement example

```js
<select
    value={val}
    onChange={(e) => {
        console.log(e.target.value);
    }}
>
    <option>1</option>
    <option>2</option>
</select>
```

### Form Data API

> Difference b/w e.target & e.currentTarget

-   **e.target** refers to the element that triggered the event,<br/>
-   **e.currentTarget** refers to the element that the event listener is attached to.

```js
const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // get values one by one
    const name = formData.get('name');
    console.log(name);

    // get all of them
    const newUser = Object.fromEntries(formData);

    // do something (post request, add to list, etc)
    console.log(newUser);

    // Gotcha - re-render won't clear out the values
    setValue(value + 1);
    // reset values
    e.currentTarget.reset();
};
```

#### useRef

useRef is a hook in React that allows you to create a
reference to a DOM element or a value that persists
across re-renders.

It returns a mutable ref object which contains the reference
to a particular element or value in a react component . We
can use this to modify or read the value.

It can be used to access and modify the properties of
a DOM element, store a value that needs to be
accessed by multiple components, or to store
a value that needs to persist between renders
without triggering a re-render.

-   useRef does not trigger re-render
-   initial value is an object with its key as current. {current:value you have set}

> Plain use ref example with an input

```js
import { useRef } from 'react';

const App = () => {
    // It is initaited in form of an object {current:null} in this case
    const refCont = useRef(null);

    const handleChange = () => {
        // It is nothing but the input element as refCont is assocaited with ref
        console.log(refCont);
    };

    return (
        <div>
            <input
                type="text"
                name="name"
                ref={refCont}
                onChange={handleChange}
            />
        </div>
    );
};

export default App;
```

> Making useEffect not run on initial render but on value change

```js
import React, { useEffect, useRef, useState } from 'react';

const App = () => {
    const [val, setVal] = useState(0);
    const isMounted = useRef(false);

    useEffect(() => {
        // ran every re-render and initial render preventing
        // Clenaup -> Re-render
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }
        console.log('ran useEffect');

        // unomunt test
        return () => {
            console.log('cleanup');
        };
    });

    return (
        <div>
            <h3>{val}</h3>
            <button
                type="button"
                onClick={() => {
                    setVal(val + 1);
                }}
            >
                click
            </button>
        </div>
    );
};

export default App;
```

### Custom Hooks

> useFetch.js

```js
import React, { useEffect, useState } from 'react';

const useFetch = (URL) => {
    const [isloading, setIsloading] = useState(true);
    const [iserror, setIserror] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const resp = await fetch(URL);
            if (!resp.ok) {
                setIserror(true);
                setIsloading(false);
            }
            const json = await resp.json();
            setData(json);
            setIsloading(false);
        };
        console.log('start');
        setTimeout(() => {
            getData();
        }, 3000);
        console.log('end');
    }, []);

    console.log('mid');
    return { iserror, isloading, data };
};

export default useFetch;
```

> App.jsx

```js
import React from 'react';
import useFetch from './useFetch';

const App = () => {
    const URL = 'https://api.github.com/users/QuincyLarson';

    const { isloading, iserror, data } = useFetch(URL);
    console.log(isloading); //will be called 2 times

    if (isloading) {
        return <h3>Loading ....</h3>;
    }
    if (iserror) {
        return <h3>Error ....</h3>;
    }

    return <div>{JSON.stringify(data)}</div>;
};

export default App;
```

### Context API

-   **create a context using createContext**
-   **Must wrap the component in Context.Provider**
-   **Pass any properties using the `value` prop**
-   **access the created xontext using useContext hook**

> App.jsx

```js
import React, { createContext, useState } from 'react';
import List from './List';

export const logincontext = createContext();

const App = () => {
    const [user, setUser] = useState(null);

    const logout = () => {
        setUser(null);
    };

    const login = (name) => {
        setUser(name);
    };

    const data = [{ name: 'abc' }, { name: 'def' }, { name: 'ghi' }];

    return (
        <div>
            {user ? (
                <>
                    <h3>Hello {user}</h3>
                    <button
                        type="button"
                        onClick={() => {
                            logout();
                        }}
                    >
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <h3>Not logged in</h3>
                </>
            )}
            <logincontext.Provider value={{ login }}>
                <List data={data} />
            </logincontext.Provider>
        </div>
    );
};

export default App;
```

> List.jsx

```js
import React from 'react';
import Person from './Person';

const List = ({ data }) => {
    return (
        <>
            {data.map((p, idx) => {
                return (
                    <div key={idx}>
                        <div>
                            <Person name={p.name} />
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default List;
```

> Person.jsx

```js
import React, { useContext } from 'react';
import { logincontext } from './App';

const Person = ({ name }) => {
    const { login } = useContext(logincontext);

    return (
        <div>
            <h3>{name}</h3>
            <button
                type="button"
                onClick={() => {
                    login(name);
                }}
            >
                Login
            </button>
        </div>
    );
};

export default Person;
```

### Global Context

-   in src create context.jsx
-   setup a global context - GlobalContext
-   setup a component (AppContext) with one state value
-   return GlobalContext.Provider from AppContext
-   wrap then entire application (main.jsx) - children prop "gotcha"
-   setup a custom hook
-   access in App.jsx
-   log result

### Reducer

> Structure of inbuilt reducer

```js
import React from 'react';
import { useReducer } from 'react';

const data = [{ name: 'abc' }, { name: 'def' }, { name: 'ghi' }];

// Initial State
const defState = {
    people: data
};

// Reducer Function [Must return a state]
// Has access to current state,and action
const reducer = (state, action) => {
    return state;
};

const App = () => {
    // dispatch({type:"action-name",payload:"abc"})
    // state->current state
    const [state, dispatch] = useReducer(reducer, defState);

    return <div>App</div>;
};

export default App;
```

> useReducer basics

```js
import React from 'react';
import { useReducer } from 'react';

const data = [
    { name: 'abc', id: 1 },
    { name: 'def', id: 2 },
    { name: 'ghi', id: 3 }
];

const CLEAR_ALL = 'clear-all';
const REMOVE_ITEM = 'remove-item';
const RESET_LIST = 'reset-list';

// Initial State
const defState = {
    people: data
};

// Reducer Function [Must return a state]
// Has access to current state,and action
const reducer = (state, action) => {
    // Remove a single Person
    if (action.type === REMOVE_ITEM) {
        const newState = state.people.filter((p) => p.id != action.payload);
        console.log(newState);
        return { ...state, people: newState };
    }
    // Remove all
    else if (action.type === CLEAR_ALL) {
        return { ...state, people: [] };
    }
    // Reset List
    else if (action.type === RESET_LIST) {
        return { ...state, people: data };
    }
    return state;
};

const App = () => {
    // dispatch({type:"action",payload:"abc"})
    // state->current state
    const [state, dispatch] = useReducer(reducer, defState);
    console.log(state);

    return (
        <div>
            {state.people.map(({ name, id }, idx) => {
                return (
                    <div key={idx}>
                        <h3>{name}</h3>
                        <button
                            type="button"
                            onClick={() => {
                                dispatch({ type: REMOVE_ITEM, payload: id });
                            }}
                        >
                            Remove Item
                        </button>
                    </div>
                );
            })}
            <br />
            <div>
                <button
                    type="button"
                    onClick={() => {
                        dispatch({ type: CLEAR_ALL });
                    }}
                >
                    Clear All
                </button>
                <br />
                <button
                    type="button"
                    onClick={() => {
                        dispatch({ type: RESET_LIST });
                    }}
                >
                    Rest List
                </button>
            </div>
        </div>
    );
};

export default App;
```

### Performance

When Component Re-Renders :

-   When the component's state or props change, React will re-render the component to reflect these changes.

-   When the parent element re-renders, even if the component's state or props have not changed.

If u take the below example the Counter componet fixes the issue of re-rendering everytime
ofthe Childnest component on parent component state change . Because re-renders the child
component if the parent re-renders.

> Parent.jsx

```js
import React from 'react';
import { useState } from 'react';
import Child from './Child';
import Counter from './Counter';

const data = [
    { name: 'abc', id: 1 },
    { name: 'def', id: 2 },
    { name: 'ghi', id: 3 }
];

// Triggers re-renders of the Childnest component on state change of the count variable

// const Parent = () => {
// const [count, setCount] = useState(0);
//     return (
//         <div>
//             <h1>Count :{count}</h1>
//             <button
//                 type="button"
//                 onClick={() => {
//                     setCount(count + 1);
//                 }}
//             >
//                 Click
//             </button>
//             <Child data={data} />
//         </div>
//     );
// };

// Issue fixed on movinf the state variable to another component

const Parent = () => {
    return (
        <div>
            <Counter />
            <Child data={data} />
        </div>
    );
};

export default Parent;
```

> Child.jsx

```js
import React from 'react';
import Childnest from './Childnest';

const Child = ({ data }) => {
    return (
        <div>
            {data.map(({ name }, idx) => {
                return (
                    <div key={idx}>
                        <Childnest name={name} />
                    </div>
                );
            })}
        </div>
    );
};

export default Child;
```

> Childnest.jsx

```js
import React from 'react';

const Childnest = ({ name }) => {
    console.log('render');
    return <div>{name}</div>;
};

export default Childnest;
```

> Counter.jsx

```js
import React, { useState } from 'react';

const Counter = () => {
    const [count, setCount] = useState(0);
    return (
        <>
            <h1>Count :{count}</h1>
            <button
                type="button"
                onClick={() => {
                    setCount(count + 1);
                }}
            >
                Click
            </button>
        </>
    );
};

export default Counter;
```

**Note : [Naive way of Fixing] Fixing the re-render by moving the state that causes
re-render of the parent component to another file**

> Input.jsx

```js
import React, { useState } from 'react';

const Input = () => {
    const [name, setName] = useState('');
    return (
        <form>
            <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                }}
            />
        </form>
    );
};

export default Input;
```

> App.jsx

```js
import React from 'react';
import { useState } from 'react';
import Child from './Child';
import Input from './Input';

const dataz = [
    { name: 'abc', id: 1 },
    { name: 'def', id: 2 },
    { name: 'ghi', id: 3 }
];

const Parent = () => {
    const [data, setData] = useState(dataz);

    const addPerson = () => {
        setData([...data, { name, id: Date.now() }]);
    };

    // Issue fixed
    return (
        <div>
            <Input />

            <button
                type="button"
                onClick={() => {
                    addPerson();
                }}
            >
                Add
            </button>

            <Child data={data} />
        </div>
    );
};

export default Parent;
```

### React.memo

React.memo is a higher-order component (HOC) in React that allows you to memoize a component.
This means that if the input props to the component have not changed, the memoized
component will return the same result from the previous render, instead of re-rendering.
This can help improve performance by avoiding unnecessary render cycles.

The React.memo function takes a functional component as its argument and
returns a new component that has the same behavior, but with the added optimization
of checking if the props have changed. If the props have not changed, the
memoized component will return the cached result from the previous render.

> Child.jsx

Instead moving the creating separate component to another file.
Use React.memo to trigger re-render only on props changed

```js
export default memo(Child);
```

### UseCallback

The useCallback hook is a hook in React that allows you to memoize a function. It takes two arguments: the first is the function you want to memoize, and the second is an array of dependencies. The hook will return a memoized version of the function that only changes if one of the values in the dependency array changes.

By memoizing the function, you can avoid unnecessary re-renders and improve the performance of your React application. The function will only be re-created if one of its dependencies changes, otherwise the same instance of the function will be returned. This can be useful in situations where you have an expensive function that you only want to recompute when its dependencies change.

We will notice a gotcha by creating a removePerson function on
App.jsx , we will see even after with React.memo child component
re-renders again.This is happens beacuse when parent component
re-renders on state change in our case when we type input value
the removePerson is created from scratch so as a result when
removePerson is passed down as a prop to another child component
it trigger re-renders as the prop changed

> Wihout Fix

```js
const removePerson = (id) => {
    const newPeople = people.filter((person) => person.id !== id);
    setPeople(newPeople);
};
```

> Fix

```js
useCallback(
    (id) => {
        const newPeople = people.filter((person) => person.id !== id);
        setPeople(newPeople);
    },
    [people]
);
```

> useCallback - Common Use Case

What happens if we keep dependency array as FetchData in
the useEffect is we will encounter inifinite re-renders
as the fetchData is created from scratch.To fix this and
still use fetchData as dependency we can use useCallback
to create the function only on initial re-render.Another fix
is to not use useCallback and remove fetchData from dependency.

```js
import { useState, useEffect, useCallback } from 'react';
const url = 'https://api.github.com/users';

const FetchData = () => {
    const [users, setUsers] = useState([]);
    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(url);
            const users = await response.json();
            setUsers(users);
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    // rest of the logic
};
```

### useMemo

The useMemo hook is a hook in React that allows you to memoize a value. It
takes two arguments: the first is a function that returns the value you want to
memoize, and the second is an array of dependencies. The hook will return the
memoized value that will only change if one of the values in the dependency array changes.

By memoizing a value, you can avoid unnecessary calculations and improve the performance
of your React application. The value will only be recalculated if one of its dependencies
changes, otherwise the same instance of the value will be returned. This can be useful
in situations where you have an expensive calculation that you only want to recompute
when its dependencies change.

Make the below function run only on first render

```js
const slowFunction = () => {
    let value = 0;
    for (let i = 0; i <= 1000000000; i++) {
        value += i;
    }
    return value;
};

export default slowFunction;

const processedData = useMemo(() => {
    slowFunction();
}, []);
```
