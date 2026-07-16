# VengaiCode

## Status

This repository contains the VengaiCode backend, frontend templates, and Windows packaging workflow. Current work focuses on generating AI-created React apps with Tailwind styling and producing project-specific Windows installers.

## What changed recently

- `apps/backend/app/api/v1/codegen.py`: prompt now requires Tailwind setup and enforces Tailwind utility classes in generated `.jsx` files.
- `.github/workflows/build-windows-installer.yml`: workflow now injects AI-generated `package.json` into the Tauri template and updates `src-tauri/tauri.conf.json` so each project produces a unique installer.
- `scripts/test_codegen_prompt.py`: local prompt validation script.
- `scripts/run_real_codegen.py`: helper script for exercising the codegen prompt with the AI orchestrator when the backend environment is available.

## Tailwind requirement for generated apps

The code generation output must include:

- `frontend/src/index.css` with:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- `frontend/tailwind.config.js`
- `frontend/postcss.config.js`
- `frontend/src/main.jsx` importing `./index.css`
- all generated React components using Tailwind utility classes via `className`
- `frontend/package.json` containing `tailwindcss`, `postcss`, and `autoprefixer` as dev dependencies.

This ensures generated apps are styled consistently and can be built with Vite.

## Windows installer packaging

The Windows build workflow now:

1. fetches generated frontend files from the backend packaging endpoint,
2. copies the `templates/tauri-windows` template into `build/`,
3. injects the generated frontend files into that template,
4. uses the injected `build/package.json` when available,
5. updates `build/src-tauri/tauri.conf.json` with project-specific `productName`, `version`, and bundle `identifier`, and
6. runs `cargo tauri build` to produce per-project installers.

### Required backend support

The CI workflow expects a backend packaging endpoint that returns generated project files as JSON and a GitHub secret named `VENGAICODE_BUILD_SECRET` for authentication.

## Deploying backend changes

1. Push backend changes to the repo.
2. Deploy the updated backend to Render.
3. Ensure the Render service can return generated project files for packaging.
4. Add `VENGAICODE_BUILD_SECRET` to GitHub Actions secrets.

## Local validation

If you want a lightweight local check without a full Linux container:

```powershell
python scripts/test_codegen_prompt.py
```

This verifies the prompt text includes Tailwind requirements. For full AI runs you need a working backend/AI environment.

## Notes

- The app is designed to keep heavy build work in cloud CI and Render.
- The current repo changes are focused on Tailwind staging and making Windows installer builds unique per project.

## Additional docs

See `docs/README.md` for the same Tailwind and Windows packaging details in a project documentation page.

## O3DE support

This repo now includes O3DE support hints in the AI architecture and code generation prompts, so high-end open-source game projects can be routed toward Open 3D Engine when appropriate.
