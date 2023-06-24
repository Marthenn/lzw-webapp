const conn = require('./db.config')

const create = async (types, further, input, output, ratio) => {
    try{
        const [rows, fields] = await conn.promise().query('INSERT INTO History (types, further, input, output, ratio) VALUES (?, ?, ?, ?, ?)', [types, further, input, output, ratio]);
    } catch (err) {
        throw err;
    }
}

const read = async () => {
    try{
        const [rows, fields] = await conn.promise().query('SELECT * FROM History');
        return rows;
    } catch (err) {
        throw err;
    }
}

const remove = async () => {
    try{
        const [rows, fields] = await conn.promise().query('DELETE FROM History');
    } catch (err) {
        throw err;
    }
}

module.exports = {
    create,
    read,
    remove
}
