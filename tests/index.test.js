const { Room, Booking } = require('./index');

describe('Clase Booking', () => {
  let room;
  beforeEach(() => {
    room = new Room('101', [], 10000, 10); // rate=10000¢, discount=10%
  });

  test('fee sin descuentos', () => {
    const b = new Booking({
      name: 'Alice',
      email: 'a@x.com',
      checkIn: new Date('2023-01-01'),
      checkOut: new Date('2023-01-04'),
      discount: 0,
      room
    });
    // 3 noches × 10000¢ = 30000¢
    expect(b.fee).toBe(30000);
  });

  test('fee con descuento de booking y room', () => {
    room.discount = 20;    // 20% room
    const b = new Booking({
      name: 'Bob',
      email: 'b@x.com',
      checkIn: new Date('2023-01-01'),
      checkOut: new Date('2023-01-06'),
      discount: 10,        // +10% booking
      room
    });
    // base 5×10000=50000; room→ −20%→40000; booking→ −10%→36000
    expect(b.fee).toBe(36000);
  });
});

describe('Clase Room', () => {
  let r;
  beforeEach(() => {
    r = new Room('A', [], 5000, 0);
    // ocupamos 2–4 ene
    r.bookings.push(new Booking({ name:'x', email:'x', checkIn:new Date('2023-01-02'), checkOut:new Date('2023-01-04'), discount:0, room:r }));
  });

  test('isOccupied()', () => {
    expect(r.isOccupied(new Date('2023-01-01'))).toBe(false);
    expect(r.isOccupied(new Date('2023-01-02'))).toBe(true);
    expect(r.isOccupied(new Date('2023-01-04'))).toBe(false); 
    // checkOut se considera libre
  });

  test('occupancyPercentage en rango parcial', () => {
    // rango 1–5 ene (5 días), ocupados 2 y 3 → 2/5 = 40%
    expect(r.occupancyPercentage(new Date('2023-01-01'), new Date('2023-01-05')))
      .toBeCloseTo(40);
  });

  test('static totalOccupancyPercentage()', () => {
    const r2 = new Room('B', [], 5000, 0);
    // r2 sin reservas
    const pct = Room.totalOccupancyPercentage([r, r2], new Date('2023-01-01'), new Date('2023-01-05'));
    // r: 2/5=40%, r2:0% → media = 20%
    expect(pct).toBeCloseTo(20);
  });

  test('static availableRooms()', () => {
    const r3 = new Room('C', [], 5000, 0);
    // r ocupa durante 2–4, r3 libre
    const avail = Room.availableRooms([r, r3], new Date('2023-01-05'), new Date('2023-01-06'));
    // ambos están libres en ese rango
    expect(avail).toContain(r);
    expect(avail).toContain(r3);
  });
});
