/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./App.native.tsx",
        "./App.web.tsx",
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: '#10b981',
            },
        },
    },
    plugins: [],
}
