import hljs from "highlight.js";
import 'highlight.js/styles/atom-one-light.css';

const highlight = function (Vue) {
    Vue.directive('highlight', {
        deep: true,
        bind(el, binding) {
            let targets = el.querySelectorAll('code')
            targets.forEach(target => {
                if (typeof binding.value === 'string') {
                    target.textContent = binding.value
                }
                hljs.highlightBlock(target)
            })
        },
        componentUpdated(el, binding) {
            let targets = el.querySelectorAll('code')
            targets.forEach(target => {
                if (typeof binding.value === 'string') {
                    target.textContent = binding.value
                    hljs.highlightBlock(target)
                }
            })
        },
    })
}

export default highlight;