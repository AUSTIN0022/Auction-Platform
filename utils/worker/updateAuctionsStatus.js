import cron from 'node-cron';
import { Auction } from '../../model/DBModel.js';

cron.schedule('*/5 * * * *', async () => {
  try {
    const now = new Date();

    const activated = await Auction.updateMany(
      { status: 'pending', startDate: { $lte: now }, endDate: { $gt: now } },
      { $set: { status: 'active' } }
    );

    const completed = await Auction.updateMany(
      { status: 'active', endDate: { $lte: now } },
      { $set: { status: 'completed' } }
    );

    console.log(`[${now.toISOString()}] Updated auctions: activated ${activated.modifiedCount}, completed ${completed.modifiedCount}`);
  } catch (err) {
    console.error('Error updating auction statuses:', err);
  }
});
