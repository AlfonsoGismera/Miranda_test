class Booking {
  constructor({ name, email, checkIn, checkOut, discount, room }) {
    this.name = name;
    this.email = email;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.discount = discount;
    this.room = room;
  }

  get fee() {
    // calcular noches
    const msPerDay = 24*60*60*1000;
    const nights = Math.round((this.checkOut - this.checkIn) / msPerDay);
    let base = nights * this.room.rate;
    // aplicar descuento de habitación
    base = base * (1 - this.room.discount/100);
    // aplicar descuento de booking
    base = base * (1 - this.discount/100);
    return Math.round(base);
  }
}

class Room {
  constructor(name, bookings = [], rate = 0, discount = 0) {
    this.name = name;
    this.bookings = bookings;
    this.rate = rate;
    this.discount = discount;
  }

  isOccupied(date) {
    return this.bookings.some(b =>
      date >= b.checkIn && date < b.checkOut
    );
  }

  occupancyPercentage(startDate, endDate) {
    const msPerDay = 24*60*60*1000;
    const totalDays = Math.round((endDate - startDate)/msPerDay) + 1;
    let occupied = 0;
    for (let i=0; i<totalDays; i++) {
      const d = new Date(startDate.getTime() + i*msPerDay);
      if (this.isOccupied(d)) occupied++;
    }
    return (occupied/totalDays)*100;
  }

  static totalOccupancyPercentage(rooms, startDate, endDate) {
    const sum = rooms.reduce((acc, r) => acc + r.occupancyPercentage(startDate,endDate), 0);
    return sum / rooms.length;
  }

  static availableRooms(rooms, startDate, endDate) {
    return rooms.filter(r =>
      // ningún día está ocupado
      r.occupancyPercentage(startDate,endDate) === 0
    );
  }
}

module.exports = { Room, Booking };
