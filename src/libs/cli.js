'use strict';

/*
 * serverless-tencent: Build the cli outputs and other utils for commands
 */

const os = require('os');
const chalk = require('chalk');
const ansiEscapes = require('ansi-escapes');
const stripAnsi = require('strip-ansi');
const figures = require('figures');
const prettyoutput = require('prettyoutput');
const chokidar = require('chokidar');
const packageInfo = require('../../package.json');
const { groupByKey } = require('./utils');

const version = packageInfo.version;

// CLI Colors
const grey = chalk.dim;
const white = (str) => str; // we wanna use the default terimanl color, so we just return the string as is with no color codes
const { green } = chalk;
const red = chalk.rgb(255, 99, 99);
const blue = chalk.rgb(199, 232, 255);

/**
 * Utility - Sleep
 */
const sleep = async (wait) => new Promise((resolve) => setTimeout(() => resolve(), wait));

/**
 * CLI
 * - Controls the CLI experience in the framework.
 * - Once instantiated, it starts a single, long running process.
 */
module.exports = class CLI {
  constructor(config) {
    // Defaults
    this._ = {};
    this._.entity = 'Serverless';
    this._.status = 'Initializing';
    this._.statusColor = grey;
    this._.lastStatus = null;
    this._.debug = config.debug || false;
    this._.timer = config.timer || false;
    this._.timerStarted = Date.now();
    this._.timerSeconds = 0;
    this._.loadingDots = '';
    this._.loadingDotCount = 0;
  }

  /**
   * Renders a persistent, animated status bar in the CLI which remains visible until 'sessionClose()' is called.  Useful for deployments and other long-running processes where the user needs to know something is happening and what that is.
   * @param {string} status Update the status text in the status bar.
   * @param {string} options.timer Shows a timer for how long the session has been running.
   * @param {function} options.closeHandler A function to call when the session is closed.
   */
  /* istanbul ignore next */
  sessionStart(status, options = {}) {
    // Prevent commands from accidently starting multiple sessions
    if (this._.sessionActive) {
      return null;
    }

    if (options.timer) {
      this._.timer = true;
    } else {
      this._.timer = false;
    }

    // Hide cursor, to keep it clean
    process.stdout.write(ansiEscapes.cursorHide);

    if (this._.debug) {
      // Create a white space immediately
      this.log();
    }

    // Start counting seconds
    setInterval(() => {
      this._.timerSeconds = Math.floor((Date.now() - this._.timerStarted) / 1000);
    }, 1000).unref();

    // Set default close handler, if one was not provided
    if (!options.closeHandler) {
      const self = this;
      options.closeHandler = async () => {
        return self.sessionStop('cancel', 'Canceled');
      };
    }

    // Set Event Handler: Control + C to cancel session
    process.on('SIGINT', async () => {
      await options.closeHandler();
      process.exit();
    });

    if (status) {
      this.sessionStatus(status);
    }

    this._.sessionActive = true;

    // Start render engine
    return this._renderEngine();
  }

  /**
   * Stops rendering the persistent status bar in the CLI with a final status message.
   * @param {string} reason This tells the status bar how to display its final message. Can be 'error', 'cancel', 'close', 'success', 'silent'.
   * @param {string || error} messageOrError Can be a final message to the user (string) or an error object.
   * @param {string} command
   */
  /* istanbul ignore next */
  sessionStop(reason, messageOrError = 'Closed', command) {
    // Clear any existing content
    process.stdout.write(ansiEscapes.cursorLeft);
    process.stdout.write(ansiEscapes.eraseDown);

    // Set color
    let color = white;
    if (reason === 'close') {
      color = white;
    }
    if (reason === 'success') {
      color = green;
    }
    if (reason === 'error' || reason === 'cancel') {
      color = red;
    }

    // Render error
    if (reason === 'error') {
      this.logError(messageOrError, { timer: this._.timerSeconds, command });
      process.exitCode = 1;
    } else if (reason !== 'silent') {
      // Silent is used to skip the "Done" message
      // Write content
      this.log();
      let content = '';
      if (this._.timer) {
        content += `${`${this._.timerSeconds}s`}`;
        content += ` ${figures.pointerSmall} `;
      }
      content += `${this._.entity} `;
      content += `${figures.pointerSmall} ${messageOrError.message || messageOrError}`; // In case an error object was passed in
      process.stdout.write(color(content));
    }

    // Put cursor to starting position for next view
    console.log(os.EOL);
    process.stdout.write(ansiEscapes.cursorLeft);
    process.stdout.write(ansiEscapes.cursorShow);

    this._.sessionActive = false;
  }

  /**
   * Is the persistent status bar in the CLI active
   */
  isSessionActive() {
    return this._.sessionActive;
  }

  /**
   * Set the status of the persistent status display.
   * @param {string} status The text the status should show.  Keep this short.
   * @param {string} entity The entitiy (e.g. Serverless) that is sending the message.
   * @param {string} statusColor 'green', 'white', 'red', 'grey'
   */
  sessionStatus(status = null, entity = null, statusColor = null) {
    this._.status = status || this._.status;
    this._.entity = entity || this._.entity;
    if (statusColor === 'green') {
      statusColor = green;
    }
    if (statusColor === 'red') {
      statusColor = red;
    }
    if (statusColor === 'white') {
      statusColor = white;
    }
    this._.statusColor = statusColor || grey;
  }

  /**
   * Log an error and optionally a stacktrace
   * @param {error} error An instance of the Error class
   * @param {string} error.documentation A link to documentation
   * @param {boolean} error.support Defaults to true and shows a support link.  If false, hides link.
   * @param {boolean} error.chat Defaults to true and shows a chat link.  If false, hides link.
   * @param {boolean} options.hideEntity Hides "Serverless › " at the beginning of the error message.
   * @param {string} options.timer Include the timer in the error message "16s › ".  Value must be a string or number integer of seconds.
   */
  logError(error = {}, options = {}) {
    // If no argument, skip
    if (!error || error === '') {
      return null;
    }

    if (typeof error === 'string') {
      error = { message: error };
    }

    // Render stack trace (if debug is on)
    this.logErrorStackTrace(error.stack);

    // Clear any existing content
    process.stdout.write(ansiEscapes.eraseDown);

    if (options.command) {
      process.stdout.write(red(`${os.EOL}x ${options.command} 失败 `));
      process.stdout.write(grey(`(${options.timer || this._.timerSeconds || 0}s)${os.EOL}`));
    }

    // Add space
    console.log('');

    let basicInfo = `帮助文档:    https://cn.serverless.com/framework/docs
BUG提交:     https://github.com/serverless/serverless-tencent/issues
问答社区:    https://github.com/serverless/serverless-tencent/discussions`;

    const extraErrorInfo = error.extraErrorInfo || {};

    const referral = error.referral || extraErrorInfo.referral;
    if (referral) {
      basicInfo = `参考信息:    ${referral}
${basicInfo}`;
    }

    // Write to terminal
    process.stdout.write(basicInfo);

    console.log('');

    let errorMessage = `
${red('Error:')}
`;

    const pureStep = new Set(['无效的Serverless应用']);
    let extraMessage = '';
    const step = error.step || extraErrorInfo.step;
    const source = error.source || extraErrorInfo.source;

    if (step) {
      extraMessage += `${pureStep.has(step) ? step : `${step}失败`} `;
    }
    if (source) {
      extraMessage += `(${grey(source)})`;
    }

    if (extraMessage) {
      errorMessage += `${extraMessage}
`;
    }
    // remove [requestId, traceId] from error message
    errorMessage += `错误信息: ${error.message.replace(/\[(.*?)\]/g, '')}`;

    process.stdout.write(errorMessage);

    // Addtional informations for error
    console.log('');
    let additionalInfo = `
Environment: ${process.platform}, node ${process.version}, tencent v${version}`;
    const code = error.code || extraErrorInfo.code;
    const requestId = error.requestId || extraErrorInfo.requestId;
    const traceId = error.traceId || extraErrorInfo.traceId;

    if (code) {
      additionalInfo += `
ErrorCode:   ${code}`;
    }
    if (requestId) {
      additionalInfo += `
RequestId:   ${requestId}`;
    }
    if (traceId) {
      additionalInfo += `
TraceId:     ${traceId}`;
    }
    process.stdout.write(additionalInfo);

    // Put cursor to starting position for next view
    process.stdout.write(ansiEscapes.cursorLeft);

    return null;
  }

  /**
   * Log an error's stack trace
   * @param {error} error An instance of the Error class
   */
  logErrorStackTrace(errorStack) {
    if (!this._.debug || !errorStack) {
      return null;
    }

    // If no argument, skip
    if (!errorStack) {
      return null;
    }

    // Clear any existing content
    process.stdout.write(ansiEscapes.eraseDown);

    // Render stack trace
    console.log(errorStack);
    // Put cursor to starting position for next view
    process.stdout.write(ansiEscapes.cursorLeft);
    // Add additional space
    console.log();

    return null;
  }

  logWarning(error = {}) {
    console.log(`Serverless: ${chalk.yellow(error.message)} `);
    process.exit();
  }

  logTypeError(typeErrors) {
    const { component, typeVersion, messages } = typeErrors;
    const errors = messages.filter((message) => message.level === 'error');
    const warnings = messages.filter((message) => message.level === 'warning');
    const msgsByPath = groupByKey(messages, 'path');
    process.stdout.write(ansiEscapes.eraseDown);
    console.log();
    console.log(
      `${component} 组件校验结果: 错误 ${errors.length} 警告 ${warnings.length} 规则版本 v${typeVersion} `
    );
    console.log('---------------------------------------------');
    if (msgsByPath.message) {
      const globalMessage = msgsByPath.message[0];
      let color = chalk.yellow;
      if (globalMessage.level === 'error') color = chalk.red;
      console.log(`${color(globalMessage.message)} `);
    }
    Object.keys(msgsByPath)
      .filter((key) => key !== 'message')
      .forEach((key) => {
        console.log(`  * ${key} `);
        msgsByPath[key]
          .sort((a) => {
            if (a.message && a.message.includes('类型错误')) return -1;
            return 0;
          })
          .forEach((msg) => {
            let color = chalk.red;
            if (msg.level === 'warning') {
              color = chalk.yellow;
            }
            console.log(color(`    - ${msg.message} `));
          });
      });
    console.log();
    console.log(chalk.gray('可以使用 --noValidation 跳过 serverless 应用配置校验'));
    if (errors.length > 0) {
      process.exit(1);
    }
  }

  /**
   * TODO: REMOVE THIS.  SHOULD NOT BE IN HERE.  THIS IS NOT A GENERAL UTILS LIBRARY
   * Watch
   * - Watches the specified directory with the given options
   */
  watch(dir, opts) {
    this.watcher = chokidar.watch(dir, opts);
  }

  /**
   * TODO: REMOVE THIS.  SHOULD NOT BE IN HERE.  THIS IS NOT A GENERAL UTILS LIBRARY
   */
  debugMode() {
    return this._.debug;
  }

  /**
   * Log
   * - Render log statements cleanly
   */
  log(msg, color = null) {
    // If no message and debug mode is enabled, do nothing.
    if (!msg && this._.debug) {
      return null;
    }

    // Render line break if "msg" is blank
    if (!msg) {
      console.log();
      return null;
    }

    // Don't use colors in debug mode
    if (color && this._.debug) {
      color = null;
    }

    // Clear any existing content
    process.stdout.write(ansiEscapes.eraseDown);

    // Write log
    if (typeof msg === 'string') {
      msg = `${msg} \n`;
      if (!color || color === 'white') {
        process.stdout.write(white(msg));
      }
      if (color === 'whiteBold') {
        process.stdout.write(chalk.bold(msg));
      }
      if (color === 'grey') {
        process.stdout.write(grey(msg));
      }
      if (color === 'red') {
        process.stdout.write(red(msg));
      }
      if (color === 'green') {
        process.stdout.write(green(msg));
      }
      if (color === 'blue') {
        process.stdout.write(blue(msg));
      }
    } else {
      console.log(msg);
    }

    // Put cursor to starting position for next view
    process.stdout.write(ansiEscapes.cursorLeft);

    return null;
  }

  /**
   * Log Serverless Framework Logo
   */
  logLogo() {
    let logo = os.EOL;
    logo += 'serverless';
    logo += red(' ⚡');
    logo += 'tencent';

    if (process.env.SERVERLESS_PLATFORM_STAGE === 'dev') {
      logo += grey(' (dev)');
    }

    this.log(logo);
  }

  /**
   * Log serverless-tencent cli Registry Logo
   */
  logRegistryLogo(text) {
    let logo = os.EOL;
    logo += white('serverless');
    logo += red(' ⚡');
    logo += white('tencent');

    if (process.env.SERVERLESS_PLATFORM_STAGE === 'dev') {
      logo += grey(' (dev)');
    }

    if (text) {
      logo += text;
    }
    this.log(logo);
  }

  /**
   * Log serverless-tencent cli Version
   */
  logVersion() {
    this.logLogo();
    this.log();
    this.log(`serverless - tencent version: ${version}(${process.pkg ? 'Binary' : 'npm'})`);
    this.log();
  }

  /**
   * Outputs
   * - Render outputs cleanly.
   */
  logOutputs(outputs, indent = 0) {
    if (!outputs || typeof outputs !== 'object' || Object.keys(outputs).length === 0) {
      this.sessionStop('done', 'Success');
    }
    // Clear any existing content
    process.stdout.write(ansiEscapes.eraseDown);
    process.stdout.write(
      white(
        prettyoutput(
          outputs,
          {
            colors: {
              keys: 'bold',
              dash: null,
              number: null,
              string: null,
              true: null,
              false: null,
            },
            maxDepth: 10,
          },
          indent
        )
      )
    );
  }

  /**
   * Handles the rendering of the the persistent status bar in the CLI. Repetitively updates the CLI view on a regular interval
   */
  /* istanbul ignore next */
  async _renderEngine() {
    if (!this._.sessionActive) return null;
    /**
     * Debug Mode
     */
    if (this._.debug) {
      // Print Status
      if (this._.status !== this._.lastStatus) {
        this.log(`${this._.status}...`);
        this._.lastStatus = `${this._.status} `;
      }
    }

    /**
     * Non-Debug Mode
     */
    if (!this._.debug) {
      // Update active dots
      if (this._.loadingDotCount === 0) {
        this._.loadingDots = '.';
      } else if (this._.loadingDotCount === 2) {
        this._.loadingDots = '..';
      } else if (this._.loadingDotCount === 4) {
        this._.loadingDots = '...';
      } else if (this._.loadingDotCount === 6) {
        this._.loadingDots = '';
      }
      this._.loadingDotCount++;
      if (this._.loadingDotCount > 8) {
        this._.loadingDotCount = 0;
      }

      // Clear any existing content
      process.stdout.write(ansiEscapes.eraseDown);

      // Write status content
      console.log();
      let content = '';
      if (this._.timer) {
        content += `${this._.statusColor(`${this._.timerSeconds}s`)} `;
        content += `${this._.statusColor(figures.pointerSmall)} `;
      }
      content += `${this._.statusColor(this._.entity)} `;
      content += `${this._.statusColor(figures.pointerSmall)} ${this._.statusColor(
        this._.status
      )} `;
      content += ` ${this._.statusColor(this._.loadingDots)} `;
      process.stdout.write(content);
      console.log();

      // Put cursor to starting position for next view
      const startingPosition = this._getRelativeVerticalCursorPosition(content);
      process.stdout.write(ansiEscapes.cursorUp(startingPosition));
      process.stdout.write(ansiEscapes.cursorLeft);
    }

    await sleep(100);
    return this._renderEngine();
  }

  /**
   * Get Relative Vertical Cursor Position
   * Get cursor starting position according to terminal & content width
   */
  /* istanbul ignore next */
  _getRelativeVerticalCursorPosition(contentString) {
    const base = 1;
    const terminalWidth = process.stdout.columns;
    const contentWidth = stripAnsi(contentString).length;
    const nudges = Math.ceil(Number(contentWidth) / Number(terminalWidth));
    return base + nudges;
  }
};
