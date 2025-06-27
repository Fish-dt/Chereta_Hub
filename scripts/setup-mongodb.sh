#!/bin/bash

# Start MongoDB service (varies by OS)
# For macOS with Homebrew:
brew services start mongodb-community

# For Ubuntu/Debian:
sudo systemctl start mongod

# For Windows, start MongoDB as a service or run:
# mongod --dbpath "C:\data\db"

# Create the database and initial collections
mongosh --eval "
use auctionhub;

// Create collections with validation
db.createCollection('users', {
  validator: {
    \$jsonSchema: {
      bsonType: 'object',
      required: ['email', 'firstName', 'lastName', 'password'],
      properties: {
        email: { bsonType: 'string' },
        firstName: { bsonType: 'string' },
        lastName: { bsonType: 'string' },
        password: { bsonType: 'string' }
      }
    }
  }
});

db.createCollection('auctions');
db.createCollection('bids');
db.createCollection('watchlist');
db.createCollection('categories');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.auctions.createIndex({ category: 1 });
db.auctions.createIndex({ endTime: 1 });
db.auctions.createIndex({ title: 'text', description: 'text' });
db.bids.createIndex({ auctionId: 1, timestamp: -1 });

print('Database setup complete!');
"
