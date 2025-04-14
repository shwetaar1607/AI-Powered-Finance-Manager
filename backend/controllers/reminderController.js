const Reminder = require("../models/Reminder");
const Expense = require("../models/Expense");

// Create a new reminder
exports.createReminder = async (req, res) => {
  const { name, description, dueDate, amount, reminderInterval } = req.body;

  try {
    const reminder = await Reminder.create({
      user: req.user._id,
      name,
      description,
      dueDate: new Date(dueDate),
      amount,
      reminderInterval,
      nextReminderDate: new Date(dueDate),
    });

    res.status(201).json(reminder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create reminder" });
  }
};

// Get all reminders for a user
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id })
      .sort({ dueDate: 1 });

    // Update remind status based on due date proximity
    const now = new Date();
    for (let reminder of reminders) {
      const daysUntilDue = Math.ceil((reminder.dueDate - now) / (1000 * 60 * 60 * 24));
      
      // Set remind true if within 1 day and not paid
      if (daysUntilDue <= 1 && !reminder.paid) {
        reminder.remind = true;
      } else if (reminder.paid) {
        reminder.remind = false;
      }
      await reminder.save();
    }

    res.json(reminders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch reminders" });
  }
};

// Update reminder (e.g., mark as paid)
const randomTransactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
exports.updateReminder = async (req, res) => {
  const { paid } = req.body;

  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    reminder.paid = paid !== undefined ? paid : reminder.paid;

    if (paid === true && reminder.recurrence) {
      // Add expense when paid
      await Expense.create({
        user: req.user._id,
        category: reminder.name,  // Use reminder name as expense category
        amount: reminder.amount,
        description: reminder.description || `Payment for ${reminder.name}`,
        date: new Date(),
        transaction_id: randomTransactionId,
      });

      // Reset for next cycle
      reminder.paid = false;
      reminder.remind = false;
      const nextDueDate = new Date(reminder.nextReminderDate);
      nextDueDate.setDate(nextDueDate.getDate() + reminder.reminderInterval);
      reminder.dueDate = nextDueDate;
      reminder.nextReminderDate = nextDueDate;
    } else if (paid === true && !reminder.recurrence) {
      // For non-recurring reminders, just mark as paid
      reminder.remind = false;
    }

    await reminder.save();
    res.json(reminder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update reminder" });
  }
};

// Delete reminder
exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete reminder" });
  }
};