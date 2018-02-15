# hyperapp-context

Context-aware components in hyperapp.
Make any component aware of state, actions or anything else, without the need to pass mountains of props down through the component tree. Frees you up to componentize at a very fine grain.

Install as usual with npm, or unpkg.com

Wrap the default app, before running, in order to enable context

```js
import {app} from 'hyperapp'
import {withContext} from 'hyperapp-context'
app = withContext(app)
//...
app(state, actions, view, container)
```

To set a context, use the Context component:

```jsx
import {Context} from 'hyperapp-context'

const SomeComponent = props => (
    <div>
        ...
        <Context foo={...}, bar={...}>
            <Foo a="1" />
            <Bar b="2" />
        </Context>
        ...
    </div>
)
```

Now, components `Foo` and `Bar` will have access to the props set in the context (`foo` and `bar`). In order to access the context, define them as "context aware components" using the signature `(props, children) => context => vnode`. For example:

```jsx
const Foo => (props, children) => context => (
    <div class={context.foo}>{context.bar}</div>
)
```

One practical use is to make any component in your app able to access your state/actions, without needing to have it passed along as props explicitly.

```jsx
import {h, app} from 'hyperapp'
import {withContext, Context} from 'hyperapp-context'
app = withContext(app)

// ...

const DeepComponent = props => ({state, actions}) => (
    <button onclick={actions.foo}>{state.bar} button</button>
)

// ...

app(
    {...}, //State
    {...}, //Actions
    (state, actions) => (
        <Context state={state} actions={actions}>
            //...The rest of your view's components here
        </Context>
    ),
    document.body
)
```

