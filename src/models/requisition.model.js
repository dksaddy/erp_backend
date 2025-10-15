import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  unitPrice: Number,
});

const workflowStepSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["dept_head", "reviewer", "approver", "finance", "admin"],
  },
  approverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["waiting", "pending", "approved", "rejected"],
    default: "waiting",
  },
  decisionAt: Date,
  comment: String,
});

const requisitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    department: { type: String, required: true },
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalAmount: { type: Number, required: true },
    labels: [String],
    items: [itemSchema],
    status: {
      type: String,
      enum: ["Pending", "Rejected", "Completed"],
      default: "Pending",
    },
    currentLevel: { type: Number, default: 0 },
    workflow: [workflowStepSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Requisition", requisitionSchema);
