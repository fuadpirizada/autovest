import { Transaction } from "@shared/schema";
import { format } from "date-fns";

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions,
  limit
}) => {
  const displayTransactions = limit 
    ? transactions.slice(0, limit) 
    : transactions;
  
  if (transactions.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
      </div>
    );
  }

  const getTransactionIconClass = (type: string) => {
    switch (type) {
      case 'deposit':
        return "bg-amber-500";
      case 'withdrawal':
        return "bg-purple-500";
      case 'return':
        return "bg-teal-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return "fa-solid fa-arrow-up";
      case 'withdrawal':
        return "fa-solid fa-wallet";
      case 'return':
        return "fa-solid fa-arrow-down";
      default:
        return "fa-solid fa-circle-info";
    }
  };

  const getTransactionAmountClass = (type: string) => {
    switch (type) {
      case 'return':
        return "text-teal-500 dark:text-teal-400";
      case 'withdrawal':
        return "text-purple-500 dark:text-purple-400";
      case 'deposit':
        return "";
      default:
        return "";
    }
  };

  const formatAmount = (type: string, amount: number) => {
    if (type === 'return') {
      return `+$${Math.abs(amount).toFixed(2)}`;
    } else {
      return `$${Math.abs(amount).toFixed(2)}`;
    }
  };

  return (
    <div className="space-y-3">
      {displayTransactions.map((transaction) => (
        <div 
          key={transaction.id} 
          className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex justify-between items-center"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full ${getTransactionIconClass(transaction.type)} flex items-center justify-center text-white`}>
              <i className={getTransactionIcon(transaction.type)}></i>
            </div>
            <div>
              <p className="font-medium">
                {transaction.type === 'return' 
                  ? 'Weekly Return' 
                  : transaction.type === 'withdrawal' 
                    ? 'Withdrawal' 
                    : 'Investment'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(transaction.date), "MMM d, yyyy • h:mm a")}
              </p>
            </div>
          </div>
          <span className={`font-medium ${getTransactionAmountClass(transaction.type)}`}>
            {formatAmount(transaction.type, transaction.amount)}
          </span>
        </div>
      ))}
      
      {transactions.length > (limit || 0) && limit && (
        <a href="/dashboard" className="block text-center text-sm text-amber-500 hover:text-amber-400 transition-colors mt-2">
          View All Transactions
        </a>
      )}
    </div>
  );
};

export default TransactionList;
