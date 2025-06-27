-- MongoDB doesn't use SQL, but here's the equivalent structure for reference
-- This would be implemented using MongoDB collections

-- Users Collection
{
  "_id": ObjectId,
  "email": String,
  "password": String, // hashed
  "firstName": String,
  "lastName": String,
  "avatar": String,
  "rating": Number,
  "totalSales": Number,
  "memberSince": Date,
  "isVerified": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}

-- Auctions Collection
{
  "_id": ObjectId,
  "title": String,
  "description": String,
  "category": String,
  "condition": String,
  "images": [String],
  "startingBid": Number,
  "currentBid": Number,
  "buyNowPrice": Number,
  "endTime": Date,
  "sellerId": ObjectId,
  "status": String, // active, ended, cancelled
  "bidCount": Number,
  "watchers": Number,
  "specifications": Object,
  "shippingInfo": Object,
  "createdAt": Date,
  "updatedAt": Date
}

-- Bids Collection
{
  "_id": ObjectId,
  "auctionId": ObjectId,
  "userId": ObjectId,
  "amount": Number,
  "timestamp": Date,
  "isWinning": Boolean
}

-- Watchlist Collection
{
  "_id": ObjectId,
  "userId": ObjectId,
  "auctionId": ObjectId,
  "addedAt": Date
}

-- Categories Collection
{
  "_id": ObjectId,
  "name": String,
  "description": String,
  "icon": String,
  "itemCount": Number
}
