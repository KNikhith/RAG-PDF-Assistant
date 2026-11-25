import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    chunkCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Document', documentSchema);