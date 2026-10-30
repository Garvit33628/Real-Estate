import Property from '../models/Property.js';
import { cloudinary } from '../utils/cloudinary.js';

export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      status,
      price,
      address,
      city,
      state,
      zipCode,
      bedrooms,
      bathrooms,
      areaSqFt,
      amenities,
      assignedStaff,
    } = req.body;

    const images = req.files
      ? req.files.map((file) => ({
          url: file.path,
          public_id: file.filename,
        }))
      : [];

    const property = await Property.create({
      title,
      description,
      type,
      status,
      price: Number(price),
      location: {
        address,
        city,
        state,
        zipCode,
      },
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      areaSqFt: Number(areaSqFt),
      amenities: typeof amenities === 'string' ? amenities.split(',') : amenities,
      images,
      createdBy: req.user._id,
      assignedStaff: assignedStaff || req.user._id, // Defaults to creator if unspecified
    });

    res.status(201).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProperties = async (req, res) => {
  try {
    const { type, status, city, minPrice, maxPrice, bedrooms } = req.query;

    let query = { isPublished: true };

    if (type) query.type = type;
    if (status) query.status = status;
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(query)
      .populate('assignedStaff', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.assignedStaff?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    const { title, description, type, status, price, address, city, state, zipCode,
      bedrooms, bathrooms, areaSqFt, amenities } = req.body;

    if (title !== undefined) property.title = title;
    if (description !== undefined) property.description = description;
    if (type !== undefined) property.type = type;
    if (status !== undefined) property.status = status;
    if (price !== undefined) property.price = Number(price);
    if (bedrooms !== undefined) property.bedrooms = Number(bedrooms);
    if (bathrooms !== undefined) property.bathrooms = Number(bathrooms);
    if (areaSqFt !== undefined) property.areaSqFt = Number(areaSqFt);
    if (address !== undefined) property.location.address = address;
    if (city !== undefined) property.location.city = city;
    if (state !== undefined) property.location.state = state;
    if (zipCode !== undefined) property.location.zipCode = zipCode;
    if (amenities !== undefined) {
      property.amenities = typeof amenities === 'string'
        ? amenities.split(',').map((item) => item.trim()).filter(Boolean)
        : amenities;
    }

    await property.save();

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (
      req.user.role === 'admin' &&
      property.assignedStaff?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    if (property.images && property.images.length > 0) {
      for (const img of property.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    await property.deleteOne();

    res.status(200).json({ success: true, message: 'Property and associated images deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};