import { Schema, Document, model } from "mongoose";

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 30
    },
    description: {
      type: String,
      required: false,
      min: 6,
      max: 255
    },
    model_schema: {
      type: Object,
      required: true,
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export interface IService extends Document {
  name: string;
  description: string;
  model_schema: string;
}

export default model<IService>("Service", serviceSchema);
