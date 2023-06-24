const BWT_EOF = -100; // decimal to represent EOF for BWT

const initialize_map_encode = () => {
    let res = new Map();
    for (let i = 0; i < 256; i++) {
        res.set(String.fromCharCode(i), i);
    }
    return res;
}

const initialize_map_decode = () => {
    let res = new Map();
    for (let i = 0; i < 256; i++) {
        res.set(i, String.fromCharCode(i));
    }
    return res;
}

const encode_lzw = (str) => {
    // initialize variables
    let map = initialize_map_encode();
    let p = str[0], c = "";
    let current_code = 256;
    let res = [];

    // process the string
    for (let i = 1; i < str.length; i++) {
        c = str[i];
        if (map.has(p + c)) {
            p = p + c;
        } else {
            res.push(map.get(p));
            map.set(p + c, current_code);
            current_code++;
            p = c;
        }
    }

    // push the last code
    res.push(map.get(p));

    const ratio = (res.length / str.length) * 100; 

    return [res, ratio];
}

const decode_lzw = (arr) => {
    // initialize variables
    let map = initialize_map_decode();
    let p = map.get(arr[0]), c = "";
    let current_code = 256;
    let res = p;

    // process the array
    for (let i = 1; i < arr.length; i++) {
        c = map.get(arr[i]);
        if (map.has(p + c)) {
            map.set(current_code, p + c);
            current_code++;
        } else {
            map.set(current_code, p + c);
            current_code++;
            p = c;
        }
        res += c;
    }

    const ratio = (arr.length / res.length) * 100;

    return [res, ratio];
}

const encode_bwt = (arr) => {
    // add EOF to the end of the array
    arr.push(BWT_EOF);
    
    // compute the suffix_array
    let suff = [];
    for (let i = 0; i < arr.length; i++) {
        suff.push([i, arr.slice(i).concat(arr.slice(0, i))]);
    }
    suff.sort(
        // if currently it's BWT_EOF then it's always smaller
        // if not then compare the strings
        (a, b) => {
            if (a == BWT_EOF) {
                return -1;
            } else if (b == BWT_EOF) {
                return 1;
            }
            return (a[1] < b[1] ? -1 : 1);
        }
    );
    suff = suff.map(x => x[0]);

    // get the last column
    let res = [];
    for (let i = 0; i < suff.length; i++) {
        if (suff[i] == 0) {
            res.push(BWT_EOF);
        } else {
            res.push(arr[suff[i] - 1]);
        }
    }

    return res;
}

const decode_bwt = (code) => {
    // initialize variables
    const len  = code.length;
    const sorted = code.slice().sort();
    const shift = Array(len).fill(0);
    const arr = new Map();
    let idx = code.indexOf(BWT_EOF);

    for (let i = 0; i < len; i++){
        if (arr[code[i]] == undefined){
            arr[code[i]] = [i];
        } else {
            arr[code[i]].push(i);
        }
    }

    for (let i = 0; i < len; i++){
        shift[i] = arr[sorted[i]].shift();
    }

    const res = Array(len).fill(0);
    for (let i = 0; i < len; i++){
        res[i] = sorted[idx];
        idx = shift[idx];
    }

    res.pop(); // removes EOF
    return res;
}

const encode_rle = (arr) => {
    let res = [];
    let count = 1;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] == arr[i - 1]) {
            count++;
        } else {
            res.push([arr[i - 1], count]);
            count = 1;
        }
    }
    res.push([arr[arr.length - 1], count]);

    const ratio = (res.length / arr.length) * 100;

    return [res, ratio];
}

const decode_rle = (arr) => {
    let res = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i][1]; j++) {
            res.push(arr[i][0]);
        }
    }

    const ratio = (arr.length / res.length) * 100;

    return [res, ratio];
}

const lzw_code_string = (code) => {
    let res = "";
    for (let i = 0; i < code.length; i++) {
        res += code[i];
        if (i != code.length - 1) {
            res += " ";
        }
    }
    return res;
}

const rle_code_string = (code) => {
    let res = "";
    for (let i = 0; i < code.length; i++) {
        res += code[i][0] + "|" + code[i][1];
        if (i != code.length - 1) {
            res += " ";
        }
    }
    return res;
}

const string_to_lzw = (str) => {
    let res = [];
    let arr = str.split(" ");
    for (let i = 0; i < arr.length; i++) {
        res.push(parseInt(arr[i]));
    }
    return res;
}

const string_to_rle = (str) => {
    let res = [];
    let arr = str.split(" ");
    for (let i = 0; i < arr.length; i++) {
        let temp = arr[i].split("|");
        res.push([parseInt(temp[0]), parseInt(temp[1])]);
    }
    return res;
}

module.exports = {
    encode_lzw,
    decode_lzw,
    encode_bwt,
    decode_bwt,
    encode_rle,
    decode_rle,
    lzw_code_string,
    rle_code_string,
    string_to_lzw,
    string_to_rle,
    BWT_EOF
}
