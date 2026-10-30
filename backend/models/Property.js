import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    type: {
      type: String,
      enum: ['apartment', 'house', 'villa', 'land', 'commercial'],
      required: true,
    },
    status: {
      type: String,
      enum: ['for_sale', 'for_rent', 'sold', 'rented'],
      default: 'for_sale',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
      },
      zipCode: {
        type: String,
      },
    },
    
    bedrooms: {
      type: Number,
      default: 0,
    },
    bathrooms: {
      type: Number,
      default: 0,
    },
    areaSqFt: {
      type: Number,
      required: [true, 'Area in square feet is required'],
    },
    amenities: [
      {
        type: String, 
      }
    ],
    
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true }, 
      },
    ],
   
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

propertySchema.index({ status: 1, type: 1, price: 1 });

const Property = mongoose.model('Property', propertySchema);
export default Property;