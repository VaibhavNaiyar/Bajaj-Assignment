# Run this whenever ports 3000 or 3001 are stuck:
#   powershell -ExecutionPolicy Bypass -File kill-ports.ps1

@(3000, 3001) | ForEach-Object {
    $port = $_
    $pids = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
            Select-Object -ExpandProperty OwningProcess -Unique |
            Where-Object { $_ -ne 0 }
    foreach ($p in $pids) {
        Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
        Write-Host "Killed PID $p on :$port"
    }
}
Write-Host "Done. Ports 3000 and 3001 are free."
