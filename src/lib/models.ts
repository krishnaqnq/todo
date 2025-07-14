import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: String,
  notes: String,
  points: Number,
  links: [String],
  images: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { _id: true });

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    default: 'Untitled Todo'
  },
  items: [ItemSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Todo = mongoose.models.Todo || mongoose.model('Todo', TodoSchema);
export const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);
