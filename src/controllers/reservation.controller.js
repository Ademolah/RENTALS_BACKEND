import  { Reservation }  from '../models/Reservation.js';
import { Hotel } from '../models/Hotel.js';

// @desc    Create a fresh verified hotel reservation
// @route   POST /api/reservations
export const createReservation = async (req, res) => {
    try {
        const {
            hotelId,
            roomTypeId,
            guestName,
            guestEmail,
            guestPhone,
            checkInDate,
            checkOutDate,
            specialRequests,
            corporateId
        } = req.body;

        // 1. Validation: Chronology Check
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (checkIn >= checkOut) {
            return res.status(400).json({
                success: false,
                message: 'Invalid timeline configuration: Check-out must succeed check-in date.'
            });
        }

        // 2. Verification: Confirm hotel and capture room pricing securely
        const hotelItem = await Hotel.findById(hotelId);
        if (!hotelItem) {
            return res.status(404).json({
                success: false,
                message: 'Target hospitality deployment matrix not found.'
            });
        }

        const selectedRoom = hotelItem.roomTypes.find(r => r._id.toString() === roomTypeId || r.id === roomTypeId);
        if (!selectedRoom) {
            return res.status(404).json({
                success: false,
                message: 'The requested suite configuration does not exist in this asset.'
            });
        }

        // 3. Calculation: Nightly delta and total amount verification
        const timeDelta = Math.abs(checkOut.getTime() - checkIn.getTime());
        const nightsCount = Math.ceil(timeDelta / (1000 * 60 * 60 * 24));

        const calculatedTotal = selectedRoom.pricePerNight * nightsCount;

        // 4. Persistence: Commit to database ledger
        const reservation = await Reservation.create({
            hotel: hotelId,
            roomTypeId,
            roomTypeName: selectedRoom.name || selectedRoom.title,
            guestName,
            guestEmail,
            guestPhone,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            numberOfNights: nightsCount,
            pricePerNight: selectedRoom.pricePerNight,
            totalAmount: calculatedTotal,
            specialRequests,
            corporateId
        });

        res.status(201).json({
            success: true,
            message: 'Reservation pipeline initialized successfully.',
            data: reservation
        });

    } catch (error) {
        console.error('🚨 [Reservation Engine Failure]:', error);
        res.status(500).json({
            success: false,
            message: 'Critical error processing reservation routing payload.',
            error: error.message
        });
    }
};

// @desc    Retrieve all reservations for the Concierge Admin Dashboard
// @route   GET /api/reservations
export const getAdminDashboardFeed = async (req, res) => {
    try {
        const bookings = await Reservation.find()
            .populate('hotel', 'title locality state mediaUrls')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Dashboard pipeline data drop.',
            error: error.message
        });
    }
};