const copyDir = require('copy-dir')

copyDir.sync("dist/Olympiad-Front", "deploy/olympiad-front-build");
