const { Room, Booking } = require('./index');

describe('Room y Booking unit tests', () => {
  let room, booking;
  beforeEach(() => {
    room = new Room('A101', [], 10000, 10);
    booking = new Booking({
      guest: 'Alice',
      email: 'a@e.com',
      checkIn: new Date('2025-01-10'),
      checkOut: new Date('2025-01-15'),
      discount: 5,
      room
    });
    room.Bookings.push(booking);
  });

  test('isOccupied debe detectar fechas dentro de booking', () => {
    expect(room.isOccupied(new Date('2025-01-12'))).toBe(true);
    expect(room.isOccupied(new Date('2025-01-16'))).toBe(false);
  });

  test('occupancyPercentage calcula bien el %', () => {
    // del 10 al 15 = 6 días, uno ocupado -> 100%
    expect(room.occupancyPercentage(new Date('2025-01-10'), new Date('2025-01-15'))).toBe(100);
  });

  test('Booking.fee aplica descuento correctamente', () => {

    expect(booking.fee).toBe(47500);
  });


});
