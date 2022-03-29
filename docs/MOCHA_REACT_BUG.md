# Mocha react bug

There is a bug that our tests do not exit after the end.

I've used two tools to show active handlers and got those outputs:



<details>
<summary>why-is-node-running</summary>

There are 1 handle(s) keeping the process running


node:internal/async_hooks:201
node:internal/async_hooks:506
node:internal/timers:162
node:internal/timers:196
/Users/leonidlogvinov/deth/tools/pages/eth-unit-conversion.test.tsx:46
node:internal/modules/cjs/loader:1099
/Users/leonidlogvinov/deth/tools/node_modules/ts-node/dist/index.js:800        - return _compile.call(this, result, fileName);
node:internal/modules/cjs/loader:1153
/Users/leonidlogvinov/deth/tools/node_modules/ts-node/dist/index.js:802        - return old(m, filename);
node:internal/modules/cjs/loader:975
node:internal/modules/cjs/loader:822
node:internal/modules/cjs/loader:999
node:internal/modules/cjs/helpers:102
/Users/leonidlogvinov/deth/tools/node_modules/mocha/lib/esm-utils.js:42        - return require(file);
/Users/leonidlogvinov/deth/tools/node_modules/mocha/lib/esm-utils.js:55        - const result = await exports.requireOrImport(path.resolve(file));
/Users/leonidlogvinov/deth/tools/node_modules/mocha/lib/cli/run-helpers.js:125 - await mocha.loadFilesAsync();
/Users/leonidlogvinov/deth/tools/node_modules/mocha/lib/cli/run.js:362         - await runMocha(mocha, argv);

</details>

<details>
<summary>wtfnode</summary>

[WTF Node?] open handles:
- File descriptors: (note: stdio always exists)
  - fd 2 (tty) (stdio)
  - fd 1 (tty) (stdio)
- Timers:
  - (1000 ~ 1000 ms) (anonymous) @ /Users/leonidlogvinov/deth/tools/pages/eth-unit-conversion.test.tsx:7
- Others:
  - MessagePort

</details>

The first one seems weird and I don't know how to interpret it.
The second one shows one active handler: `MessagePort`. It is created by react testing library. If I call `.close()` on it within the code of `wtfnode` - all is good. Tests finish. But this is simmilar to running `mocha --exit`.

There are [some docs](https://testing-library.com/docs/react-testing-library/setup#skipping-auto-cleanup) in the testing library talking about how to disable auto-cleanup. But we don't disable it and I've added some output within the library and the cleanup method is in fact being called. It just doesn't call close on MessagePort.

Seems to me like this is a bug within the testing library.
At the same time - the testing library has 16k stars and no wingle issue within the whole org mentions `MessagePort` so statisticaly speaking - there is much greater probability that it's our fault/misunderstanding.

Therefore I suggest that we just use `mocha --exit`. I've spent enough time on this thing already ;)
