# <img height=24 src=https://cdn.rawgit.com/JorgeBucaran/f53d2c00bafcf36e84ffd862f0dc2950/raw/882f20c970ff7d61aa04d44b92fc3530fa758bc0/Hyperapp.svg> hyperapp-context 

In [Hyperapp](https://hyperapp.js.org), the way to provide data to components is by passing properties to them. If your component tree is deep, and finely separated, this can quickly become repetetitive and burdensome -- and may lead to hard-to-find bugs.

"Contexts" offer a *complementary* (not exclusive) way of providing data to components which can remedy the situation. This library provides the tools to enable and use contexts in Hyperapp

**Note:** The package [hyperapp-context](https://www.npmjs.com/package/hyperapp-context) on npm is old and does not work with current Hyperapp (>= 1.0) . And is also not owned by me. Hence the package name of this is `hyperapp-context2`. I intend to try to remedy this confusing sitation shortly.

## Installation

Hyperapp-context is meant to be used together with [Hyperapp](https://hyperapp.js.org). Install hyperapp-context the same way you would install Hyperapp.

With npm or Yarn:

<pre>
npm i <a href=https://www.npmjs.com/package/hyperapp-context2>hyperapp-context2</a>
</pre>

Then with a module bundler, use as you would anything else.

```js
import {h, app as _app} from "hyperapp"
import { withContext, Context } from "hyperapp-context2"
```


Alternatively, if you're not using a build environment, you can download hyperapp-context from a CDN like [unpkg.com](https://unpkg.com/hyperapp-context2) and it will be globally available through the <samp>window.context</samp> object.

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://unpkg.com/hyperapp"></script>
  <script src="https://unpkg.com/hyperapp-context2"></script>
</head>
</html>
```

## Usage

### Enable context-aware components

`hyperapp-context` exports a "higher order app" `withContext`. In order to enable context-aware components in your app, *don't* call Hyperapp's `app` directly. First, wrap it with `withContext`.

```js
import {app as _app} from 'hyperapp'
import {withContext} from 'hyperapp-context2'
const app = withContext(_app)

//...

app(state, actions, view, container)
```

### Create a context in your tree of components

`hyperapp-context2` exports a special component called `Context`. Use it anwhere in your view, or in one of your components, to create the context.

```jsx
import {Context} from 'hyperapp-context2'

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

The properties you set on the `Context` component will be available to all context-aware components, anywhere in the the tree of components below the Context specification, but *not* anywhere outside it.

Adding a context inside of another context is possible. Same-named properties of the inner context override the properties of the outer context.

### Make your component context-aware

In order to access the context where a component is called, you must make it *context-aware*. This is done by augmenting the conventional component signature `(props, children) => VNode`, and changing it to `(props, children) => context => VNode`.

This allows you to access the context properties as in this example:

```jsx
const Foo => (props, children) => context => (
    <div class={context.foo}>{context.bar}</div>
)
```

Note that the conventional component signature still works, for components that don't need context. And calling a context-aware component from a regular component works too.

## Example

One use of `hyperapp-context2` is to make sure any of your components can access the app's `state` and `actions`, without the need to pass them down the component-tree as props.

It's simply a matter of defining your view like this:

```jsx
(state, actions) => (
    <Context state={state} actions={actions}>
        <App />
    </Context>
)
```

Then any of your components have access to the `state` and `actions`, if you want.

```jsx
const MyComponent = (props, children) => ({state, actions}) => (
    <div>
        ...
    </div>
)
```

This [TodoMVC example](https://codepen.io/zaceno/pen/gvGgQP?editors=0010) makes liberal (extreme, perhaps...) use of this technique.

## License

hyperapp-context is MIT licensed. See [LICENSE.md](./LICENSE.md).
