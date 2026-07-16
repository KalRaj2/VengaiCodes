# O3DE and Native Console Build Support

This document describes the repository structure and files needed to move from a placeholder O3DE path to a real Open 3D Engine scaffold and native console build support.

## 1. Goal

Enable the app to generate:
- real O3DE project scaffolds for high-end open-source game development
- console build support for platforms such as PlayStation/Xbox/Nintendo when licensed SDKs are available

## 2. Required repo structure

### `templates/o3de/`
This folder should contain a minimal O3DE project template that the generator can copy and customize.

Required files and directories:
- `templates/o3de/README.md` — explains engine dependencies and template usage
- `templates/o3de/.gitignore` — common generated file ignore rules
- `templates/o3de/ProjectName.project` — placeholder O3DE project file
- `templates/o3de/ProjectName.workspace` — placeholder O3DE workspace file
- `templates/o3de/Project/Assets/` — asset folders for O3DE content
- `templates/o3de/Project/Scripts/` — placeholder script modules or Python tools
- `templates/o3de/Project/ProjectName/` — optional sample gem, levels, or prefabs

### `docs/o3de-native-builds.md`
A design doc listing implementation steps, required backend changes, and platform-specific caveats.

## 3. Backend integration points

### 3.1 Architecture prompt
- Update `apps/backend/app/api/v1/architecture.py` to explicitly recommend O3DE when the project is a game or needs high-end 3D rendering.
- Capture `tech_stack.frontend` values such as `O3DE` or `Open 3D Engine` in architecture JSON.

### 3.2 Codegen prompt
- Update `apps/backend/app/api/v1/codegen.py` to branch on O3DE and request an O3DE starter scaffold instead of React/Vite.
- The codegen prompt should produce a file list matching the O3DE template structure and include engine project/workspace entries.

### 3.3 Template copy path
- Add support in the export pipeline for copying `templates/o3de/` into generated project output when the selected stack is O3DE.
- This may be a new backend endpoint or a template-rendering service.

## 4. Native console build support

Native console packaging is platform-specific and requires proprietary SDKs.

### 4.1 Required components
- `templates/console/<platform>/` for each supported console platform
- Build scripts or CI jobs that invoke the proprietary console SDK/toolchain
- Secure storage for console signing keys and developer credentials
- Platform-specific packaging manifests and certification metadata

### 4.2 Recommended repository layout
- `templates/console/playstation/`
- `templates/console/xbox/`
- `templates/console/nintendo/`

Each console folder should contain placeholder manifest files and scripts, but not the actual licensed SDK contents.

## 5. Practical limitations

- O3DE engine binaries cannot be stored in the repo.
- Native console SDKs cannot be included in an open-source repository.
- The repo should provide scaffolding, prompts, and integration hooks, while actual platform builds require external licensed tooling.

## 6. Recommended next steps

1. Add an O3DE template folder with placeholder project/workspace files.
2. Add design documentation for O3DE and console support.
3. Update backend prompt and codegen logic to recognize and favor O3DE.
4. Add a `templates/console/` scaffold path for platform-specific packaging.
5. Keep native console support as a separate enterprise/partner integration, not a public open-source feature.

## 7. O3DE build system usage

### Local setup

1. Install Open 3D Engine locally.
2. Set `O3DE_ENGINE_PATH` to the O3DE engine root.
   - Windows PowerShell:
     ```powershell
     setx O3DE_ENGINE_PATH "C:\Path\To\O3DE"
     ```
   - Linux/macOS:
     ```bash
     export O3DE_ENGINE_PATH="/path/to/o3de"
     ```

### Build the placeholder O3DE project

From the repository root:

- Windows:
  ```powershell
  .\templates\o3de\build_o3de_project.ps1 -ProjectPath .\templates\o3de
  ```
- Linux/macOS:
  ```bash
  ./templates/o3de/build_o3de_project.sh templates/o3de
  ```

### What the build scripts do

- `project --generate` to generate required O3DE project files
- `asset --project-path ... build` to compile O3DE assets
- `build --project-path ... --platform ...` to build the project for the target platform

### Notes

- The scripts assume the standard O3DE CLI layout in `bin/`.
- Actual game builds require completed scene and script content in the O3DE project folder.
- For console builds, use a licensed console SDK and add platform-specific build commands in the same style.
