module.exports = (data, filterArray) => {
    const validator = {
        array: val => Object.prototype.toString.call(val) === '[object Array]',
        object: val => Object.prototype.toString.call(val) === '[object Object]',
        string: val => Object.prototype.toString.call(val) === '[object String]',
        type: val => Object.prototype.toString.call(val).split(' ')[1].slice(0, -1).toLowerCase()
    };

    let having = '', result = [], util = require('util');

    const queryBuilder = {
        or: (table, key, values) => values.length ?
            '(' + values.map(() => `${table}.${key} = ?`).join(' or ') + ')' : '',
        and: (table, key, value) => value !== '' ? `${table}.${key} = ?` : '',
        between: (table, key, values) => values.length === 2 ? `(${table}.${key} BETWEEN ? AND ?)` : '',
        in: (table, key, values) => {
            if (values.length) {
                having = `HAVING count(*) = ${values.length}`;
                return `${table}.${key} IN (${'?, '.repeat(values.length - 1) + '?'})`;
            }
            return '';
        }
    };

    Object.keys(filterArray).forEach((table) => {
        Object.keys(filterArray[table]).forEach((method) => {
            Object.keys(filterArray[table][method]).forEach((key) => {
                if (data[key] && validator[filterArray[table][method][key]](data[key])) {
                    result.push({
                        key: queryBuilder[method](table, key, data[key]),
                        value: data[key]
                    });
                } else if (data[key]) {
                    throw `api/search/getbyfilter -> prepareQuery\n` +
                    `'${key}' => ${util.inspect(data[key])} is ${validator['type'](data[key])}, ` +
                    `expected to be ${filterArray[table][method][key]}\n`;
                }
            });
        });
    });
    return {result: result, having: having};
};
