This project is only compatible with hyperapp v1, and I do not intend to maintain it any longer. Hence, I am archiving it.

# <img height=24 src=https://cdn.rawgit.com/JorgeBucaran/f53d2c00bafcf36e84ffd862f0dc2950/raw/882f20c970ff7d61aa04d44b92fc3530fa758bc0/Hyperapp.svg> hyperapp-context 

[![Travis CI](https://api.travis-ci.org/zaceno/hyperapp-context.svg?branch=master)](https://travis-ci.org/zaceno/hyperapp-context) [![npm](https://img.shields.io/npm/v/hyperapp-context.svg)](https://www.npmjs.org/package/hyperapp-context)

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

In order to enable the context system in your app, don't call Hyperapp's `app` directly. First, wrap it with `withContext`.

```js
import {app as _app} from 'hyperapp'
import {withContext} from 'hyperapp-context'
const app = withContext(_app)

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

#### Define context directly in the view

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

#### Use a component to set context

A technical limitation with the `setContext` function described above, is that it should really only be called once in a component. If called multiple times, only the last call will have an effect.

If you would like to apply different contexts to different branches of descendants in a component, first define a component that can be used to set the context:

```js
const SetContext = (props, children) => (_, setContext) => {
  setContext(props)
  return children
}

```

Now you may use this to define different contexts for different branches inside a single component/view:

```jsx
const view = (state, actions) => (
  <SetContext state={state} actions={foo}>
    <main>
      <section class="toolbar">
        <SetContext section="toolbar">
          <FooButton />
          <BarButton />
        </SetContext>
      </section>
      <section class="main">
        <SetContext section="main">
          <Main />
        </SetContext>
      </section>
    </main>
  </SetContext>
)
```


### Example

This [TodoMVC example](https://codepen.io/zaceno/pen/gvGgQP?editors=0010) makes liberal (extreme, perhaps...) use of context.

## Nestable

Embed hyperapp-apps in your main app, as if they were components. 

Usage is exactly as in https://github.com/zaceno/hyperapp-nestable, except for these two details:

Import using:

```js
import {nestable} from 'hyperapp-context'
```

These nestables are *context enabled*, meaning you get access to the external context in the nestable's view, and can share data from the component with its children, via context:

```js
const MyComponent = nestable(
  //State
  {...},

  //Actions
  {...},

  //View
  (state, actions) => (props, children) => (context, setContext) => {
    setContext({...})
    return children
  }
)
```

## Preprocessing the VDOM

Sometimes you want a component which does not itself add anything to the virtual-dom-tree, but simply modifies it's children in some way, for example, by attaching dom handlers. For this purpose, we export `processor`

```jsx
import {processor} from 'hyperapp-context'

const MyProcessor = processor((props, children, context) => {
  /*
    Here, props will be {foo: 'bar'}
    children will be {nodeName: 'p', attributes: {}, children: ['bop']}
    return whatever you want to make of this.
  */
})

const Child = _ => context => <p>bop</p>

...
<MyProcessor foo="bar"><Child></MyProcessor>
...

```

### Decorators

Working directly with vnodes as in the example above is rarely necessary, and a bit rough. Most often what you
want to do is simply to add a few event/lifecycle handers or perhaps a class to the child nodes. To facilitate
this we export `decorator` which lets you define a processing component that does just that:

```jsx
const SelectionDecorator = decorator(({row, col}, {selection}) => ({
    onmousedown: ev => {
        ev.preventDefault(true)
        selection.start({row, col})
    },
    onmouseup: ev => {
        ev.preventDefault(true)
        selection.end({row, col})
    },
    onmouseover: ev => {
        ev.preventDefault(true)
        selection.select({row, col})
    },
    class: selection.isSelected({row, col}) && 'selected'
}))

//...

<SelectionDecorator row={i} col={j}>
<td>{values[i][j]}</td>  
</SelectionDecorator>

//...
```

## Example

This example demonstrates using a nestable as a provider of selection state and actions via the context, and decorating table cells with selection event handlers, so that you can operate on the main state using the selection
data.

https://codepen.io/zaceno/pen/vdwQdy?editors=0110

## License

hyperapp-context is MIT licensed. See [LICENSE.md](./LICENSE.md).
