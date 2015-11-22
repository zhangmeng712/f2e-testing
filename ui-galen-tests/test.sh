#!/bin/sh
galen test tests/ --htmlreport reports
/usr/bin/open -a "/Applications/Google Chrome.app" 'http://localhost:63342/my-git/f2e-testing/ui-galen-tests/reports/report.html'