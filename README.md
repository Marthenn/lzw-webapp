# lzw-webapp
> A web application for LZW compression and decompression. The compression can be further enhanced by BWT and RLE algorithms.

## Usage
The web application is hosted on vercel (front-end) and railway (back-end). You can visit the web application at [https://lzw-webapp.vercel.app/](https://lzw-webapp.vercel.app/).

## Projects Structure
- `src/backend`: The backend of the web application, which is a RESTful API server using Express.js.
- `src/frontend`: The frontend of the web application, built on vanilla HTML/CSS/JS.

## Development
### Prerequisites
- Node.js v14.17.0
- npm v6.14.13

## Algorithm
### General
- The algorithm is implemented in JavaScript
- The algorithm is implemented in `src/backend/algorithms.js`
- The general process is `input -> LZW -> (BWT -> RLE) -> output` for compression
- The general process is `input -> (RLE -> BWT) -> LZW -> output` for decompression
- The steps in parentheses are optional (can be enabled/disabled)

### LZW
- LZW algorithm is a lossless compression algorithm
- The implementation of the LZW algorithm is done as follows:
1. Initialize the dictionary with all the ASCII characters
2. Read the input character by character
3. If the current character is in the dictionary, append it to the current string
4. If the current character is not in the dictionary, add the current string to the output and add the current string + the current character to the dictionary
5. Repeat step 3 and 4 until the end of the input
6. Add the last string to the output

### BWT
- BWT is not a compression algorithm, instead it is a transformation algorithm as a pre-processing step for compression
- The implementation of the BWT algorithm is done as follows:
1. Add a special character to the end of the input
2. Create a matrix of all the rotations of the input
3. Sort the matrix alphabetically
4. The last column of the matrix is the output

### RLE
- RLE is a very simple compression algorithm based on the repetition of characters
- The implementation of the RLE algorithm is done as follows:
1. Read the input character by character
2. If the current character is the same as the previous character, increment the counter
3. If the current character is not the same as the previous character, add the counter and the previous character to the output
4. Repeat step 2 and 3 until the end of the input
5. Add the last counter and the last character to the output
