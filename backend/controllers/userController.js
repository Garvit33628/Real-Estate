import User from '../models/User.js';

export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};

    const users = await User.find(filter).select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['user', 'admin']; // Optional future role: 'agent'

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid target role specified' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role successfully updated to ${role}`,
      data: { _id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { propertyId } = req.params;

    const isFav = user.favorites.includes(propertyId);

    if (isFav) {
      user.favorites = user.favorites.filter((id) => id.toString() !== propertyId);
    } else {
      user.favorites.push(propertyId);
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: isFav ? 'Removed from favorites' : 'Saved to favorites',
      data: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};