
// Mock db with sample users and data lookup methods.

const users = [
  {
    accountNumber: "1111",

    // TODO: Improve security of this to not have password in plain text.
    pin: "1234",

    balance: 1000,
    dailyWithdrawalLimit: 500,

    // TODO: This stores the amount of withdrawals made for the day (so that
    // the limit won't be exceeded). This would need to be fleshed out with
    // a real implementation that tracks the amount of transactions made in
    // a day. As it stands, it will reset to $0 when the app is restarted.
    dailyWithdrawalsMade: 0,
  },
  {
    accountNumber: "2222",
    pin: "1234",
    balance: 400,
    dailyWithdrawalLimit: 500,
    dailyWithdrawalsMade: 0,
  },
  {
    accountNumber: "3333",
    pin: "1234",
    balance: 0,
    dailyWithdrawalLimit: 500,
    dailyWithdrawalsMade: 0,
  },
];

export function getUserByAccountNumber(accountNumber) {
  return users.find((u) => u.accountNumber === accountNumber);
}
