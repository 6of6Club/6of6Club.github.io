module.exports = {
  content: ["./src/**/*.{vue,js,ts}"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        black: {
          ...require("daisyui/src/theming/themes")["[data-theme=black]"],
          error: "#790000",
          warning: "#442400",
          info: "#024",
          success: "#007801",
          primary: "#002e29",
          "--rounded-btn": "0.5rem",
          "base-100": "#001c21",
          "base-200": "#001c21",
          "base-300": "#002228",
          ".btn-primary:hover": {
            "background-color": "#002329",
            "border-color": "#002329",
          },
        },
      },
    ],
  },
  theme: {
    container: {
      center: true,
    },
  },
};
