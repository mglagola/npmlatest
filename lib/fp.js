const isNil = (x) => x === null || x === undefined;

const isEmpty = (value) => {
    if (isNil(value)) {
        return true;
    }
    switch (typeof value) {
    case 'string':
        return value.length === 0;
    case 'object':
        return Object.keys(value).length === 0;
    default:
        return false;
    }
};

function get (keys, obj) {
    if (isEmpty(keys) || isEmpty(obj)) {
        return undefined;
    }
    const [head, ...tail] = [].concat(keys);
    if (isEmpty(tail)) {
        return obj[head];
    }
    return get(tail, obj[head]);
}

module.exports = {
    isNil,
    isEmpty,
    get,
};
