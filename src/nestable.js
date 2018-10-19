import {h, app} from 'hyperapp'
import resolveNode from './resolve'
export default function (state, actions, view, tagname) {
    actions._$r = function () {return {}}
    return function (props, children) {
        return function (context) {
            return h(tagname || 'x-', {
                key: props.key,
                id: props.id,
                class: props.class,
                oncreate: function (el) {
                    el._$p = props
                    el._$c = children
                    el._$x = context
                    var wired = app(
                        state,
                        actions,
                        function (s, a) {
                            var node = view(s, a)
                            if (typeof node === 'function') node = node(el._$p,  el._$c)
                            node = resolveNode(node, el._$x)
                            return (node && node.length) ? node[0] : node
                       },
                       el
                    )
                    el._$r = wired._$r
                    el._$u = wired.uninit
                    wired.init && wired.init(props)
                    props.oncreate && props.oncreate(el)
                },
                onupdate: function (el) {
                    el._$p = props
                    el._$c = children
                    el._$x = context
                    el._$r()
                    props.onupdate && props.onupdate(el)
                },
                ondestroy: function (el) {
                    el._$u && el._$u()
                    props.ondestroy && props.ondestroy(el)
                },
                onremove: function (el, done) {
                   if (!props.onremove) return done()
    
                   props.onremove(el, done)
                }
            })            
        }
    }
}