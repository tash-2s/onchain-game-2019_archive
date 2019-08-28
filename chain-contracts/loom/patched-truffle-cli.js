// this script is usable as same as truffle commands, but patched!
// ex) node patched-truffle-cli.js console --network local

// Add history
const fs = require("fs")
const replHistoryPath = "./.patched-truffle-cli_history"
if (!fs.existsSync(replHistoryPath)) {
  fs.writeFileSync(replHistoryPath, "")
}

const repl = require("repl")
var async = require("async")
const ReplManager = require("truffle-core/lib/repl.js")
ReplManager.prototype.start = function(options) {
  var self = this

  this.contexts.push({
    prompt: options.prompt,
    interpreter: options.interpreter,
    ignoreUndefined: options.ignoreUndefined || false,
    done: options.done
  })

  var currentContext = this.contexts[this.contexts.length - 1]

  if (!this.repl) {
    this.repl = repl.start({
      prompt: currentContext.prompt,
      eval: this.interpret.bind(this)
    })

    const history = fs.readFileSync(replHistoryPath, "utf8")
    history.split("\n").forEach(command => this.repl.history.push(command))

    this.repl.on("exit", () => {
      fs.writeFileSync(replHistoryPath, this.repl.history.join("\n"))

      // If we exit for some reason, call done functions for good measure
      // then ensure the process is completely killed. Once the repl exits,
      // the process is in a bad state and can't be recovered (e.g., stdin is closed).
      var doneFunctions = self.contexts.map(function(context) {
        return context.done
          ? function() {
              context.done()
            }
          : function() {}
      })
      async.series(doneFunctions, function() {
        process.exit()
      })
    })
  }

  // Bubble the internal repl's exit event
  this.repl.on("exit", function() {
    self.emit("exit")
  })

  this.activate(options)
}

require("truffle-core/cli.js")
