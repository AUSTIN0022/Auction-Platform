import { User } from "../../model/DBModel.js";

export const getAllUsers = async (req, res) => {
    try {
        const result = await User.aggregate([
            {
                $facet:{
                    "users":[
                        { $project: { _id: 1, name: 1, email: 1, createdAt: 1, verifyStatus: 1, isActive:1}}
                    ],
                    "statusCounts": [
                        {
                            $group: {
                                _id: "$verifyStatus",
                                count: { $sum: 1}
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    users: 1,
                    counts: {
                        $reduce: {
                            input: "$statusCounts",
                            initialValue: { approveUsers: 0, rejectUsers: 0, pendingUsers: 0},
                            in: {
                                approveUsers: {
                                    $cond: [
                                        { $eq: ["$$this._id", "verified"]},
                                        "$$this.count",
                                        "$$value.approveUsers"
                                    ]
                                },
                                rejectUsers: {
                                    $cond: [
                                        { $eq: ["$$this._id", "rejected"]},
                                        "$$this.count",
                                        "$$value.rejectUsers"
                                    ]
                                },
                                pendingUsers: {
                                    $cond: [
                                        { $eq: ["$$this._id", "pending"]},
                                        "$$this.count",
                                        "$$value.pendingUsers"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]);

        const { users, counts } = result[0];
        
        
        res.json({ users, counts});

    }  catch (error) {
        console.error('Error fetching users with counts:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
};

export const getUserById = async (req, res) => {

};

export const verifyUser = async (req, res) => {

};

export const approveUser = async (req, res) => {

};

export const getVerificationDocuments = async (req, res) => {

};