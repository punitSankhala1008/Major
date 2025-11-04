"""
Test MongoDB database connection and operations
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

async def test_database():
    """Test database connection and basic operations"""
    print("=" * 70)
    print("🧪 Testing MongoDB Database Connection")
    print("=" * 70)
    
    # Get MongoDB URI from environment
    mongo_uri = os.getenv("MONGO_DB_URI")
    
    if not mongo_uri:
        print("❌ MONGO_DB_URI not found in .env file!")
        print("\n💡 Add this to your .env file:")
        print("MONGO_DB_URI=mongodb+srv://username:password@cluster.mongodb.net/")
        return
    
    print(f"\n📡 Connecting to MongoDB...")
    print(f"   URI: {mongo_uri[:20]}...{mongo_uri[-20:]}")
    
    try:
        # Create client
        client = AsyncIOMotorClient(mongo_uri)
        
        # Test connection with ping
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB!")
        
        # Get database and collection
        db = client.get_database("medical_records")
        collection = db.get_collection("patient_registrations")
        
        print(f"\n📊 Database: medical_records")
        print(f"📁 Collection: patient_registrations")
        
        # Count documents
        count = await collection.count_documents({})
        print(f"\n📈 Total patient records: {count}")
        
        # Insert test record
        print("\n🧪 Testing insert operation...")
        test_record = {
            "name": "Test Patient",
            "age": 25,
            "gender": "Test",
            "contact": "0000000000",
            "address": "Test Address",
            "reason": "Database connection test",
            "conversationId": f"test_db_{int(datetime.now().timestamp())}",
            "createdAt": datetime.now(),
            "status": "test",
            "isTestRecord": True
        }
        
        result = await collection.insert_one(test_record)
        print(f"✅ Test record inserted with ID: {result.inserted_id}")
        
        # Retrieve the test record
        print("\n🔍 Testing query operation...")
        retrieved = await collection.find_one({"_id": result.inserted_id})
        if retrieved:
            print(f"✅ Test record retrieved successfully!")
            print(f"   Name: {retrieved.get('name')}")
            print(f"   Conversation ID: {retrieved.get('conversationId')}")
        
        # Delete test record
        print("\n🗑️ Cleaning up test record...")
        delete_result = await collection.delete_one({"_id": result.inserted_id})
        if delete_result.deleted_count > 0:
            print("✅ Test record deleted successfully!")
        
        # Get recent records (non-test)
        print("\n📋 Recent patient records:")
        cursor = collection.find({"isTestRecord": {"$ne": True}}).sort("createdAt", -1).limit(5)
        records = await cursor.to_list(length=5)
        
        if records:
            for i, record in enumerate(records, 1):
                print(f"\n   {i}. {record.get('name', 'N/A')}")
                print(f"      Conversation: {record.get('conversationId', 'N/A')}")
                print(f"      Created: {record.get('createdAt', 'N/A')}")
        else:
            print("   No patient records found yet.")
        
        print("\n" + "=" * 70)
        print("✅ All database tests passed!")
        print("=" * 70)
        print("\n💡 Your database is configured correctly!")
        print("   The backend will now save patient data automatically.")
        
        # Close connection
        client.close()
        
    except Exception as e:
        print(f"\n❌ Database connection failed!")
        print(f"   Error: {str(e)}")
        print("\n🔧 Troubleshooting:")
        print("   1. Check your MONGO_DB_URI in .env file")
        print("   2. Verify MongoDB cluster is running")
        print("   3. Check network connection")
        print("   4. Verify username and password are correct")
        print("   5. Ensure IP address is whitelisted in MongoDB Atlas")


if __name__ == "__main__":
    asyncio.run(test_database())
