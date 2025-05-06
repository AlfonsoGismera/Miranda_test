class Booking {
    constructor({ guest, email, checkIn, checkOut, discount, room }) {
      this.guest = guest;
      this.email = email;
      this.checkIn = checkIn;
      this.checkOut = checkOut;
      this.discount = discount;
      this.room = room;
    }
    get fee() {
      const days = (this.checkOut - this.checkIn)/(1000*60*60*24) + 1;
      const base = this.room.Rate * days;
      return Math.round(base * (1 - this.discount/100) * (1 - this.room.Discount/100));
    }
  }
  
  class Room {
    constructor(Name, Bookings, Rate, Discount) {
      this.Name = Name;
      this.Bookings = Bookings;
      this.Rate = Rate;
      this.Discount = Discount;
    }
    isOccupied(date) {
      return this.Bookings.some(b => date >= b.checkIn && date <= b.checkOut);
    }
    occupancyPercentage(start, end) {
      const totalDays = (end - start)/(1000*60*60*24) + 1;
      let occ=0;
      for(let d=0; d<totalDays; d++){
        const day = new Date(start); day.setDate(day.getDate()+d);
        if(this.isOccupied(day)) occ++;
      }
      return Math.round(occ/totalDays*100);
    }
    static totalOccupancyPercentage(rooms, start, end) {
      const perc = rooms.reduce((sum,r)=> sum + r.occupancyPercentage(start,end),0);
      return Math.round(perc/rooms.length);
    }
    static availableRooms(rooms, start, end) {
      return rooms.filter(r=> r.occupancyPercentage(start,end)===0);
    }
  }
  
  module.exports = { Room, Booking };
  