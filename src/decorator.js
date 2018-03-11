import treeProcessor from './processor'

export default function (getDecoration) {
    return treeProcessor(function (props, children, context){
        var decoration = getDecoration(props, context)
        return children.map(function (child) {
            if (!child.attributes) return child
            Object.keys(decoration).forEach(function (name) {
                if (name === 'class') {
                    var oc = child.attributes.class
                    var dc = decoration.class
                    child.attributes.class = (oc ? oc + ' ' : '') + (dc ? dc : '')
                } else if (name.substr(0, 2) === 'on') {
                    var oh = child.attributes[name]
                    var dh = decoration[name]
                    child.attributes[name] = !oh ? dh : function (a,b) {oh(a, b); dh(a, b)}
                } else {
                    child.attributes[name] = decoration[name]
                }
            })
            return child            
        })
    })
}