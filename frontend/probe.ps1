$r = Invoke-WebRequest -Uri "http://localhost:5173/reports" -UseBasicParsing -TimeoutSec 5
$r.StatusCode
$r.Content | Select-Object -First 200
