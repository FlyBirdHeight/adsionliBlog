export const on = function (isServer) {
    if (!isServer && document.addEventListener) {
        return function (element, event, handle) {
            // console.log(element,event, handle)
            if (element && event) {
                element.addEventListener(event, handle, false)
            }
        }
    } else {
        return function (element, event, handle) {
            if (element && event) {
                element.attachEvent(`on${event}`, handle)
            }
        }
    }
}

export const off = function (isServer) {
    if (!isServer && document.addEventListener) {
        return function (element, event, handle) {
            if (element && event) {
                element.removeEventListener(event, handle, false)
            }
        }
    } else {
        return function (element, event, handle) {
            if (element && event) {
                element.detachEvent(`on${event}`, handle)
            }
        }
    }
}