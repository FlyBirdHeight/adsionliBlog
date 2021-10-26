import './translate.scss'
import Translate from './index';

class SlideIn extends Translate{
    beforeEnter(el) {
        addClass(el, 'slide-in');
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
        removeClass(el, 'slide-in');
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
            addClass(el, 'slide-in');
            el.style.height = 0;
            el.style.paddingTop = 0;
            el.style.paddingBottom = 0;
        }
    }

    afterLeave(el) {
        removeClass(el, 'slide-in');
        el.style.height = '';
        el.style.overflow = el.dataset.oldOverflow;
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
    }
}

export default {
    name: 'slideIn',
    functional: true,
    render(h, { children }) {
        let slideIn = new SlideIn();
        return h('transition', {
            on: {
                'before-enter': slideIn.beforeEnter,
                'enter': slideIn.enter,
                'after-enter': slideIn.afterEnter,
                'before-leave': slideIn.beforeLeave,
                'leave': slideIn.leave,
                'after-leave': slideIn.afterLeave
            }
        }, children);
    }
};
