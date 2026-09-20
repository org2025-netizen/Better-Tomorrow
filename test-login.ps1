$serverPath = "C:\Users\Lenovo\OneDrive - University of the People\Desktop\Better Tomorrow\server"
cd $serverPath
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$serverPath`"; npx tsx src/index.ts"
Start-Sleep -Seconds 15
try { 
  $body = '{"email":"admin@bts.ac.ke","password":"Admin@123"}'
  $r = Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing -TimeoutSec 10
  Write-Host "Login: $($r.Content)"
} catch { Write-Host "Login: $($_.Exception.Message)"; Write-Host $_.ErrorDetails.Message }
Start-Sleep -Seconds 60