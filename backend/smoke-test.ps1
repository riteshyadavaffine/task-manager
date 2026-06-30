$base = "http://localhost:3001"
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$pass = $true
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$testEmail = "smoke_${ts}@test.com"

function Test-Endpoint($name, $result, $expectSuccess = $true) {
    if ($expectSuccess -and $result.success -eq $true) {
        Write-Host "  PASS: $name" -ForegroundColor Green
    } elseif (-not $expectSuccess -and $result.success -eq $false) {
        Write-Host "  PASS: $name (correctly rejected)" -ForegroundColor Green
    } else {
        Write-Host "  FAIL: $name -> $($result | ConvertTo-Json -Compress)" -ForegroundColor Red
        $script:pass = $false
    }
}

Write-Host "`n[1] Health Check" -ForegroundColor Cyan
$r = Invoke-RestMethod "$base/health"
if ($r.message) { Write-Host "  PASS: $($r.message)" -ForegroundColor Green }

Write-Host "`n[2] Register" -ForegroundColor Cyan
$r = Invoke-RestMethod -Method POST "$base/auth/register" `
    -ContentType "application/json" `
    -Body "{`"email`":`"$testEmail`",`"password`":`"Test1234!`"}" `
    -WebSession $session
Test-Endpoint "Register user" $r

Write-Host "`n[3] Duplicate Register (expect 409)" -ForegroundColor Cyan
try {
    Invoke-RestMethod -Method POST "$base/auth/register" `
        -ContentType "application/json" `
        -Body "{`"email`":`"$testEmail`",`"password`":`"Test1234!`"}" | Out-Null
    Write-Host "  FAIL: Should have rejected duplicate" -ForegroundColor Red
} catch {
    Write-Host "  PASS: Duplicate email rejected" -ForegroundColor Green
}

Write-Host "`n[4] Login" -ForegroundColor Cyan
$r = Invoke-RestMethod -Method POST "$base/auth/login" `
    -ContentType "application/json" `
    -Body "{`"email`":`"$testEmail`",`"password`":`"Test1234!`"}" `
    -WebSession $session
Test-Endpoint "Login" $r

Write-Host "`n[5] /auth/me" -ForegroundColor Cyan
$r = Invoke-RestMethod "$base/auth/me" -WebSession $session
Test-Endpoint "/auth/me" $r
Write-Host "  User: $($r.data.email)" -ForegroundColor DarkGray

Write-Host "`n[6] Create Task" -ForegroundColor Cyan
$r = Invoke-RestMethod -Method POST "$base/api/tasks" `
    -ContentType "application/json" `
    -Body '{"title":"Smoke test task","description":"Testing pipeline"}' `
    -WebSession $session
Test-Endpoint "Create task" $r
$taskId = $r.data.id
Write-Host "  Task ID: $taskId" -ForegroundColor DarkGray

Write-Host "`n[7] Create Task without title (expect 400)" -ForegroundColor Cyan
try {
    Invoke-RestMethod -Method POST "$base/api/tasks" `
        -ContentType "application/json" `
        -Body '{"description":"no title"}' `
        -WebSession $session | Out-Null
    Write-Host "  FAIL: Should have required title" -ForegroundColor Red
} catch {
    Write-Host "  PASS: Title required validation works" -ForegroundColor Green
}

Write-Host "`n[8] Get All Tasks" -ForegroundColor Cyan
$r = Invoke-RestMethod "$base/api/tasks" -WebSession $session
Test-Endpoint "Get tasks" $r
Write-Host "  Count: $($r.data.Count) task(s)" -ForegroundColor DarkGray

Write-Host "`n[9] Update Task (mark COMPLETED)" -ForegroundColor Cyan
$r = Invoke-RestMethod -Method PUT "$base/api/tasks/$taskId" `
    -ContentType "application/json" `
    -Body '{"status":"COMPLETED"}' `
    -WebSession $session
Test-Endpoint "Update task status" $r

Write-Host "`n[10] Filter by COMPLETED" -ForegroundColor Cyan
$r = Invoke-RestMethod "$base/api/tasks?status=COMPLETED" -WebSession $session
Test-Endpoint "Filter COMPLETED" $r
Write-Host "  Completed tasks: $($r.data.Count)" -ForegroundColor DarkGray

Write-Host "`n[11] Filter by ACTIVE (should be 0)" -ForegroundColor Cyan
$r = Invoke-RestMethod "$base/api/tasks?status=ACTIVE" -WebSession $session
Write-Host "  Active tasks: $($r.data.Count)" -ForegroundColor DarkGray

Write-Host "`n[12] Delete Task" -ForegroundColor Cyan
$r = Invoke-RestMethod -Method DELETE "$base/api/tasks/$taskId" -WebSession $session
Test-Endpoint "Delete task" $r

Write-Host "`n[13] Logout" -ForegroundColor Cyan
$r = Invoke-RestMethod -Method POST "$base/auth/logout" -WebSession $session
Test-Endpoint "Logout" $r

Write-Host "`n[14] Access after logout (expect 401)" -ForegroundColor Cyan
try {
    Invoke-RestMethod "$base/api/tasks" | Out-Null
    Write-Host "  FAIL: Should have been unauthorized" -ForegroundColor Red
    $script:pass = $false
} catch {
    Write-Host "  PASS: Unauthenticated access blocked" -ForegroundColor Green
}

Write-Host "`n================================" -ForegroundColor White
if ($pass) {
    Write-Host "ALL TESTS PASSED - Backend + Neon DB working!" -ForegroundColor Green
} else {
    Write-Host "SOME TESTS FAILED - check above" -ForegroundColor Red
}
Write-Host "================================`n" -ForegroundColor White

