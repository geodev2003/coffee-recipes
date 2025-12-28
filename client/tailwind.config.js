/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cream: {
                    50: '#FDFCF0',
                    100: '#F9F5F0',
                    200: '#F2EBE5',
                    300: '#E6D8CC',
                },
                coffee: {
                    400: '#6D4C41',
                    500: '#5D4037',
                    600: '#4B3621',
                    700: '#3E2723',
                    800: '#2E1B14',
                    900: '#1A1008',
                },
                espresso: {
                    600: '#6D4C41',
                    700: '#5D4037',
                    800: '#4E342E',
                    900: '#3E2723',
                },
                forest: {
                    600: '#558B2F',
                    700: '#689F38',
                    800: '#7CB342',
                    900: '#558B2F',
                },
                caramel: {
                    400: '#D7CCC8',
                    500: '#BCAAA4',
                    600: '#A1887F',
                },
                gold: {
                    400: '#FFC107',
                    500: '#FFB300',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Playfair Display', 'Georgia', 'serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-coffee': 'linear-gradient(135deg, #4B3621 0%, #3E2723 100%)',
                'gradient-forest': 'linear-gradient(135deg, #558B2F 0%, #7CB342 100%)',
                'gradient-warm': 'linear-gradient(135deg, #FDFCF0 0%, #F9F5F0 100%)',
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'glow': '0 0 20px rgba(124, 179, 66, 0.3)',
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'shimmer': 'shimmer 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
        },
    },
    plugins: [],
}
