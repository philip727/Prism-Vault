/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx,html}",
    ],
    theme: {
        extend: {
            width: {
                '128': "32rem",
            }
        },
    },
    plugins: [],
}

