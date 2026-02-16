// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           50: '#fef6e7',
//           100: '#fce9c3',
//           200: '#f9d89c',
//           300: '#f7c674',
//           400: '#f5b856',
//           500: '#f3aa38',
//           600: '#f19c32',
//           700: '#ee892b',
//           800: '#ec7724',
//           900: '#e85717',
//         },
//         dark: {
//           50: '#f5f5f5',
//           100: '#e0e0e0',
//           200: '#bababa',
//           300: '#939393',
//           400: '#6d6d6d',
//           500: '#464646',
//           600: '#3d3d3d',
//           700: '#2e2e2e',
//           800: '#1f1f1f',
//           900: '#0f0f0f',
//         }
//       },
//       fontFamily: {
//         sans: ['Inter', 'system-ui', 'sans-serif'],
//         heading: ['Poppins', 'system-ui', 'sans-serif'],
//       },
//       boxShadow: {
//         'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
//         'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
//       }
//     },
//   },
//   plugins: [],
//   darkMode: 'class',
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef6e7',
          100: '#fce9c3',
          200: '#f9d89c',
          300: '#f7c674',
          400: '#f5b856',
          500: '#f3aa38',
          600: '#f19c32',
          700: '#ee892b',
          800: '#ec7724',
          900: '#e85717',
        },
        dark: {
          50: '#f5f5f5',
          100: '#e0e0e0',
          200: '#bababa',
          300: '#939393',
          400: '#6d6d6d',
          500: '#464646',
          600: '#3d3d3d',
          700: '#2e2e2e',
          800: '#1f1f1f',
          900: '#0f0f0f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: theme('colors.primary.600'),
              },
            },
            h1: {
              color: theme('colors.gray.900'),
              fontFamily: theme('fontFamily.heading').join(', '),
            },
            h2: {
              color: theme('colors.gray.900'),
              fontFamily: theme('fontFamily.heading').join(', '),
            },
            h3: {
              color: theme('colors.gray.900'),
              fontFamily: theme('fontFamily.heading').join(', '),
            },
            h4: {
              color: theme('colors.gray.900'),
              fontFamily: theme('fontFamily.heading').join(', '),
            },
            code: {
              color: theme('colors.primary.600'),
              backgroundColor: theme('colors.gray.100'),
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            blockquote: {
              borderLeftColor: theme('colors.primary.500'),
              backgroundColor: theme('colors.gray.50'),
              padding: '1rem',
              borderRadius: '0.5rem',
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.300'),
              },
            },
            h1: {
              color: theme('colors.gray.100'),
            },
            h2: {
              color: theme('colors.gray.100'),
            },
            h3: {
              color: theme('colors.gray.100'),
            },
            h4: {
              color: theme('colors.gray.100'),
            },
            code: {
              color: theme('colors.primary.400'),
              backgroundColor: theme('colors.dark.700'),
            },
            blockquote: {
              borderLeftColor: theme('colors.primary.500'),
              backgroundColor: theme('colors.dark.800'),
              color: theme('colors.gray.300'),
            },
            strong: {
              color: theme('colors.gray.100'),
            },
            'ul > li::marker': {
              color: theme('colors.gray.500'),
            },
            'ol > li::marker': {
              color: theme('colors.gray.500'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
}