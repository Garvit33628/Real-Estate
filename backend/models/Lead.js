import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Lead must be associated with a property'],
    },
    
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Inquiry message is required'],
      trim: true,
    },
  
    status: {
      type: String,
      enum: ['new', 'contacted', 'showing_scheduled', 'closed', 'lost'],
      default: 'new',
    },
   
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    
    staffNotes: [
      {
        note: String,
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ assignedStaff: 1, status: 1 });

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;