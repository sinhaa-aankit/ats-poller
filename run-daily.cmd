@echo off
REM Windows equivalent of this cron line (see README.md):
REM   0 22 * * * cd <dir> && <node> index.js >> poll.log 2>&1
REM Absolute node path on purpose - Task Scheduler, like cron, does not
REM inherit your interactive PATH.
cd /d "%~dp0"
echo. >> poll.log
echo ===== run started %DATE% %TIME% ===== >> poll.log
"C:\Program Files\nodejs\node.exe" index.js >> poll.log 2>&1
echo ===== exit code %ERRORLEVEL% ===== >> poll.log
