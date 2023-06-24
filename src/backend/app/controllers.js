const algo = require('./algorithms');
const db = require('./db');

const get_history = async (req, res) => {
    try{
        const history = await db.read();
        res.status(200).send(history);
    } catch (err){
        res.status(500).send("Failed to get history!");
    }
}

const delete_history = async (req, res) => {
    try{
        const id = req.params.id;
        await db.remove(id);
        res.status(200).send("Deleted history!");
    } catch (err) {
        res.status(500).send("Failed to delete history!");
    }
}

const encode = async (req, res) => {
    try{
        const types = 'encode';
        const further = req.body.further;
        const input = req.body.input;
        let [a, ratio] = algo.encode_lzw(input);
        let output = algo.lzw_code_string(a);
        if (further == 'yes') {
            const b = algo.encode_bwt(a);
            const [c, d] = algo.encode_rle(b);
            output = algo.rle_code_string(c);
            ratio *= d;
        } else {
            output = algo.lzw_code_string(a);
        }
        await db.create(types, further, input, output, ratio);
        const id = db.get_newest_id();
        res.status(200).send({id, types, further, input, output, ratio});
    } catch (err) {
        res.status(500).send("Failed to encode!");
    }
}

const decode = async (req, res) => {
    try{
        const types = 'decode';
        const further = req.body.further;
        const input = req.body.input;
        let output, ratio;
        if (further == 'yes') {
            let [a, b] = algo.decode_rle(input);
            const c = algo.decode_bwt(a);
            const [d, e] = algo.decode_lzw(c);
            output = algo.lzw_decode_string(d);
            ratio = b * e;
        } else {
            let [a, b] = algo.decode_lzw(input);
            output = algo.lzw_decode_string(a);
            ratio = b;
        }
        await db.create(types, further, input, output, ratio);
        const id = db.get_newest_id();
        res.status(200).send({id, types, further, input, output, ratio});
    } catch (err) {
        res.status(500).send("Failed to decode!");
    }
}

module.exports = {
    get_history,
    delete_history,
    encode,
    decode
}
