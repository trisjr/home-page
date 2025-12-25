# Personal Landing Page Portfolio

A clean, modern, and completely customizable personal portfolio website template. Built with **HTML**, **Tailwind CSS**, and **JavaScript**, this project is designed to be lightweight, fast, and easily deployable to **GitHub Pages**.

## 🚀 Features

*   **Clean & Modern Design:** Minimalist UI with a developer-focused aesthetic.
*   **Dark Mode Support:** Built-in light/dark theme toggle that respects system preferences.
*   **Data-Driven Content:** All content is managed via a single `data.json` file.
*   **GitHub Integration:** Automatically fetch your profile picture, bio, and latest projects from GitHub.
*   **Fully Responsive:** Looks great on mobile, tablet, and desktop.
*   **No Frameworks:** Pure HTML/JS/CSS. No build steps, node_modules, or complex setups required.
*   **GitHub Pages Ready:** Deploy in seconds.

## 🛠 Tech Stack

*   **HTML5**
*   **Tailwind CSS** (via CDN for instant usage)
*   **JavaScript** (ES6+)
*   **Font Awesome** (Icons)
*   **Inter & Fira Code Fonts**

## 📂 Project Structure

```
/
├── assets/          # Images and icons
├── css/
│   └── style.css    # Custom styles and overrides
├── js/
│   └── main.js      # Logic for fetching data and rendering
├── data.json        # YOUR CONTENT GOES HERE
├── index.html       # Main entry point
└── README.md        # Documentation
```

## 📝 How to Customize

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/your-repo-name.git
    ```

2.  **Edit Content:**
    *   Open `data.json`.
    *   **GitHub Integration:** Set `"githubUsername": "your_actual_username"` to automatically pull your Avatar, Bio, and Projects.
    *   **Manual Control:** If you prefer to enter data manually, set `githubUsername` to `null` or a dummy value, and fill out the fields in `data.json`.
    *   Replace other placeholder text with your own details (Experience, Skills, Contact).

3.  **Add Images:**
    *   Place your profile picture in `assets/images/` (if not using GitHub avatar).
    *   Update the `avatar` field in `data.json` to point to your file.

4.  **Modify Styles (Optional):**
    *   Most styling is handled by Tailwind classes in `js/main.js`.
    *   Global overrides can be added to `css/style.css`.

## 🌍 How to Deploy to GitHub Pages

1.  Push your changes to your GitHub repository.
2.  Go to your repository **Settings**.
3.  Click on **Pages** in the left sidebar.
4.  Under **Source**, select `Deploy from a branch`.
5.  Select your `main` (or `master`) branch and the `/ (root)` folder.
6.  Click **Save**.
7.  Wait a few moments, and your site will be live!

## 🤝 Contributing

Feel free to fork this repository and submit pull requests to improve the template.

## 📄 License

Open source and free to use for your personal portfolio.
