import { TransactionSender, Pocket, Configuration, HttpRpcProvider, PocketAAT, Account, RawTxResponse } from '@pokt-network/pocket-js';
import {getPassword} from './pswnode';

export const sendTransaction = async (from, to, amount) => {
    console.log(`sending ${amount} to ${to} from ${from}`)
    const acct = require(`${__dirname}/keyfiles/${from}-keyFile.json`)
    console.log(acct)
    const POCKET_DISPATCHER = 'https://mainnet.gateway.pokt.network/v1/lb/6205e61d7dc878003c59cdf6'
    const dispatchURL = new URL(POCKET_DISPATCHER)
    const rpcProvider = new HttpRpcProvider(dispatchURL)
    const configuration = new Configuration(5, 1000, 0, 40000)
    const pocket = new Pocket([dispatchURL], rpcProvider, configuration)
    const pass = await getPassword()
    console.log("\n")
    let account = await pocket.keybase.importPPK(pass, acct.salt, acct.secparam, acct.hint, acct.ciphertext, pass)
    account = account as Account;
    console.log('sucesfully unlocked account:', account.addressHex)
    let txSender = await pocket.withImportedAccount(account.addressHex, pass)
    // txSender = txSender as TransactionSender;
    txSender = txSender as TransactionSender;
    const chainId = "0001"
    const fee = "10000"
    let rawTxResponse = await txSender.send(account.addressHex, to, amount).submit(chainId,fee,"")
    rawTxResponse = rawTxResponse as RawTxResponse;
    console.log(rawTxResponse.hash)
}
