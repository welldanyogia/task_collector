import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import colors from "tailwindcss/colors.js";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        'node_modules/preline/dist/*.js',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', ...defaultTheme.fontFamily.sans],
            },
            colors:{
                'primary': colors.monza,
                'monza': {
                    '50': '#fff1f2',
                    '100': '#ffdfe2',
                    '200': '#ffc4ca',
                    '300': '#ff9ba5',
                    '400': '#ff6272',
                    '500': '#ff3146',
                    '600': '#f01228',
                    '700': '#bd0a1c',
                    '800': '#a70d1c',
                    '900': '#8a121e',
                    '950': '#4b040b',
                },

            }
        },
    },

    plugins: [forms, require('preline/plugin')],
};
