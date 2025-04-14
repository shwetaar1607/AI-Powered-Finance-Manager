import React from 'react';
import Layout from '../../components/layout/Layout';

const Planning = () => {
  return (
    <Layout>
      <h1 className="text-3xl text-finance-dark font-bold mb-6">Financial Planning</h1>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl text-finance-dark font-semibold mb-4">Goals</h2>
        <p className="text-finance-dark">Save $10,000 by Dec 2025</p>
        <button className="mt-4 bg-finance-primary text-white px-4 py-2 rounded hover:bg-finance-primary/90">
          Update Plan
        </button>
      </div>
    </Layout>
  );
};

export default Planning;