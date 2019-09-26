import { Schema, Document, model } from 'mongoose';

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255
    }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

interface IService extends Document {
  name: string;
}

export default model<IService>('Service', serviceSchema);
