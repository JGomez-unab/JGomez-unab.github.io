# Academic Research Website Template

A lightweight, responsive academic website for Juan Sebastián Gómez and affiliated research groups. It is designed for GitHub Pages and uses plain HTML, CSS, and JavaScript—no build step required.

## Customize the content

Most recurring content lives in `data.js`:

- `profiles`: replace the placeholder GitHub and Google Scholar URLs.
- `projects`: add repository URLs, descriptions, and tags.
- `publications`: add selected papers and DOI links.
- `people`: link the laboratory and student GitHub accounts.
- Student cards intentionally contain editable placeholder names. Replace them before publication.

Edit `index.html` for the biography, institution, email, and page structure. Edit the design tokens at the top of `styles.css` to change colors and typography.

## Preview locally

You can open `index.html` directly, or start a small local server:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a GitHub repository and push these files to its default branch.
2. In **Settings → Pages**, choose **Deploy from a branch**.
3. Select the default branch and the `/ (root)` folder, then save.

For a personal homepage, name the repository `<username>.github.io`. For a reusable project template, use any repository name and enable **Template repository** in its settings.

## Content notes

The initial biography, research themes, and selected publications were adapted from the supplied CV. Placeholder links use `#` or a generic service homepage and should be replaced before publication.
