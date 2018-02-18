# <img height=24 src=https://cdn.rawgit.com/JorgeBucaran/f53d2c00bafcf36e84ffd862f0dc2950/raw/882f20c970ff7d61aa04d44b92fc3530fa758bc0/Hyperapp.svg> hyperapp-context 


[![Travis CI](https://img.shields.io/travis/zaceno/hyperapp-context/master.svg)](https://travis-ci.org/zaceno/hyperapp-context) [![npm](https://img.shields.io/npm/v/hyperapp-context.svg)](https://www.npmjs.org/package/hyperapp-context)

In [Hyperapp](https://hyperapp.js.org), the way to provide data to components is by passing properties to them. If your component tree is deep, and finely separated, this can quickly become repetetitive and burdensome -- and may lead to hard-to-find bugs.

"Contexts" offer a *complementary* (not exclusive) way of providing data to components which can remedy the situation.

This "higher-order-app" (or app decorator) enables the use of context in Hyperapp-apps.

## Installation

If you're using a module bundler, install With npm or Yarn:

<pre>
npm i <a href=https://www.npmjs.com/package/hyperapp-context>hyperapp-context</a>
</pre>

And then import the same way you would anything else, in the same file where you import `app` from Hyperapp

```js
import {h, app as _app} from "hyperapp"
import context from "hyperapp-context"
```

Alternatively, if you're not using a module bunder, you can download hyperapp-context from a CDN like [unpkg.com](https://unpkg.com/hyperapp-context) and it will be globally available as <samp>window.context</samp>.

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://unpkg.com/hyperapp"></script>
  <script src="https://unpkg.com/hyperapp-context"></script>
</head>
</html>
```

## Usage

### Enable context

In order to enable the context system in your app, don't call Hyperapp's `app` directly. First, wrap it with `context`.

```js
import {app as _app} from 'hyperapp'
import context from 'hyperapp-context'
const app = context(_app)

//...

app(state, actions, view, container)
```

### Access context in components

The "context" is a set of data available to components without the need to pass it as props from its parent-container. In order to access context-data, define your components using this signature:

```jsx
const MyComponent = (props, children) => context => (
    <div class={context.foo}>{context.bar}</>
)
```

### Write to the context

In order for a component to have access to data in the context, it must first have been written to the context, by a component higher up in the component-tree. A component can write to the context using the function provided as the second argument after the `context`.

```jsx
const GrandDadComponent = (props, children) => (context, setContext) => {
    setContext({
        foo: 'foo',
        bar: 'bar',
    })
    return (
        <div>
        ...
        </div>
    )
}
```

The example makes `foo` and `bar` available to any decendant in the component tree.

If any components even further up the tree had already defined `foo` or `bar`, this would override those values for any decendants of `GrandDadComponent`, but *siblings* would recieve the original valuues.

### Define context directly in the view

You can write to the context for your entire app, by setting it in your view. A common use for this is to make `state` and `actions` available to all components.

```js

const view = (state, actions) => (context, setContext) => {
    setContext({state, actions})
    return (
        <main>
            ...
        </main>
    )
}

```


## Example

This [TodoMVC example](https://codepen.io/zaceno/pen/gvGgQP?editors=0010) makes liberal (extreme, perhaps...) use of context.

## License

hyperapp-context is MIT licensed. See [LICENSE.md](./LICENSE.md).
