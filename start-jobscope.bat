@echo off
echo Starting JobScope Application...

:: Start Backend Server
start cmd /k "cd backend && npm run dev"

:: Wait for 3 seconds to allow backend to start
timeout /t 3 /nobreak > nul

:: Start Frontend Server
start cmd /k "npm run dev"

echo JobScope Application started successfully!
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
