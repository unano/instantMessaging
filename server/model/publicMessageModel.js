const mongoose = require("mongoose");

const PublicMessageSchema = mongoose.Schema(
  {
    name:{ type: String, required: true },
    room:{ type: Number, required: true },
    message: {
      text: { type: String, required: true },
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PublicMessages", PublicMessageSchema);