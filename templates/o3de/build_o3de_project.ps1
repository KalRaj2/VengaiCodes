# O3DE build script for Windows

param(
    [string]$ProjectPath = ".",
    [string]$EnginePath = $env:O3DE_ENGINE_PATH
)

if (-not $EnginePath) {
    Write-Error "O3DE_ENGINE_PATH is not set. Set it to the root of your O3DE engine installation."
    exit 1
}

$o3deCmd = Join-Path $EnginePath "bin\o3de.cmd"
if (-not (Test-Path $o3deCmd)) {
    Write-Error "Could not find o3de.cmd at $o3deCmd. Verify your O3DE engine installation."
    exit 1
}

Write-Host "Using O3DE engine at: $EnginePath"
Write-Host "Building O3DE project at: $ProjectPath"

Push-Location $ProjectPath
try {
    & $o3deCmd project --generate
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to generate project files."
    }

    & $o3deCmd asset --project-path "$ProjectPath" build
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to build O3DE assets."
    }

    & $o3deCmd build --project-path "$ProjectPath" --platform win64
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to build O3DE project."
    }

    Write-Host "O3DE build completed successfully."
} finally {
    Pop-Location
}
