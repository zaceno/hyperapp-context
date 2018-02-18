import {JSDOM} from 'jsdom'
const dom = new JSDOM('<html><head></head><body></body></html>')
global.window = dom.window
global.document = dom.window.document

import test from 'ava'
import assert from 'assert'
import withContext from '../dist/hyperapp-context'
import {h, app as _app} from 'hyperapp'
const app = withContext(_app)

function createContainer () {
    const el = document.createElement('div')
    document.body.appendChild(el)
    return el
}

const Context = (props, children) => (context, setContext) => {
    setContext(props)
    return children
}

test.cb('withContext allows context aware components', t => {
    const el = createContainer()
    const Component = props => context => h('div', {id: 'component'}, ['foo'])
    const view = (state, actuins) => h('main', {}, [ h(Component, {}, []) ])
    app({}, {}, view, el)
    setTimeout(_ => {
        t.is(el.innerHTML, '<main><div id="component">foo</div></main>')
        t.end()
    }, 0)
})

test.cb('props on Context are available to context-aware descendants', t => {
    const el = createContainer()
    const Component = _ => ({foo, bar}) => h('span', {id: foo}, [bar])
    const Passthru = _ => h('p', {}, [ h(Component, {}) ])
    const view = _ => h('main', {}, [
        h(Context, {foo: 'foo', bar: 'bar'}, [
            h(Passthru, {}, [])
        ])
    ])
    app({}, {}, view, el)
    setTimeout(_ => {
        t.is(el.innerHTML, '<main><p><span id="foo">bar</span></p></main>')
        t.end()
    },0)
})

test.cb('the view can write to context same as components', t => {
    const el = createContainer()
    const Component = _ => ({foo, bar}) => h('span', {id: foo}, [bar])
    const Passthru = _ => h('p', {}, [ h(Component, {}) ])
    const view = _ => (_, setContext) => {
        setContext({foo: 'foo', bar: 'bar'})
        return h(Passthru, {}, [])
    }
    app({}, {}, view, el)
    setTimeout(_ => {
        t.is(el.innerHTML, '<p><span id="foo">bar</span></p>')
        t.end()
    },0)
})

test.cb('context-aware components can be nested', t => {
    const el = createContainer()
    const Passthru1 = _ => h('section', {}, [ h(Component1, {}) ])
    const Component1 = _ => ({foo}) => h('div', {id: foo}, [ h(Passthru2, {}) ])
    const Passthru2 = _ => h('p', {}, [ h(Component2, {}) ])
    const Component2 = _ => ({bar}) => h('span', {}, [ bar ])
    const view = _ => h('main', {}, [
        h(Context, {foo: 'foo', bar: 'bar'}, [
            h(Passthru1, {}, [])
        ])
    ])
    app({}, {}, view, el)
    setTimeout(_ => {
        t.is(el.innerHTML, '<main><section><div id="foo"><p><span>bar</span></p></div></section></main>')
        t.end()
    },0)
})

test.cb('Context applies context only within its range', t => {
    const el = createContainer()
    const Component = _ => ({foo, bar, baz}) => h('span', {}, [foo, bar, baz])
    const view = _ => h(Context, {foo: 'foo', bar: 'bar'}, [
        h('main', {}, [
            h(Context, {bar: 'baz', baz: 'bop'}, [
                h(Component, {})
            ]),
            h(Component, {})
        ])
    ])
    app({}, {}, view, el)
    setTimeout(_ => {
        t.is(el.innerHTML, '<main><span>foobazbop</span><span>foobar</span></main>')
        t.end()
    }, 0)
})