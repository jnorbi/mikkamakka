(function () {
    'use strict';

    var readyfn = [],
        loadedfn = [],
        domready = false,
        pageloaded = false,
        d = document,
        w = window;

    /**
     * Ready event-re a readyfn-ben lévő függvények hívása
     */
    function fireReady() {
        var i;
        domready = true;
        for (i = 0; i < readyfn.length; i += 1) {
            readyfn[i]();
        }
        readyfn = [];
    }

    /**
     * Load event-re a readyfn-ben lévő függvények hívása
     */
    function fireLoaded() {
        var i;
        pageloaded = true;
        // Ha nincs DOM loaded még a böngészőben
        if (!domready) {
            fireReady();
        }
        for (i = 0; i < loadedfn.length; i += 1) {
            loadedfn[i]();
        }
        loadedfn = [];
    }

    if (d.addEventListener) {
        // Szabványos
        d.addEventListener('DOMContentLoaded', fireReady, false);
        w.addEventListener('load', fireLoaded, false);
    } else if (d.attachEvent) {
        // IE
        d.attachEvent('onreadystatechange', fireReady);
        // IE < 9
        w.attachEvent('onload', fireLoaded);
    } else {
        w.onload = fireLoaded;
    }

    /**
     * nodeLoop: nodes[] loop
     * @param fn
     * @param nodes
     */
    function nodeLoop(fn, nodes) {
        for (var i = nodes.length - 1; i >= 0; i -= 1) {
            fn(nodes[i]);
        }
    }

    /**
     * Camel Case konverter
     * @param property
     * @returns {*}
     */
    function cssCamel(property) {
        return property.replace(/-\w/g, function (result) {return result.charAt(1).toUpperCase(); });
    }

    /**
     * computeStyle
     * @param elm
     * @param property
     * @returns {*|string|null}
     */
    function computeStyle(elm, property) {
        // IE, más, null
        return (elm.currentStyle) ? elm.currentStyle[cssCamel(property)] : (w.getComputedStyle) ? w.getComputedStyle(elm, null).getPropertyValue(property) : null;
    }

    /**
     * queryPair
     * URL encoded Query String key=value pair
     * @param name
     * @param value
     * @returns {string}
     */
    function queryPair(name, value) {
        return encodeURIComponent(name).replace(/%20/g, '+') + '=' + encodeURIComponent(value).replace(/%20/g, '+');
    }

    /**
     * CSS set
     * @param elm
     * @param property
     * @param value
     */
    function setCss(elm, property, value) {
        try {
            elm.style[cssCamel(property)] = value;
        } catch (e) {
            console.error('Could not set css style property "' + property + '".');
        }
    }

    /**
     * showCss
     * @param elm
     */
    function showCss(elm) {
        elm.style.display = '';
        if (computeStyle(elm, 'display') === 'none') {
            elm.style.display = 'block';
        }
    }

    /**
     * classHelper
     * @param classes
     * @param action
     * @param nodes
     * @returns {boolean}
     */
    function classHelper(classes, action, nodes) {
        var classarray, search, replace, i, has = false;
        if (classes) {
            classarray = classes.split(/\s+/);
            nodeLoop(function (elm) {
                for (i = 0; i < classarray.length; i += 1) {
                    search = new RegExp('\\b' + classarray[i] + '\\b', 'g');
                    replace = new RegExp(' *' + classarray[i] + '\\b', 'g');

                    if (typeof elm.className == 'object') {
                        if (action === 'remove') {
                            elm.className.baseVal = elm.className.baseVal.replace(replace, '');
                        } else if (action === 'toggle') {
                            elm.className.baseVal = (elm.className.baseVal.match(search)) ? elm.className.baseVal.replace(replace, '') : elm.className.baseVal + ' ' + classarray[i];
                        } else if (action === 'has') {
                            if (elm.className.baseVal.match(search)) {
                                has = true;
                                break;
                            }
                        }
                    } else {
                        if (action === 'remove') {
                            elm.className = elm.className.replace(replace, '');
                        } else if (action === 'toggle') {
                            elm.className = (elm.className.match(search)) ? elm.className.replace(replace, '') : elm.className + ' ' + classarray[i];
                        } else if (action === 'has') {
                            if (elm.className.match(search)) {
                                has = true;
                                break;
                            }
                        }
                    }
                }
            }, nodes);
        }
        return has;
    }

    /**
     * insertHtml
     * @param value
     * @param position
     * @param nodes
     */
    function insertHtml(value, position, nodes) {
        var tmpnodes, tmpnode;
        if (value) {
            nodeLoop(function (elm) {
                // insertAdjacentHTML FF >= 8
                // IE nincs insertAdjacentHTML table-re
                // string --> node
                tmpnodes = d.createElement('div');
                tmpnodes.innerHTML = value;
                while ((tmpnode = tmpnodes.lastChild) !== null) {
                    try {
                        if (position === 'before') {
                            elm.parentNode.insertBefore(tmpnode, elm);
                        } else if (position === 'after') {
                            elm.parentNode.insertBefore(tmpnode, elm.nextSibling);
                        } else if (position === 'append') {
                            elm.appendChild(tmpnode);
                        } else if (position === 'prepend') {
                            elm.insertBefore(tmpnode, elm.firstChild);
                        }
                    } catch (e) {break; }
                }
            }, nodes);
        }
    }

    /**
     * Helper függvény
     * @param selector
     * @returns {*[]}
     */
    function helper(selector) {
        var collection, nodes = [], json = false, nodelist, i;

        if (selector) {

            // Element node (selector a HTMLElement helyett, no IE)
            if (selector.nodeType && selector.nodeType === 1) {
                // element --> node list
                nodes = [selector];
            } else if (typeof selector === 'object') {
                // JSON, document object or node list, would prefer to use (selector instanceof NodeList) but no IE support
                json = (typeof selector.length !== 'number');
                nodes = selector;
            } else if (typeof selector === 'string') {
                // IE < 8 querySelectorAll, currentStyle, getComputedStyle helyett
                if (!d.querySelectorAll) {

                    /**
                     * Polyfill querySelectorAll
                     * @param selector
                     * @returns {*[]}
                     */
                    d.querySelectorAll = function (selector) {

                        var head = d.getElementsByTagName('head')[0];
                        var style = d.createElement('STYLE');

                        style.type = 'text/css';

                        if (style.styleSheet) {
                            style.styleSheet.cssText = selector + ' {a:b}';

                            head.appendChild(style);

                            var allnodes = d.getElementsByTagName('*');
                            var selectednodes = [];

                            for (var i = 0; i < allnodes.length; i += 1) {
                                if (computeStyle(allnodes[i], 'a') === 'b') {
                                    selectednodes.push(allnodes[i]);
                                }
                            }

                            head.removeChild(style);
                        }

                        return selectednodes;
                    };
                }

                nodelist = d.querySelectorAll(selector);

                // nodelist-ből nodes[] tömb
                // Array.prototype.slice.call IE >= 9-től megy és lassabb is a for-nál
                for (i = 0; i < nodelist.length; i += 1) {
                    nodes[i] = nodelist[i];
                }

            }
        }

        collection = json ? {} : nodes;

        /**
         * DOM Ready
         * @param fn
         * @returns {*}
         */
        collection.ready = function (fn) {
            if (fn) {
                if (domready) {
                    fn();
                    return collection;
                } else {
                    readyfn.push(fn);
                }
            }
        };

        /**
         * Page loaded
         * @param fn
         * @returns {*}
         */
        collection.loaded = function (fn) {
            if (fn) {
                if (pageloaded) {
                    fn();
                    return collection;
                } else {
                    loadedfn.push(fn);
                }
            }
        };

        /**
         * Each
         * @param fn
         * @returns {*}
         */
        collection.each = function (fn) {
            if (typeof fn === 'function') {
                nodeLoop(function (elm) {
                    // <= IE 8 miatt kell az apply
                    return fn.apply(elm, arguments);
                }, nodes);
            }
            return collection;
        };

        /**
         * Children
         * @returns {*[]}
         */
        collection.children = function () {
            let first = nodes.shift();
            let childrenNodes = first.children;
            let children = [];
            for (let i = 0; i < childrenNodes.length; i += 1) {
                children[i] = helper(childrenNodes[i]);
            }
            return children;
        };

        /**
         * First
         * @returns {*[]}
         */
        collection.first = function () {
            return helper(nodes.shift());
        };

        /**
         * Last
         * @returns {*[]}
         */
        collection.last = function () {
            return helper(nodes.pop());
        };

        /**
         * Hide
         * @returns {*}
         */
        collection.hide = function () {
            nodeLoop(function (elm) {
                elm.style.display = 'none';
            }, nodes);
            return collection;
        };

        /**
         * Show
         * @returns {*}
         */
        collection.show = function () {
            nodeLoop(function (elm) {
                showCss(elm);
            }, nodes);
            return collection;
        };

        /**
         * Toggle
         * @returns {*}
         */
        collection.toggle = function () {
            nodeLoop(function (elm) {
                if (computeStyle(elm, 'display') === 'none') {
                    showCss(elm);
                } else {
                    elm.style.display = 'none';
                }

            }, nodes);
            return collection;
        };

        /**
         * Remove
         * @returns {*[]}
         */
        collection.remove = function () {
            nodeLoop(function (elm) {
                try {
                    elm.parentNode.removeChild(elm);
                } catch (e) {}
            }, nodes);
            return helper();
        };

        /**
         * Empty
         * @returns {*[]}
         */
        collection.empty = function () {
            nodeLoop(function (elm) {
                try {
                    while(elm.firstChild)
                        elm.removeChild(elm.firstChild);
                } catch (e) {}
            }, nodes);
            return helper();
        };

        /**
         * CSS
         * @param property
         * @param value
         * @returns {*|string|null}
         */
        collection.css = function (property, value) {
            if (property) {
                if (value || value === '') {
                    nodeLoop(function (elm) {
                        setCss(elm, property, value);
                    }, nodes);
                    return collection;
                }
                if (nodes[0]) {
                    if (nodes[0].style[cssCamel(property)]) {
                        return nodes[0].style[cssCamel(property)];
                    }
                    if (computeStyle(nodes[0], property)) {
                        return computeStyle(nodes[0], property);
                    }
                }
            }
        };

        /**
         * getClass
         * @returns {*}
         */
        collection.getClass = function () {
            if (nodes[0]) {
                if (typeof nodes[0].className == 'object') {
                    if (nodes[0].className.baseVal.length > 0) {
                        let className = nodes[0].className.baseVal;
                    }
                } else {
                    if (nodes[0].className.length > 0) {
                        let className = nodes[0].className;
                    }
                }
            }
            if (typeof className != 'undefined') {
                // IE trim :D
                return className.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '').replace(/\s+/,' ');
            }
        };

        /**
         * setClass
         * @param classes
         * @returns {*}
         */
        collection.setClass = function (classes) {
            if (classes || classes === '') {
                nodeLoop(function (elm) {
                    if (typeof elm.className == 'object') {
                        elm.className.baseVal = classes;
                    } else {
                        elm.className = classes;
                    }
                }, nodes);
            }
            return collection;
        };

        /**
         * addClass
         * @param classes
         * @returns {*}
         */
        collection.addClass = function (classes) {
            if (classes && !collection.hasClass(classes)) {
                nodeLoop(function (elm) {
                    if (typeof elm.className == 'object') {
                        elm.className.baseVal += ' ' + classes;
                    } else {
                        elm.className += ' ' + classes;
                    }
                }, nodes);
            }
            return collection;
        };

        /**
         * removeClass
         * @param classes
         * @returns {*}
         */
        collection.removeClass = function (classes) {
            classHelper(classes, 'remove', nodes);
            return collection;
        };

        /**
         * toggleClass
         * @param classes
         * @returns {*}
         */
        collection.toggleClass = function (classes) {
            classHelper(classes, 'toggle', nodes);
            return collection;
        };

        /**
         * hasClass
         * @param classes
         * @returns {boolean}
         */
        collection.hasClass = function (classes) {
            return classHelper(classes, 'has', nodes);
        };

        /**
         * HTML
         * @param value
         * @returns {*}
         */
        collection.html = function (value) {
            if (value || value === '') {
                nodeLoop(function (elm) {
                    elm.innerHTML = value;
                }, nodes);
                return collection;
            }
            if (nodes[0]) {
                return nodes[0].innerHTML;
            }
        };

        /**
         * appendChild
         * @param node
         * @returns {*}
         */
        collection.appendChild = function (node) {
            if (node) {
                nodeLoop(function (elm) {
                    elm.appendChild(node);
                }, nodes);
            }
            return collection;
        };

        /**
         * htmlBefore
         * @param value
         * @returns {*}
         */
        collection.htmlBefore = function (value) {
            insertHtml(value, 'before', nodes);
            return collection;
        };

        /**
         * htmlAfter
         * @param value
         * @returns {*}
         */
        collection.htmlAfter = function (value) {
            insertHtml(value, 'after', nodes);
            return collection;
        };

        /**
         * htmlAppend
         * @param value
         * @returns {*}
         */
        collection.htmlAppend = function (value) {
            insertHtml(value, 'append', nodes);
            return collection;
        };

        /**
         * htmlPrepend
         * @param value
         * @returns {*}
         */
        collection.htmlPrepend = function (value) {
            insertHtml(value, 'prepend', nodes);
            return collection;
        };

        /**
         * attr
         * @param property
         * @param value
         * @returns {string|string|SVGLength|SVGTransformList|SVGPreserveAspectRatio|number|SVGNumberList|SVGLengthList|SVGAngle|string|boolean|DOMRect|*|string}
         */
        collection.attr = function (property, value) {
            if (property) {
                // IE < 9 nem megy a getAttribute/setAttribute style-ra és class-ra
                if (value || value === '') {
                    nodeLoop(function (elm) {
                        if (property === 'style') {
                            elm.style.cssText = value;
                        } else if (property === 'class') {
                            if (typeof elm.className == 'object') {
                                elm.className.baseVal = value;
                            } else {
                                elm.className = value;
                            }
                        } else {
                            elm.setAttribute(property, value);
                        }
                    }, nodes);
                    return collection;
                }
                if (nodes[0]) {
                    if (property === 'style') {
                        if (nodes[0].style.cssText) {
                            return nodes[0].style.cssText;
                        }
                    } else if (property === 'class') {
                        if (nodes[0].className) {
                            if (typeof elm.className == 'object') {
                                return nodes[0].className.baseVal;
                            } else {
                                return nodes[0].className;
                            }
                        }
                    } else {
                        if (nodes[0].getAttribute(property)) {
                            return nodes[0].getAttribute(property);
                        }
                    }
                }
            }
        };

        /**
         * data (HTML data attribútum)
         * @param key
         * @param value
         * @returns {string|SVGLength|SVGTransformList|SVGPreserveAspectRatio|number|SVGNumberList|SVGLengthList|SVGAngle|boolean|DOMRect|*}
         */
        collection.data = function (key, value) {
            if (key) {
                return collection.attr('data-'+key, value);
            }
        };

        /**
         * val (form-elemek értékei)
         * @param value
         * @returns {*[]|*}
         */
        collection.val = function (value) {
            var values, i, j;
            if (value || value === '') {
                nodeLoop(function (elm) {
                    switch (elm.nodeName) {
                        case 'SELECT':
                            if (typeof value === 'string' || typeof value === 'number') {
                                value = [value];
                            }
                            for (i = 0; i < elm.length; i += 1) {
                                // multiple
                                for (j = 0; j < value.length; j += 1) {
                                    elm[i].selected = '';
                                    if (elm[i].value === value[j]) {
                                        elm[i].selected = 'selected';
                                        break;
                                    }
                                }
                            }
                            break;
                        case 'INPUT':
                        case 'TEXTAREA':
                        case 'BUTTON':
                            elm.value = value;
                            break;
                    }
                }, nodes);

                return collection;
            }
            if (nodes[0]) {
                switch (nodes[0].nodeName) {
                    case 'SELECT':
                        values = [];
                        for (i = 0; i < nodes[0].length; i += 1) {
                            if (nodes[0][i].selected) {
                                values.push(nodes[0][i].value);
                            }
                        }
                        return (values.length > 1) ? values : values[0];
                    case 'INPUT':
                    case 'TEXTAREA':
                    case 'BUTTON':
                        return nodes[0].value;
                }
            }
        };

        /**
         * checked (checkbox / radio)
         * @param check
         * @returns {boolean|*}
         */
        collection.checked = function (check) {
            if (typeof check === 'boolean') {
                nodeLoop(function (elm) {
                    if (elm.nodeName === 'INPUT' && (elm.type === 'checkbox' || elm.type === 'radio')) {
                        elm.checked = check;
                    }
                }, nodes);
                return collection;
            }
            if (nodes[0] && nodes[0].nodeName === 'INPUT' && (nodes[0].type === 'checkbox' || nodes[0].type === 'radio')) {
                return (!!nodes[0].checked);
            }
        };

        /**
         * Event handler regisztrálása
         * @param event
         * @param fn
         * @returns {*}
         */
        collection.on = function (event, fn) {
            if (selector === w || selector === d) {
                nodes = [selector];
            }
            nodeLoop(function (elm) {
                if (d.addEventListener) {
                    elm.addEventListener(event, fn, false);
                } else if (d.attachEvent) {
                    // <= IE 8 miatt kell apply
                    // lamda fgv-t nem lehetne detachelni
                    elm[event + fn] = function () {
                        return fn.apply(elm, arguments);
                    };
                    elm.attachEvent('on' + event, elm[event + fn]);
                }
            }, nodes);
            return collection;
        };

        /**
         * Event handler törlése
         * @param event
         * @param fn
         * @returns {*}
         */
        collection.off = function (event, fn) {
            if (selector === w || selector === d) {
                nodes = [selector];
            }
            nodeLoop(function (elm) {
                if (d.addEventListener) {
                    elm.removeEventListener(event, fn, false);
                } else if (d.attachEvent) {
                    elm.detachEvent('on' + event, elm[event + fn]);
                    // Takarítás
                    elm[event + fn] = null;
                }
            }, nodes);
            return collection;
        };
        
        return collection;
    }

    /**
     * Helper függvény globális (window) neve
     * @type {function(*=): *[]}
     */
    w.help = helper;

}());
