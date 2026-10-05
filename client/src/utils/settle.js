const toPaise = (rupees) => Math.round(rupees * 100);
const toRupees = (paise) => paise / 100;

function equalSplit(amount, memberIds) {
  const n = memberIds.length;
  const base = Math.floor(amount / n);
  let remainder = amount - base * n;
  const shares = {};
  memberIds.forEach((id) => {
    shares[id] = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;
  });
  return shares;
}

export function calculateNetBalances(expenses, members) {
  const balance = {};
  members.forEach((m) => (balance[m] = 0));

  expenses.forEach((exp) => {
    const amount = toPaise(exp.amount);
    balance[exp.paidBy] += amount;
    const shares = equalSplit(amount, exp.splitAmong);
    for (const id in shares) balance[id] -= shares[id];
  });
  return balance;
}

export function simplifyDebts(balance) {
  const creditors = [], debtors = [];
  for (const person in balance) {
    if (balance[person] > 0) creditors.push({ person, amount: balance[person] });
    else if (balance[person] < 0) debtors.push({ person, amount: -balance[person] });
  }
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const settled = Math.min(debtors[i].amount, creditors[j].amount);
    transactions.push({
      from: debtors[i].person,
      to: creditors[j].person,
      amount: toRupees(settled),
    });
    debtors[i].amount -= settled;
    creditors[j].amount -= settled;
    if (debtors[i].amount === 0) i++;
    if (creditors[j].amount === 0) j++;
  }
  return transactions;
}

export function toRupeeDisplay(paise) {
  return (paise / 100).toFixed(2);
}