from flask import Flask, make_response, jsonify, request
from flask_migrate import Migrate
from flask_cors import CORS
from models import db, Trip, WayMark
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)
CORS(app)

@app.route('/')
def index():
    return {"message": "WayMark API is running!"}

@app.route('/trips', methods=['GET'])
def get_trips():
    trips = Trip.query.all()
    return make_response(
        [trip.to_dict() for trip in trips], 
        200
    )

# NEW: Update Trip route to save Cloudinary Video URLs
@app.route('/trips/<int:id>', methods=['PATCH'])
def update_trip(id):
    trip = Trip.query.get(id)
    if not trip:
        return make_response({"error": "Trip not found"}, 404)
    
    data = request.get_json()
    
    # Update video_url if it's in the request
    if 'video_url' in data:
        trip.video_url = data['video_url']
    if 'title' in data:
        trip.title = data['title']
    if 'description' in data:
        trip.description = data['description']
    
    try:
        db.session.commit()
        return make_response(trip.to_dict(), 200)
    except Exception as e:
        db.session.rollback()
        return make_response({"error": str(e)}, 400)

@app.route('/waypoints', methods=['POST'])
def create_waypoint():
    data = request.get_json()
    try:
        new_waymark = WayMark(
            label=data.get('label'),
            story=data.get('story'),
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            timestamp_in_video=data.get('timestamp_in_video'),
            trip_id=data.get('trip_id')
        )
        db.session.add(new_waymark)
        db.session.commit()
        return make_response(new_waymark.to_dict(), 201)
    except Exception as e:
        db.session.rollback()
        return make_response({"error": str(e)}, 400)

@app.route('/waypoints/<int:id>', methods=['PATCH'])
def update_waypoint(id):
    waymark = WayMark.query.get(id)
    if not waymark:
        return make_response({"error": "WayMark not found"}, 404)
    
    data = request.get_json()
    
    if 'label' in data: waymark.label = data['label']
    if 'story' in data: waymark.story = data['story']
    if 'timestamp_in_video' in data: waymark.timestamp_in_video = data['timestamp_in_video']
    
    try:
        db.session.commit()
        return make_response(waymark.to_dict(), 200)
    except Exception as e:
        db.session.rollback()
        return make_response({"error": str(e)}, 400)

@app.route('/waypoints/<int:id>', methods=['DELETE'])
def delete_waypoint(id):
    waymark = WayMark.query.get(id)
    if not waymark:
        return make_response({"error": "WayMark not found"}, 404)
    
    try:
        db.session.delete(waymark)
        db.session.commit()
        return make_response({"message": "WayMark deleted successfully"}, 200)
    except Exception as e:
        db.session.rollback()
        return make_response({"error": str(e)}, 400)

@app.route('/trips/<int:id>', methods=['GET'])
def get_trip_by_id(id):
    trip = Trip.query.filter_by(id=id).first()
    if not trip:
        return make_response({"error": "Trip not found"}, 404)
    return make_response(trip.to_dict(), 200)

if __name__ == '__main__':
    app.run(port=5555, debug=True)