#! /usr/bin/env node

var fs = require('fs');
var iconv = require('iconv-lite');
var Baby = require('babyparse');
var parse = require('./parser');
var argv = require('yargs')
    .usage('Usage: $0 [-o <output.ofx>] input.csv')
    .argv;

if (!argv._ || !argv._.length) {
    console.error('No filename provided. See --help for usage');
    process.exit(1);
}

var filename = argv._[0];
var output = argv.o || false;
var buffer = fs.readFileSync(filename);
var contents = iconv.decode(buffer, 'win1251');
var result = parse(contents);

if (output) {
    fs.writeFileSync(output, result);
} else {
    process.stdout.write(result);
}
