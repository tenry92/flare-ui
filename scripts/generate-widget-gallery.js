/**
 * Capture screenshots of the widgets and store them into ../docs/source/_static/widgets.
 */

const fs = require('fs/promises');
const path = require('path');
const chalk = require('chalk');

const { By, Key, Builder } = require('selenium-webdriver');

try {
  require('chromedriver');
} catch (error) {
  console.warn(chalk.yellow('chromedriver required. Please use one of:'));
  console.log(chalk.blue('  npm install chromedriver'));
  console.log(chalk.blue('  yarn add chromedriver'));
  process.exit(1);
}

const connect = require('connect');
const serveStatic = require('serve-static');

const projectDirectory = path.resolve(__dirname, '..');
const outputDirectory = path.resolve(projectDirectory, 'docs/source/_static/generated/widgets');
const localServerPort = 8080;

let server;
let driver;

async function ensureOutputDirectoryExists() {
  await fs.mkdir(outputDirectory, {recursive: true});
}

function startLocalServer() {
  return new Promise((resolve, reject) => {
    server = connect()
      .use(serveStatic(projectDirectory))
      .listen(localServerPort, resolve);
  });
}

function stopLocalServer() {
  if (server) {
    server.close();
    server = undefined;
  }
}

async function main() {
  const driverPromise = new Builder().forBrowser('chrome').build();

  await Promise.all([startLocalServer(), ensureOutputDirectoryExists()]);

  driver = await driverPromise;

  async function takeScreenshot(element, name) {
    console.log(chalk.blue(`capturing "${name}"`));
    const data = await element.takeScreenshot(true);
    await fs.writeFile(path.resolve(outputDirectory, `${name}.png`), data, 'base64');
  }

  await driver.get(`http://localhost:${localServerPort}/gallery.html`);

  const elements = await driver.findElements(By.xpath('//*[@data-capture]'));

  for (const element of elements) {
    const name = await element.getAttribute('data-capture');
    await takeScreenshot(element, name);
  }

  await driver.quit();
  driver = undefined;

  stopLocalServer();
}

main().catch(error => {
  if (driver) {
    driver.quit();
    driver = undefined;
  }

  stopLocalServer();

  if (error instanceof Error && error.name == 'SessionNotCreatedError') {
    console.error(chalk.red(error.message));

    const supportsMatch = /This version of ChromeDriver only supports Chrome version (.*)/.exec(error.message);
    const currentMatch = /Current browser version is (.*) with binary path (.*)/.exec(error.message);

    if (supportsMatch && currentMatch) {
      const [, currentVersion] = currentMatch;

      const majorVersion = currentVersion.split('.')[0];

      console.log(chalk.blue(`\n  Try npm install chromedriver@${majorVersion}\n`));
    }
  } else {
    console.error(chalk.red(error));
  }

  process.exit(1);
});
