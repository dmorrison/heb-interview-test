
export default function AccountInfo(props) {
  const { user } = props;

  return (
    <div className="grid grid-cols-2">
      <div>Account Number: {user.accountNumber}</div>
      <div>Daily Withdrawal Limit: ${user.dailyWithdrawalLimit}</div>
      <div>Current Balance: ${user.balance}</div>
      <div>Amount Available to Withdraw Today: ${user.dailyWithdrawalAmountRemaining}</div>
    </div>
  );
}
