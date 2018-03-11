import resolveNode from './resolve'

export default function (app) {
    return function (initialState, actionDefinitions, originalView, container) {
        var view = function (state, actions) {
            var node = resolveNode(originalView(state, actions))
            return node && (node.length ? node[0] : node)
        }
        return app(initialState, actionDefinitions, view, container)
    }
}