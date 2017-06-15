import mongoose from 'mongoose';
import { Room } from '../services/room/model';

/**
 * This function is responsible for activiating a room for auction. It will
 * activate the room for 10 minutes, starting from currnt time. It takes 2
 * parameters (id of the room, and a callback).
 */
const activateRoom = (id: string, processDoc: any): Promise<any> => {
  let endTime = new Date();
  endTime = new Date(endTime.getTime() + 10 * 60000);
  return Room.findByIdAndUpdate(
    { _id: id },
    {
      $set: { endTime: endTime }
    },
    {
      new: true
    })
    .exec()
    .then((room: mongoose.Document) => {
      processDoc(room);
    });
};

export { activateRoom };
