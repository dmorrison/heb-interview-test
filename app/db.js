
// Mock db with sample users and data lookup methods.

if (!globalThis.users) {
  globalThis.users = [
    {
      accountNumber: "1111",

      // TODO: Improve security of this to not have password in plain text.
      pin: "1234",

      balance: 1000,
      dailyWithdrawalLimit: 500,

      // TODO: This stores the amount of withdrawals remaining for the day (so that
      // the limit won't be exceeded). This would need to be fleshed out with
      // a real implementation that tracks the amount of transactions made in
      // a day. As it stands, it will reset when the app is restarted.
      dailyWithdrawalAmountRemaining: 500,
    },
    {
      accountNumber: "2222",
      pin: "1234",
      balance: 400,
      dailyWithdrawalLimit: 500,
      dailyWithdrawalAmountRemaining: 500,
    },
    {
      accountNumber: "3333",
      pin: "1234",
      balance: 0,
      dailyWithdrawalLimit: 500,
      dailyWithdrawalAmountRemaining: 500,
    },
  ];
}

export function getUserByAccountNumber(accountNumber) {
  return globalThis.users.find((u) => u.accountNumber === accountNumber);
}

export function deposit(accountNumber, amount) {
  const user = getUserByAccountNumber(accountNumber);
  user.balance += amount;

  return { newBalance: user.balance };
}

export function withdraw(accountNumber, amount) {
  const user = getUserByAccountNumber(accountNumber);

  if (amount > user.dailyWithdrawalAmountRemaining) {
    throw new Error("Withdrawal amount exceeds daily withdrawal limit.");
  } else if (amount > user.balance) {
    throw new Error("Withdrawal amount is greater than balance.");
  }

  user.balance -= amount;
  user.dailyWithdrawalAmountRemaining -= amount;

  return {
    newBalance: user.balance,
    newDailyWithdrawalAmountRemaining: user.dailyWithdrawalAmountRemaining,
  };
}
