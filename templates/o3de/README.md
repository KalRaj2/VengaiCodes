# VengaiCode O3DE Template Placeholder

This folder contains a starter Open 3D Engine (O3DE) project scaffold and build scripts.

## What is included

- `ProjectName.project` — placeholder O3DE project file
- `ProjectName.workspace` — placeholder O3DE workspace file
- `Project/Assets/` — placeholder asset folder
- `Project/Scripts/` — placeholder script folder
- `build_o3de_project.sh` — Linux/macOS build script
- `build_o3de_project.ps1` — Windows PowerShell build script

## How to use

1. Install O3DE and set the `O3DE_ENGINE_PATH` environment variable to the root of your engine install.
   - Windows: `setx O3DE_ENGINE_PATH "C:\Path\To\O3DE"`
   - Linux/macOS: `export O3DE_ENGINE_PATH="/path/to/o3de"`

2. Copy or rename the placeholder project files for your game.
   - `ProjectName.project` → `MyGame.project`
   - `ProjectName.workspace` → `MyGame.workspace`

3. Run the build script from the O3DE project root:
   - Windows PowerShell:
     ```powershell
     .\templates\o3de\build_o3de_project.ps1 -ProjectPath .\templates\o3de
     ```
   - Linux/macOS:
     ```bash
     ./templates/o3de/build_o3de_project.sh templates/o3de
     ```

## Important

- This repo does not bundle O3DE engine binaries.
- You need a local O3DE installation and a valid engine path.
- The scaffold is a starter structure; a full game project requires real scenes, scripts, and assets.
