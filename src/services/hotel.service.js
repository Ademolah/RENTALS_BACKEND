import { Hotel } from '../models/Hotel.js';
import { User } from '../models/User.js';

export const getAllHotels = async (queryString) => {
  const queryObj = { ...queryString };
  const excludedFields = ['page', 'sort', 'limit'];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  const filter = JSON.parse(queryStr);

  // Structural text filtering engine
  if (filter.locality) {
    filter.locality = { $regex: new RegExp(filter.locality, 'i') };
  }

  let query = Hotel.find(filter).lean();

  // Sorting matrix
  if (queryString.sort) {
    query = query.sort(queryString.sort.split(',').join(' '));
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination pipeline
  const page = parseInt(queryString.page, 10) || 1;
  const limit = parseInt(queryString.limit, 10) || 10;
  query = query.skip((page - 1) * limit).limit(limit);

  const hotels = await query;
  const total = await Hotel.countDocuments(filter);

  // Premium Concierge Partner Mapping
  const agencyIds = [...new Set(hotels.map((h) => h.agencyId?.toString()).filter(Boolean))];
  const partners = await User.find({ agencyId: { $in: agencyIds }, role: 'HOTEL_ADMIN' })
    .select('firstName lastName email phoneNumber agencyId').lean();

  const partnerDictionary = partners.reduce((acc, p) => {
    acc[p.agencyId.toString()] = p;
    return acc;
  }, {});

  const enrichedHotels = hotels.map((hotel) => ({
    ...hotel,
    partner: partnerDictionary[hotel.agencyId?.toString()] || null
  }));

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hotels: enrichedHotels,
  };
};