import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const commonFields = {
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
};

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: Number, required: true },
    verified: { type: Boolean, default: false },
    verifyStatus: { type: String, enum: ['verified', 'pending', 'rejected'], default: 'pending' },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    isActive: { type: Boolean, default: true },
    idProof: {type: String },
    profileImage: { type: String },
    address: { type: String },
    wallet: {
        balance: { type: Number, default: 0 },
        currency: { type: String, default: 'USD' },
        transactions: [{
            amount: { type: Number, required: true },
            type: { type: String, enum: ['deposit', 'withdrawal', 'emd', 'payment', 'refund'], required: true },
            description: { type: String },
            reference: { type: mongoose.Schema.Types.ObjectId, refPath: 'wallet.transactions.referenceModel' },
            referenceModel: { type: String, enum: ['auctions', 'payments'] },
            timestamp: { type: Date, default: Date.now }
        }]
    },
    ...commonFields
}, { timestamps: true });

const AuctionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    basePrice: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    registrationDeadline: { type: Date, required: true },
    emdAmount: { type: Number, required: true },
    status: { type: String, enum: ['draft', 'pending', 'active', 'completed', 'cancelled'], default: 'draft' },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'categories' }],
    bidders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    bidLog: [{ type: mongoose.Schema.Types.ObjectId, ref: 'bids' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    ...commonFields
}, { timestamps: true });

const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    ...commonFields
}, { timestamps: true });

const BidSchema = new Schema({
    bidAmount: { type: Number, required: true },
    auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'auctions', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    status: { type: String, enum: ['active', 'winning', 'outbid', 'cancelled'], default: 'active' },
    ...commonFields
}, { timestamps: true });

const PaymentSchema = new Schema({
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'auctions', required: true },
    paymentType: { type: String, enum: ['emd', 'final', 'refund'], required: true },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    ...commonFields
}, { timestamps: true });

const LogSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    action: { type: String, required: true },
    entityType: { type: String, enum: ['user', 'auction', 'bid', 'payment', 'system'], required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String }
}, { timestamps: true });


UserSchema.methods.softDelete = function() {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
};

AuctionSchema.methods.softDelete = function() {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
};


const User = mongoose.model('users', UserSchema);
const Auction = mongoose.model('auctions', AuctionSchema);
const Category = mongoose.model('categories', CategorySchema);
const Bid = mongoose.model('bids', BidSchema);
const Payment = mongoose.model('payments', PaymentSchema);
const Log = mongoose.model('logs', LogSchema);

export {
    Auction, Bid, Category, Log, Payment, User
};
