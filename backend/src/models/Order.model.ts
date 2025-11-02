import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  sweetId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  userId: string;
  orderId: string;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  sweetId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
orderSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IOrder>('Order', orderSchema);

