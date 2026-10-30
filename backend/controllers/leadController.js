import Lead from '../models/Lead.js';
import Property from '../models/Property.js';

export const createLead = async (req, res) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const assignedStaff = property.assignedStaff || null;

    const lead = await Lead.create({
      property: propertyId,
      user: req.user ? req.user._id : null, 
      name: req.user ? req.user.name : name,
      email: req.user ? req.user.email : email,
      phone: req.user ? req.user.phone || phone : phone,
      message,
      assignedStaff,
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully!',
      data: lead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignLead = async (req, res) => {
  try {
    const { staffId } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.assignedStaff = staffId;
    await lead.save();

    res.status(200).json({
      success: true,
      message: 'Staff member assigned to lead successfully',
      data: lead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    if (
      req.user.role === 'admin' &&
      lead.assignedStaff?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to manage this lead' });
    }

    
    if (status) {
      lead.status = status;
    }

  
    if (note) {
      lead.staffNotes.push({
        note,
        addedBy: req.user._id,
      });
    }

    await lead.save();

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeads = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'admin') {
      query.assignedStaff = req.user._id;
    }

    const leads = await Lead.find(query)
      .populate('property', 'title price location')
      .populate('assignedStaff', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};