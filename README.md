# Simple Pokt CLI

## install

clone this repository: `git clone git@github.com:alvinlubetkin/pokt-cli`

create keyfiles folder `mkdir pokt-cli/bin/keyfiles`

run `yarn install` to install dependencies and cli

need to add error handling and param handling

## Usage

`pokt-cli <COMMAND> <OPTIONS>`

use `pokt-cli` to view help

use `pokt-cli add-account [address] [weight] [optional path tokeyfile]` to add accounts

use `pokt-cli set-sweeper [PATH_TO_KEYFILE]` to set sweeper

use `pokt-cli send [from address] [to address] [amount]` to send transaction. account FROM must already be added with keyfile
use `pokt-cli sweep` to send transactions from sweeper to each listed account. sweeper must already be added with keyfile
