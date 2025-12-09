1. update targets.txt
2. run detect.js to auto detect vulns target
3. for single target use: detect-single.js [url]
4. run playwright-scanner.js and browse all endpoints in the vuln target
5. share this prompt whit DEEP-SEEK to get your exploit:
```
TARGET_URL: https://ur-target.com
SAMPLE_EXPLOIT_SCRIPT: https://raw.githubusercontent.com/dewebdes/Wide-Bounty/refs/heads/main/CVE/React2shell/react2shell-comprehensive-exploit-targetted.js
MY_SCANNER_CODE: https://raw.githubusercontent.com/dewebdes/Wide-Bounty/refs/heads/main/CVE/React2shell/playwright-scanner.js
LOGS_FROM_REACT2SHELL_PLAYWRIGHT_SCANNER:
=================================
[PASTE LOGS HERE]
=================================
GENERATE CUSTOM EXPLOIT FOR MY TARGET
```
