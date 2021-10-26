class Translate {
    hasClass(obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    };

    addClass(obj, cls) {
        if (!hasClass(obj, cls)) obj.className += ' ' + cls;
    };

    removeClass(obj, cls) {
        if (hasClass(obj, cls)) {
            const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    };
}

export default Translate