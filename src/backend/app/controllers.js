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
        const types = 'Encode';
        const further = req.body.further;
        const input = req.body.input;
        let [a, ratio] = algo.encode_lzw(input);
        console.log(ratio)
        let output = algo.lzw_code_string(a);
        if (further == 'yes') {
            const b = algo.encode_bwt(a);
            const [c, d] = algo.encode_rle(b);
            output = algo.rle_code_string(c);
            ratio *= d/100;
        } else {
            output = algo.lzw_code_string(a);
        }
        await db.create(types, further, input, output, ratio);
        res.status(200).send({types, further, input, output, ratio});
    } catch (err) {
        res.status(500).send("Failed to encode!");
    }
}

const decode = async (req, res) => {
    try{
        const types = 'Decode';
        const further = req.body.further;
        let input = req.body.input;

        let output, ratio;
        if (further == 'yes') {
            let code = algo.string_to_rle(input);
            console.log(code);
            let [a, b] = algo.decode_rle(code);
            console.log(a, b)
            const c = algo.decode_bwt(a);
            console.log(c)
            const [d, e] = algo.decode_lzw(c);
            output = d;
            ratio = b * e / 100;
        } else {
            let code = algo.string_to_lzw(input);
            let [a, b] = algo.decode_lzw(code);
            output = a;
            ratio = b;
        }
        await db.create(types, further, input, output, ratio);
        res.status(200).send({types, further, input, output, ratio});
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
