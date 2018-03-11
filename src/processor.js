import resolveNode from './resolve'

export default function (processor) {
    return function (props, children) {
        return function (context) {
            return processor(props, resolveNode(children), context)
        }
    }
}