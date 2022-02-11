const fs = require("fs");
const pocketJS = require("@pokt-network/pocket-js");
const { getPassword } = require("./pswnode");
const { CoinDenom } = require("@pokt-network/pocket-js");
const { Pocket, Configuration, HttpRpcProvider, PocketAAT } = pocketJS;

const ACCOUNTS_PATH = `${__dirname}/keyfiles/accounts.txt`;

const checkBalance = async (addr) => {
  const POCKET_DISPATCHER =
    "https://mainnet.gateway.pokt.network/v1/lb/6205e61d7dc878003c59cdf6";
  const dispatchURL = new URL(POCKET_DISPATCHER);
  const rpcProvider = new HttpRpcProvider(dispatchURL);
  const configuration = new Configuration(5, 1000, 0, 40000);
  const pocket = new Pocket([dispatchURL], rpcProvider, configuration);
  try {
    const balance = await pocket.rpc().query.getBalance(addr);
    return balance;
  } catch (err) {
    console.error(
      "failed to retreive balance. check that address is correct:",
      err
    );
  }
};

const addAccount = async (args) => {
  const addr = args[1];
  const weight = args[2];
  if (!(parseFloat(weight) < 1)) {
    console.log("check weight");
    showHelp();
    return;
  }
  const acct = `${addr.toLowerCase()} ${weight} `;
  fs.appendFile(ACCOUNTS_PATH, acct, (err) => {
    if (err) {
      return;
    }
  });
  if (args.length == 4) {
    fs.copyFile(
      args[3],
      `${__dirname}/keyfiles/${addr.toLowerCase()}-keyFile.json`,
      (err) => {
        if (err) {
          console.log("check path");
          getHelp();
          return;
        }
      }
    );
  }
};

const showAccounts = () => {
  if (!fs.existsSync(ACCOUNTS_PATH)) {
    console.log("No accounts have been addded.");
    return showHelp();
  }
  console.log(
    "accounts:",
    fs.readFileSync(`${__dirname}/keyfiles/accounts.txt`, "utf-8")
  );
};

const parseAccounts = () => {
  const file = fs.readFileSync(`${__dirname}/keyfiles/accounts.txt`, "utf-8");
  return file.split(" ").filter((x) => x.length > 0);
};

//non functioning
const sendTransaction = async (from, to, amount, sweeping = false) => {
  console.log(`sending ${amount} to ${to} from ${from}`);
  let filename = `${__dirname}/keyfiles/${from}-keyFile.json`;
  if (sweeping) filename = `${__dirname}/keyfiles/sweeper-keyFile.json`;
  let acct = require(filename);

  const pocket = poktConfig();
  const pass = await getPassword();
  console.log("\n");
  const account = await pocket.keybase.importPPK(
    pass,
    acct.salt,
    acct.secparam,
    acct.hint,
    acct.ciphertext,
    pass
  );
  console.log("sucesfully unlocked account:", account.addressHex);
  let txSender = await pocket.withImportedAccount(account.addressHex, pass);
  const chainId = "1";
  const fee = "10000";
  try {
    const rawTxResponse = await txSender
      .send(account.addressHex, to, amount.toString())
      .submit(chainId, fee, CoinDenom.Upokt, "test memo");
    console.log(rawTxResponse);
  } catch (err) {
    console.log(err);
  }
};

const setSweeper = (path) => {
  fs.copyFile(path, `${__dirname}/keyfiles/sweeper-keyFile.json`, (err) => {
    if (err) {
      console.log("check path");
      getHelp();
      return;
    }
  });
};

const poktConfig = () => {
  const POCKET_DISPATCHER =
    "https://mainnet.gateway.pokt.network/v1/lb/6205e61d7dc878003c59cdf6";
  const dispatchURL = new URL(POCKET_DISPATCHER);
  const rpcProvider = new HttpRpcProvider(dispatchURL);
  //   const configuration = new Configuration(5, 1000, 0, 40000);
  const configuration = new Configuration(
    5,
    1000,
    0,
    50000,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    false,
    false
  );
  const pocket = new Pocket([dispatchURL], rpcProvider, configuration);
  return pocket;
};
const sweep = async () => {
  const acct = require(`${__dirname}/keyfiles/sweeper-keyFile.json`);
  const pass = await getPassword();
  console.log("\n");
  const pocket = poktConfig();
  const sweeper = await pocket.keybase.importPPK(
    pass,
    acct.salt,
    acct.secparam,
    acct.hint,
    acct.ciphertext,
    pass
  );
  const accounts = parseAccounts();

  const bal = (await checkBalance(sweeper.addressHex)) - 3;

  for (let i = 0; i < account.length - 1; i = i + 2) {
    sendTransaction(
      sweeper.addressHex,
      accounts[i],
      bal * BigInt(accounts[i + 1]) * BigInt(1e6)
    );
  }
};

const showHelp = () => {
  const usage = "\n pokt-cli <COMMAND> <OPTIONS>";
  console.log(usage);
  console.log("\nOptions:\r");
  console.log(
    "balance <addr>                               \t checks balane of provided address\r"
  );
  console.log(
    "add-account <addr> <weight> <PATH_TO_KEYFILE>\t add account and weight that should be swept to this address\r"
  );
  console.log(
    "set-sweeper <PATH_TO_KEYFILE>                \t set sweeper keyfile which is used to distribute\r"
  );
  console.log(
    "list-accounts                                \t list all accounts and their weights\r"
  );
  console.log(
    "parse-accounts                               \t parses accounts.txt and prints out array with weights alternating addresses \r"
  );
  console.log(
    "send <FROM> <TO> <AMOUNT>                    \t sends transaction from FROM to TO. from account must already be added\r"
  );
  console.log(
    "sweep                                        \t sweeps to all accounts based upon weights. sweeper account must already be added\r"
  );
};
module.exports = {
  sweep: sweep,
  sendTransaction: sendTransaction,
  setSweeper: setSweeper,
  parseAccounts: parseAccounts,
  showAccounts: showAccounts,
  checkBalance: checkBalance,
  showHelp: showHelp,
  addAccount: addAccount,
};
