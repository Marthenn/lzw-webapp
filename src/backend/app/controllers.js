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
        await db.remove();
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
        let input = req.body.input;

        let output, ratio;
        if (further == 'yes') {
            // add BWT_EOF to the end of the string
            input += String.toString(algo.BWT_EOF);
            let code = algo.string_to_rle(input);
            let [a, b] = algo.decode_rle(code);
            const c = algo.decode_bwt(a);
            const [d, e] = algo.decode_lzw(c);
            output = algo.lzw_decode_string(d);
            ratio = b * e;
        } else {
            let code = algo.string_to_lzw(input);
            let [a, b] = algo.decode_lzw(code);
            output = a;
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
