import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import {
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaPlusCircle,
  FaTrash,
  FaEdit, // Added for edit icon
} from "react-icons/fa";
import {
  getInvestments,
  createInvestment,
  updateInvestment,
  deleteInvestment,
} from "../../services/investmentService";
import AddInvestmentModal from "../../components/premium/AddInvestmentModal";
import EditInvestmentModal from "../../components/premium/EditInvestmentModal"; // New modal component

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const data = await getInvestments();
      setInvestments(data);
    } catch (error) {
      console.error("Failed to fetch investments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInvestment(id);
      setInvestments((prev) => prev.filter((inv) => inv._id !== id));
    } catch (error) {
      console.error("Failed to delete investment:", error);
    }
  };

  const handleEdit = (investment) => {
    setSelectedInvestment(investment);
    setIsEditModalOpen(true);
  };

  const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0);
  const avgRoi = investments.length
    ? (
        investments.reduce((sum, inv) => sum + inv.roi, 0) / investments.length
      ).toFixed(2)
    : 0;

  return (
    <Layout>
      <h1 className="text-3xl text-finance-dark font-bold mb-6">
        Investment Portfolio
      </h1>

      {/* Portfolio Summary */}
      <div className="p-6 bg-white rounded-lg shadow-md mb-6">
        <h2 className="text-xl text-finance-dark font-semibold mb-4">
          Portfolio Overview
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-finance-primary text-lg">
            Total Value:{" "}
            <span className="font-semibold">
              ${totalValue.toLocaleString()}
            </span>
          </p>
          <p className="text-finance-accent text-lg">
            Avg ROI: <span className="font-semibold">{avgRoi}%</span>
          </p>
        </div>
        <p className="mt-2 text-finance-success flex items-center">
          <FaArrowUp className="mr-2" /> Your investments have an average ROI of{" "}
          {avgRoi}%
        </p>
      </div>

      {/* Investment Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading investments...</p>
        ) : investments.length === 0 ? (
          <p>No investments found. Add one below!</p>
        ) : (
          investments.map((investment) => (
            <div
              key={investment._id}
              className="p-4 bg-white rounded-lg shadow-md relative group"
            >
              <h3 className="text-lg font-semibold text-finance-dark mb-2 flex items-center">
                <FaChartLine className="text-finance-primary mr-2" />{" "}
                {investment.category}
              </h3>
              <p className="text-finance-dark">{investment.description}</p>
              <p className="text-finance-primary font-semibold">
                Value: ${investment.value.toLocaleString()}
              </p>
              <p
                className={`text-${
                  investment.roi >= 0 ? "finance-success" : "finance-danger"
                }`}
              >
                {investment.roi >= 0 ? "📈" : "📉"} ROI: {investment.roi}%
              </p>
              {/* Edit and Delete Buttons on Hover */}
              <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(investment)}
                  className="text-finance-primary hover:text-finance-primary/80"
                  title="Edit Investment"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(investment._id)}
                  className="text-finance-danger hover:text-finance-danger/80"
                  title="Delete Investment"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Investment Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center bg-finance-accent text-white px-4 py-2 rounded-lg shadow hover:bg-finance-accent/90"
        >
          <FaPlusCircle className="mr-2" /> Add Investment
        </button>
      </div>

      {/* Modals */}
      <AddInvestmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchInvestments}
      />
      <EditInvestmentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        investment={selectedInvestment}
        onSuccess={fetchInvestments}
      />
    </Layout>
  );
};

export default Investments;
