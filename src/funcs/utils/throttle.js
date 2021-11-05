export const throttle = (func, timer) => {
    let time = null;
    return function (...args) {
        if (!time) {
            time = setTimeout(() => {
                func.apply(this, args);
                time = null;
            }, timer)
        }
    }
}

export const throttleFirst = (func, timer) => {
    let time = null;
    return function (...args) {
        if (!time) {
            func.apply(this, args);
            time = setTimeout(() => {
                time = null;
            }, timer)
        }
    }
}

export const throttleTimeStap = (func, timer) => {
    let start = 0;
    return function (...args) {
        let now = +new Date();
        if (now - start > timer) {
            start = now;
            func.apply(this, args)
        }
    }
}

export const throttleFirstEnd = (func, timer) => {
    let start = 0;
    let time = null;
    return function(...args){
        let now = +new Date();
        if (now - start < timer){
            time && clearTimeout(time);
            time = setTimeout(() => {
                start = now;
                func.apply(this, args)
            }, timer);
        }else {
            start = now;
            func.apply(this, args);
        }
    }
}

export const debounce = (func, timer) => {
    let time = null;
    return function(...args){
        time && clearTimeout(time);
        time = setTimeout(() => {
            func.apply(this, args)
        }, timer)
    }
}