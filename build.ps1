<#
.SYNOPSIS
    Atualiza versão, changelog e SW antes de gerar o APK.
.DESCRIPTION
    Edita version.json, script.js e sw.js com a nova versão.
    Rode antes de cada build para o Play Store.
.PARAMETER Version
    Versão semântica (ex: "1.0.7")
.PARAMETER VersionCode
    Código numérico da versão (ex: 11)
.PARAMETER UpdateMessage
    Mensagem curta exibida no card de atualização
.PARAMETER Changelog
    Lista de itens do que foi atualizado
.PARAMETER ForceUpdate
    Se true, marca como atualização obrigatória
.PARAMETER MinimumVersionCode
    Versão mínima suportada (padrão: 4)
.EXAMPLE
    .\build.ps1 -Version "1.0.7" -VersionCode 11 -UpdateMessage "Correções e melhorias" -Changelog "Correção no cálculo de engrenagens", "Novo tema escuro"
.EXAMPLE
    .\build.ps1 -Version "1.0.7" -VersionCode 11 -Changelog "Fix 1", "Fix 2"
#>

param(
    [Parameter(Mandatory)]
    [string]$Version,

    [Parameter(Mandatory)]
    [int]$VersionCode,

    [string]$UpdateMessage = "Correções e melhorias no aplicativo",

    [string]$Changelog = "Correções e melhorias",

    [switch]$ForceUpdate,

    [int]$MinimumVersionCode = 4,

    [switch]$NoPush
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "==> Atualizando versão para $Version (code $VersionCode)" -ForegroundColor Cyan

# ----- version.json -----
$verPath = Join-Path $root "version.json"
$ver = Get-Content $verPath -Raw -Encoding UTF8 | ConvertFrom-Json
$ver.version = $Version
$ver.versionCode = $VersionCode
$ver.updateDate = (Get-Date -Format "yyyy-MM-dd")
$ver.updateMessage = $UpdateMessage
$ver.forceUpdate = [bool]$ForceUpdate
$ver.minimumVersionCode = $MinimumVersionCode
$changelogItems = $Changelog -split ';' | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
$ver.changelog = @($changelogItems)
$ver | ConvertTo-Json -Depth 3 | Set-Content $verPath -Encoding UTF8 -NoNewline
Write-Host "  -> version.json atualizado" -ForegroundColor Green

# ----- script.js -----
$jsPath = Join-Path $root "script.js"
$js = Get-Content $jsPath -Raw -Encoding UTF8
$js = $js -replace "(?<=const APP_VERSION = ')[^']*(?=')", $Version
$js = $js -replace "(?<=const APP_VERSION_CODE = )\d+", $VersionCode
Set-Content $jsPath -Value $js -Encoding UTF8 -NoNewline
Write-Host "  -> script.js atualizado (APP_VERSION, APP_VERSION_CODE)" -ForegroundColor Green

# ----- sw.js -----
$swPath = Join-Path $root "sw.js"
$sw = Get-Content $swPath -Raw -Encoding UTF8
$sw = $sw -replace "(?<=var SW_VERSION = )\d+", $VersionCode
Set-Content $swPath -Value $sw -Encoding UTF8 -NoNewline
Write-Host "  -> sw.js atualizado (SW_VERSION = $VersionCode)" -ForegroundColor Green

Write-Host ""
Write-Host "Pronto para build! Versão $Version (code $VersionCode)" -ForegroundColor Green
Write-Host ""
Write-Host "Resumo do changelog:" -ForegroundColor Yellow
foreach ($item in $changelogItems) {
    Write-Host "  - $item" -ForegroundColor Gray
}

# ----- git commit & push -----
if (-not $NoPush) {
    Write-Host ""
    Write-Host "==> Committando e fazendo push..." -ForegroundColor Cyan
    git add version.json script.js sw.js
    git commit -m "build: versao $Version (code $VersionCode)"
    git push origin main
    if ($?) {
        Write-Host "  -> Commit e push realizados com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "  -> Erro ao fazer push. Faca manualmente: git push origin main" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "NoPush ativado. Arquivos alterados mas sem commit." -ForegroundColor Yellow
    Write-Host "Para commitar: git add version.json script.js sw.js; git commit -m ""build: versao $Version (code $VersionCode)""; git push origin main" -ForegroundColor Yellow
}
