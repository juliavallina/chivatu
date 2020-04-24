import { terser } from 'rollup-plugin-terser';

const name = 'Chivatu';

module.exports = [
    {
        input: 'src/chivatu.js',
        output: [
            {
                file: 'dist/chivatu.iife.js',
                name,
                format: 'iife'
            },
            {
                file: 'dist/chivatu.iife.min.js',
                name,
                format: 'iife',
                plugins: [terser()]
            },
            {
                file: 'dist/chivatu.js',
                name,
                format: 'umd'
            },
            {
                file: 'dist/chivatu.min.js',
                name,
                format: 'umd',
                plugins: [terser()]
            }
        ]
    },
    {
        input: 'src/chivatu.js',
        output: [
            {
                file: 'dist/chivatu.esm.js',
                format: 'esm'
            },
            {
                file: 'dist/chivatu.esm.min.js',
                format: 'esm',
                plugins: [terser()]
            }
        ]
    }
];
