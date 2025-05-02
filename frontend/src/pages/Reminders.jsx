import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import {
  FaBell,
  FaPlusCircle,
  FaClock,
  FaCheckCircle,
  FaTrash,
} from "react-icons/fa";
import {
  getReminders,
  updateReminder,
  deleteReminder,
} from "../services/reminderService";
import AddReminderModal from "../components/reminders/AddReminderModal"; // Assuming this path

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch reminders on mount
  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const data = await getReminders();
      setReminders(data);
    } catch (error) {
      console.error("Failed to fetch reminders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle marking a reminder as paid
  const handleMarkAsPaid = async (id) => {
    try {
      const updatedReminder = await updateReminder(id, { paid: true });
      setReminders((prev) =>
        prev.map((reminder) =>
          reminder._id === id ? { ...reminder, ...updatedReminder } : reminder
        )
      );

      window.dispatchEvent(new CustomEvent("reminder-updated"));
    } catch (error) {
      console.error("Failed to mark as paid:", error);
    }
  };

  // Handle deleting a reminder
  const handleDeleteReminder = async (id) => {
    try {
      await deleteReminder(id);
      setReminders((prev) => prev.filter((reminder) => reminder._id !== id));
    } catch (error) {
      console.error("Failed to delete reminder:", error);
    }
  };

  // Check if due date is within 1 day
  const isDueSoon = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffInMs = due - now;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays <= 1 && diffInMs > 0;
  };

  // Check if due date has already passed
  const isOverdue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    return now > due;
  };

  return (
    <Layout>
      <h1 className="text-3xl text-finance-dark font-bold mb-6">
        Reminders & Notifications
      </h1>

      {/* Add Reminder Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-finance-secondary text-white px-4 py-2 rounded-lg shadow hover:bg-finance-secondary/90"
        >
          <FaPlusCircle className="mr-2" /> Add Reminder
        </button>
      </div>

      {/* Reminder List */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl text-finance-dark font-semibold mb-4 flex items-center">
          <FaBell className="text-finance-primary mr-2" /> Upcoming Reminders
        </h2>

        {loading ? (
          <p>Loading reminders...</p>
        ) : reminders.length === 0 ? (
          <p className="text-gray-500">No reminders found. Add one below!</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {reminders.map((reminder) => {
              const dueSoon = isDueSoon(reminder.dueDate);
              const overdue = isOverdue(reminder.dueDate);
              const dueDateFormatted = new Date(
                reminder.dueDate
              ).toLocaleDateString();

              return (
                <li
                  key={reminder._id}
                  className="py-4 flex justify-between items-start sm:items-center sm:flex-row flex-col"
                >
                  <div className="mb-2 sm:mb-0">
                    <p className="text-lg font-semibold text-finance-dark">
                      {reminder.name}
                    </p>
                    <p className="text-sm text-finance-danger">
                      Amount: ${reminder.amount} – Due {dueDateFormatted}
                    </p>

                    {!reminder.paid && (
                      <>
                        {overdue ? (
                          <span className="text-red-500 font-semibold flex items-center mt-1">
                            <FaClock className="mr-1" /> Payment Delayed!
                          </span>
                        ) : dueSoon ? (
                          <span className="text-red-400 font-semibold flex items-center mt-1">
                            <FaClock className="mr-1" /> Pay Bill - Due Soon!
                          </span>
                        ) : null}
                      </>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                    <div className="text-sm text-gray-600 flex items-center">
                      <FaClock className="mr-1 text-finance-primary" />
                      {dueDateFormatted}
                    </div>

                    {/* Mark as Paid - Only if unpaid and dueSoon */}
                    {!reminder.paid && (dueSoon || overdue) && (
                      <button
                        onClick={() => handleMarkAsPaid(reminder._id)}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm hover:bg-green-200 transition"
                        title="Mark as Paid"
                      >
                        <FaCheckCircle className="inline mr-1" /> Paid
                      </button>
                    )}

                    {/* Delete Reminder */}
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this reminder?"
                          )
                        ) {
                          handleDeleteReminder(reminder._id);
                        }
                      }}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition"
                      title="Delete Reminder"
                    >
                      <FaTrash className="inline mr-1" /> Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Add Reminder Modal */}
      <AddReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchReminders} // Refresh reminders after adding
      />
    </Layout>
  );
};

export default Reminders;
