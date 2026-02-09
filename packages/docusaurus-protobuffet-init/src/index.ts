#!/usr/bin/env node

import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import { execSync } from 'child_process';

const DEFAULT_TEMPLATE = 'classic';

export default async function init(
  siteName: string,
) {
  console.log(chalk.cyan('Triggering Docusaurus project creation.'));

  try {
    execSync(`npx create-docusaurus@latest ${siteName} ${DEFAULT_TEMPLATE} --package-manager npm`, { stdio: 'inherit' });
  } catch (err) {
    console.log(chalk.red('Generation of base template from create-docusaurus failed.'));
    throw err;
  }

  console.log(chalk.cyan('Installing @akurdyukov/docusaurus-protobuffet with recommended plugins.'));

  try {
    execSync(`cd ${siteName} && npm install --save @akurdyukov/docusaurus-protobuffet @easyops-cn/docusaurus-search-local@^0.54.0`, { stdio: 'inherit' });
  } catch (err) {
    console.log(chalk.red('Installation of Protobuffet preset failed.'));
    throw err;
  }

  console.log(chalk.cyan('Initializing @akurdyukov/docusaurus-protobuffet with default options and sample fixtures.'))

  fs.mkdirSync(`${siteName}/protodocs`);
  fs.mkdirSync(`${siteName}/fixtures`);
  fs.writeFileSync(`${siteName}/sidebarsProtodocs.js`, '');

  // Remove existing config file so Docusaurus loads our template
  const configJs = `${siteName}/docusaurus.config.js`;
  if (fs.existsSync(configJs)) {
    fs.unlinkSync(configJs);
  }
  fs.copyFileSync(path.resolve(__dirname, 'templates/docusaurus.config.ts'), `${siteName}/docusaurus.config.ts`);
  fs.cpSync(path.resolve(__dirname, 'templates/proto'), `${siteName}/proto`, { recursive: true });

  // Add generate-proto-json script to the generated project's package.json
  const pkgJsonPath = `${siteName}/package.json`;
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['generate-proto-json'] = "docker run --rm -v $(pwd)/proto:/protos -v $(pwd)/fixtures:/out pseudomuto/protoc-gen-doc --doc_opt=json,proto_workspace.json $(find proto -name '*.proto' | sed 's|^proto/||')";
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2) + '\n');

  // Remove default index page created by create-docusaurus to avoid duplicate route
  const indexTsx = `${siteName}/src/pages/index.tsx`;
  if (fs.existsSync(indexTsx)) {
    fs.unlinkSync(indexTsx);
  }
  fs.copyFileSync(path.resolve(__dirname, 'templates/landing_page.js'), `${siteName}/src/pages/index.js`);
  fs.copyFileSync(path.resolve(__dirname, 'templates/landing_page.module.css'), `${siteName}/src/pages/styles.module.css`);
  fs.copyFileSync(path.resolve(__dirname, 'templates/logo.png'), `${siteName}/static/img/logo.png`);
  fs.copyFileSync(path.resolve(__dirname, 'templates/favicon.ico'), `${siteName}/static/img/favicon.ico`);

  console.log(chalk.cyan('Generating proto JSON descriptor from proto sources.'));

  try {
    execSync(`cd ${siteName} && npm run generate-proto-json`, { stdio: 'inherit' });
  } catch (err) {
    console.log(chalk.red('Generation of proto JSON descriptor failed. Is Docker running?'));
    throw err;
  }

  console.log(chalk.cyan('Generating Proto doc files for sample fixtures.'));

  try {
    execSync(`cd ${siteName} && npx docusaurus generate-proto-docs`, { stdio: 'inherit' });
  } catch (err) {
    console.log(chalk.red('Generation of Proto docs failed.'));
    throw err;
  }

  console.log(chalk.green('Successful setup of Docusaurus site with Protobuffet preset! Try it out with `npm run start` in the site directory.'));
}
