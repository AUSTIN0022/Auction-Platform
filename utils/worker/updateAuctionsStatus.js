import cron from 'node-cron';
import { Auction } from '../../model/DBModel.js';

cron.schedule('*/5 * * * *', async () => {
  try {
    const now = new Date();

    // Activate pending auctions whose startDate has passed and endDate is in future
    const activated = await Auction.updateMany(
      { status: 'pending', startDate: { $lte: now }, endDate: { $gt: now } },
      { $set: { status: 'active' } }
    );

    // Complete auctions whose endDate has passed and are still pending or active
    const completed = await Auction.updateMany(
      { status: { $in: ['pending', 'active'] }, endDate: { $lte: now } },
      { $set: { status: 'completed' } }
    );

    console.log(`[${now.toISOString()}] Updated auctions: activated ${activated.modifiedCount}, completed ${completed.modifiedCount}`);
  } catch (err) {
    console.error('Error updating auction statuses:', err);
  }
});
