import Requisition from "../../models/requisition.model.js";
import User from "../../models/user.model.js";
import Action from "../../models/action.model.js";

// 🟢 Create new requisition
export const createRequisition = async (req, res) => {
  try {
    const { title, description, department, totalAmount, items, labels } = req.body;

    if (!title || !department || !totalAmount || !items?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Auto-generate workflow with approvers
    const roles = ["dept_head", "reviewer", "approver", "finance", "admin"];
    const workflow = [];

    for (const role of roles) {
      const filter = role === "dept_head" ? { role, department } : { role };
      const approver = await User.findOne(filter);

      if (!approver) {
        console.warn(`No user found for role: ${role} in department: ${department}`);
      }

      workflow.push({
        role,
        approverId: approver ? approver._id : null,
        status: role === "dept_head" ? "pending" : "waiting",
      });
    }

    const requisition = await Requisition.create({
      title,
      description,
      department,
      requesterId: req.user._id,
      totalAmount,
      items,
      labels,
      workflow,
      currentLevel: 0,
      status: "Pending",
    });

    await Action.create({
      requisitionId: requisition._id,
      userId: req.user._id,
      action: "create",
      comment: "Requisition created",
    });

    res.status(201).json({ message: "Requisition created", requisition });
  } catch (err) {
    console.error("Create Requisition Error:", err);
    res.status(500).json({ message: "Failed to create requisition" });
  }
};

// 🟡 Get all requisitions for logged-in user
export const getMyRequisitions = async (req, res) => {
  try {
    const requisitions = await Requisition.find({ requesterId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(requisitions);
  } catch (err) {
    console.error("Get My Requisitions Error:", err);
    res.status(500).json({ message: "Failed to fetch requisitions" });
  }
};

// 🔵 Approve or reject a requisition step
export const updateRequisitionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, comment } = req.body;

    const requisition = await Requisition.findById(id);
    if (!requisition) return res.status(404).json({ message: "Requisition not found" });

    const step = requisition.workflow[requisition.currentLevel];

    // Null-safe check for approverId
    if (!step || !step.approverId) {
      return res.status(400).json({ message: `Workflow step has no approver assigned for role: ${step?.role}` });
    }

    if (step.approverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: `Not authorized to act on this step. Required role: ${step.role}` });
    }

    // Update step
    step.status = decision === "approve" ? "approved" : "rejected";
    step.comment = comment || "";
    step.decisionAt = new Date();

    // Move to next step or finalize
    if (decision === "approve") {
      if (requisition.currentLevel + 1 < requisition.workflow.length) {
        requisition.currentLevel += 1;
        const nextStep = requisition.workflow[requisition.currentLevel];
        if (nextStep) nextStep.status = "pending";
      } else {
        requisition.status = "Completed";
      }
    } else {
      requisition.status = "Rejected";
    }

    await requisition.save();

    // Record action
    await Action.create({
      requisitionId: requisition._id,
      userId: req.user._id,
      action: decision === "approve" ? "approve" : "reject",
      comment,
    });

    const nextStep = requisition.workflow[requisition.currentLevel] || null;

    res.status(200).json({
      message: "Requisition updated",
      requisition,
      nextStep,
    });
  } catch (err) {
    console.error("Update Requisition Status Error:", err);
    res.status(500).json({ message: "Failed to update requisition" });
  }
};
