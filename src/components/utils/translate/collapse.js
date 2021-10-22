import './translate.scss'
const hasClass = function (obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
};

const addClass = function (obj, cls) {
    if (!hasClass(obj, cls)) obj.className += ' ' + cls;
};

const removeClass = function (obj, cls) {
    if (hasClass(obj, cls)) {
        const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
};
class Transition {
    beforeEnter(el) {
        addClass(el, 'collapse-transition');
        if (!el.dataset) el.dataset = {};

        el.dataset.oldPaddingTop = el.style.paddingTop;
        el.dataset.oldPaddingBottom = el.style.paddingBottom;

        el.style.height = '0';
        el.style.paddingTop = 0;
        el.style.paddingBottom = 0;
    }

    enter(el) {
        el.dataset.oldOverflow = el.style.overflow;
        if (el.scrollHeight !== 0) {
            el.style.height = el.scrollHeight + 'px';
            el.style.paddingTop = el.dataset.oldPaddingTop;
            el.style.paddingBottom = el.dataset.oldPaddingBottom;
        } else {
            el.style.height = '';
            el.style.paddingTop = el.dataset.oldPaddingTop;
            el.style.paddingBottom = el.dataset.oldPaddingBottom;
        }

        el.style.overflow = 'hidden';
    }

    afterEnter(el) {
        removeClass(el, 'collapse-transition');
        el.style.height = '';
        el.style.overflow = el.dataset.oldOverflow;
    }

    beforeLeave(el) {
        if (!el.dataset) el.dataset = {};
        el.dataset.oldPaddingTop = el.style.paddingTop;
        el.dataset.oldPaddingBottom = el.style.paddingBottom;
        el.dataset.oldOverflow = el.style.overflow;

        el.style.height = el.scrollHeight + 'px';
        el.style.overflow = 'hidden';
    }

    leave(el) {
        if (el.scrollHeight !== 0) {
            addClass(el, 'collapse-transition');
            el.style.height = 0;
            el.style.paddingTop = 0;
            el.style.paddingBottom = 0;
        }
    }

    afterLeave(el) {
        removeClass(el, 'collapse-transition');
        el.style.height = '';
        el.style.overflow = el.dataset.oldOverflow;
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
    }
}

export default {
    name: 'collapse',
    functional: true,
    render(h, { children }) {
        let translate = new Transition();
        return h('transition', {
            on: {
                'before-enter': translate.beforeEnter,
                'enter': translate.enter,
                'after-enter': translate.afterEnter,
                'before-leave': translate.beforeLeave,
                'leave': translate.leave,
                'after-leave': translate.afterLeave
            }
        }, children);
    }
};
