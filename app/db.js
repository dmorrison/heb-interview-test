
// Mock db with sample users and data lookup methods.

const users = [
  {
    accountNumber: "1111",
    pin: "1234", // TODO: Improve security of this to not have password in plain text.
    balance: 1000,
    dailyWithdrawalLimit: 500,
  },
  {
    accountNumber: "2222",
    pin: "1234",
    balance: 400,
    dailyWithdrawalLimit: 500,
  },
  {
    accountNumber: "3333",
    pin: "1234",
    balance: 0,
    dailyWithdrawalLimit: 500,
  },
];

export function getUserByAccountNumber(accountNumber) {
  return users.find((u) => u.accountNumber === accountNumber);
}
