import mongoose from "mongoose";

const actionSchema = new mongoose.Schema(
  {
    requisitionId: { type: mongoose.Schema.Types.ObjectId, ref: "Requisition", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: ["create", "approve", "reject", "comment"],
      required: true,
    },
    comment: String,
  },
  { timestamps: true }
);

export default mongoose.model("Action", actionSchema);
