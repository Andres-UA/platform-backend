import { Schema, Document, model } from 'mongoose';

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
    participants: {
      type: Object,
      required: true
    },
    assets: {
      type: Object,
      required: true
    }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export interface IService extends Document {
  name: string;
  description: string;
  participants: string;
  assets: string;
}

export default model<IService>('Service', serviceSchema);
