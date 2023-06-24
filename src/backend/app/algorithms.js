const initialize_map_compress = () => {
    let res = new Map();
    for (let i = 0; i < 256; i++) {
        res.set(String.fromCharCode(i), i);
    }
    return res;
}

const initialize_map_decompress = () => {
    let res = new Map();
    for (let i = 0; i < 256; i++) {
        res.set(i, String.fromCharCode(i));
    }
    return res;
}

const compress = (str) => {
    console.log('Compressing...');

    // initialize variables
    let map = initialize_map_compress();
    let p = str[0], c = "";
    let current_code = 256;
    let res = [];

    // process the string
    console.log('Processing...');
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

    let ratio = (res.length / str.length) * 100; 

    // return the result
    console.log('Done!');
    return [res, ratio];
}

const decompress = (arr) => {
    console.log('Decompressing...');

    // initialize variables
    let map = initialize_map_decompress();
    let p = map.get(arr[0]), c = "";
    let current_code = 256;
    let res = p;

    // process the array
    console.log('Processing...');
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

    let ratio = (arr.length / res.length) * 100;

    // return the result
    console.log('Done!');
    return [res, ratio];
}

module.exports = {
    compress,
    decompress
}
