
function nameToUrl(name) {
    var tmp=name.replace(/\?/g, '*');
    return tmp.replace(/ /g, '-');
}
export {nameToUrl}

