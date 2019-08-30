// use this from eth or loom subdirs
// ex) node ../_truffleConsoleWithHistory.js console --network extdev

// Add history to truffle console
eval(
  (() => {
    const fs = require("fs")
    const replHistoryPath = "./.truffle-console_history"
    if (!fs.existsSync(replHistoryPath)) {
      fs.writeFileSync(replHistoryPath, "")
    }

    const from = '    this.repl.on("exit", function() {'
    const to = `
               const fs = require("fs");
               fs.readFileSync("${replHistoryPath}", "utf8").split("\\n").forEach(command => this.repl.history.push(command));
               this.repl.on("exit", () => {
                 fs.writeFileSync("${replHistoryPath}", this.repl.history.join("\\n"));
               `
    const str = fs.readFileSync("../node_modules/truffle/build/cli.bundled.js", "utf-8")
    return str.replace(from, to).replace("#!/usr/bin/env node", "")
  })()
)
