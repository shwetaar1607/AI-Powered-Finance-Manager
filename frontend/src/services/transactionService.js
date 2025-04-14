import api from "./api";

export const getPlaidTransactions = async () => {
  const res = await api.get("/plaid/transactions");
  return res.data;
};


export const getPlaidLinkToken = async (userId) => {
  const res = await api.get(`/plaid/link-token?id=${userId}`);
  return res.data;
};

export const exchangePlaidToken = async (public_token, institution) => {
  const res = await api.post("/plaid/exchange-token", {
    public_token,
    institution,
  });
  return res.data;
};


export const getTransactions = async () => {
    const res = await api.get("/transactions");
    return res;
}