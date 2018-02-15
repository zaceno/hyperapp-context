function Context (props, children) {
    var fn = function (context) {
        Object.assign(context, props)
        return children
    }
    fn._contextScope = true
    return fn
}

function processVTree (node, context) {
    context = context || {}
    if (node == null) return node
    if (typeof node === 'function') {
        if (node._contextScope) context = Object.assign({}, context)
        return processVTree(node(context), context)
    }
    if (Array.isArray(node)) {
        node = node.map(function (n) { return processVTree(n, context)})
        node = Array.prototype.concat.apply([], node)
        node = node.filter(function (n) { return n != null })
        return node
    }
    if (!node.attributes) return node
    node.children = processVTree(node.children, context)
    return node
}

function withContext (app) {
    return function (initialState, actionDefinitions, originalView, container) {
        var view = function (state, actions) {
            var rootNode = processVTree(originalView(state, actions))
            return rootNode.length ? rootNode[0] : rootNode
        }
        return app(initialState, actionDefinitions, view, container)
    }
}

export {withContext, Context}
