import { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import {
  getPlaidLinkToken,
  exchangePlaidToken,
  getPlaidTransactions,
  getTransactions,
} from "../../services/transactionService";
import { getCurrentUser } from "../../services/authService";

const PlaidLinkComponent = () => {
  const [linkToken, setLinkToken] = useState(null);
  const [transactionsByAccount, setTransactionsByAccount] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || !user._id) {
      setError("Please log in to link your bank");
      return;
    }

    const fetchToken = async () => {
      try {
        const data = await getPlaidLinkToken(user._id);
        setLinkToken(data.link_token);
      } catch (err) {
        console.error("Error fetching link token:", err);
        setError("Failed to initialize bank linking");
      }
    };

    fetchToken();
  }, []);

  const fetchTransactionsFromAPI = async (usePlaid = false) => {
    setLoading(true);
    try {
      let data;
      if (usePlaid) {
        // Call getPlaidTransactions when explicitly refreshing
        data = await getPlaidTransactions();
      } else {
        // Call getTransactions by default
        const res = await getTransactions();
        data = res.data; // Assuming getTransactions returns { data: [...] }
      }

      const grouped = data.reduce((acc, tx) => {
        if (!acc[tx.account_id]) acc[tx.account_id] = [];
        acc[tx.account_id].push(tx);
        return acc;
      }, {});
      setTransactionsByAccount(grouped);
      setError(null);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions, connect a bank account");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch transactions using getTransactions on component mount
    fetchTransactionsFromAPI(false);
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      try {
        await exchangePlaidToken(
          public_token,
          metadata.institution?.name || "Unknown"
        );
        alert("Bank account linked successfully!");
        await fetchTransactionsFromAPI(true); // Use getPlaidTransactions after linking
      } catch (err) {
        console.error("Error exchanging token:", err);
        alert("Failed to link bank account");
      }
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => open()}
          disabled={!ready}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Connect a bank account
        </button>
        <button
          onClick={() => fetchTransactionsFromAPI(true)} // Use getPlaidTransactions on refresh
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh Transactions"}
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <h2 className="text-2xl font-bold mt-8 mb-4">Bank Transactions</h2>
      {Object.keys(transactionsByAccount).map((accountId) => (
        <div key={accountId} className="mb-6 border p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-600 mb-3">
            Account: {accountId}
          </h3>
          <ul className="space-y-2">
            {transactionsByAccount[accountId].map((tx) => (
              <li
                key={tx.transaction_id}
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <div className="flex gap-3 items-center">
                  {tx.logo_url && (
                    <img
                      src={tx.logo_url}
                      alt="logo"
                      className="w-6 h-6 rounded"
                    />
                  )}
                  <div>
                    <div className="font-medium">
                      {tx.merchant_name || tx.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {tx.personal_finance_category?.primary ||
                        tx.category?.[0]}
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-700">
                  <div className="font-semibold">
                    ${Math.abs(tx.amount).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(tx.date).toLocaleDateString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PlaidLinkComponent;
