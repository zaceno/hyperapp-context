function resolveNode (node, context) {
    context = context || {}
    if (node == null) return node
    if (typeof node === 'function') {
        return resolveNode(
            node(
                context,
                function (props) {
                    context = Object.assign({}, context, props)
                }
            ),
            context
        )
    }
    if (Array.isArray(node)) {
        node = node.map(function (n) { return resolveNode(n, context)})
        node = Array.prototype.concat.apply([], node)
        node = node.filter(function (n) { return n != null })
        return node
    }
    if (!node.attributes) return node
    return {
        nodeName: node.nodeName,
        attributes: Object.assign({}, node.attributes),
        children: resolveNode(node.children, context)
    }
}

export default resolveNode
