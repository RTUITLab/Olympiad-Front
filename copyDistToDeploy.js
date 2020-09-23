const copyDir = require('copy-dir')

copyDir.sync("dist", "deploy/olympiad-front-build");
