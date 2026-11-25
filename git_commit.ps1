$git = 'C:\Users\hp\mingit\cmd\git.exe'
Remove-Item -Force git_init.ps1 -ErrorAction SilentlyContinue

& $git add .
& $git commit -m "feat: complete StudyFlow 5-task daily study planner with goal countdown, 7-day slope analytics, and auth"
& $git log -1 --stat
