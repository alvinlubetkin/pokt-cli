#! /usr/bin/env node
const yargs = require("yargs");
const utils = require('./utils')
const usage = "\n pokt-cli <arg>"

const options = yargs.usage(usage).option("t", {alias:"test", describe: "testing cli", demandOption: false }).help(true).argv;

if(yargs.argv._[0] == "balance"){
    if(!yargs.argv._[1]) {
        utils.showHelp();
        return;
    }
    console.log(utils.checkBalance(yargs.argv._[1]));
    return;
}

if(yargs.argv._[0] == 'add-account'){
    if(yargs.argv._.length != 4){
        utils.showHelp();
        return;
    }
    utils.addAccount(yargs.argv._[1], yargs.argv._[2], yargs.argv._[3])
    return;
}

if(yargs.argv._[0] == 'set-sweeper'){
    if(yargs.argv._.length != 2){
        utils.showHelp();
        return;
    }
    utils.setSweeper(yargs.argv._[1])
    return;
}

if(yargs.argv._[0] == 'list-accounts'){
    utils.showAccounts()
    if(yargs.argv._.length > 1){
        utils.showHelp();
        return;
    }
    return;
}

if(yargs.argv._[0] == 'parse-accounts'){
    utils.parseAccounts()
    if(yargs.argv._.length > 1){
        utils.showHelp();
        return;
    }
    return;
}

if(yargs.argv._[0] == 'send'){
    if(yargs.argv._.length != 4){
        utils.showHelp();
        return;
    }
    utils.sendTransaction(yargs.argv._[1], yargs.argv._[2],yargs.argv._[3]);
    return;
}


