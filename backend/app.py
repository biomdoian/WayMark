from flask import Flask, make_response, jsonify
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
    # Using the SerializerMixin from models.py
    return make_response(
        [trip.to_dict() for trip in trips], 
        200
    )

@app.route('/trips/<int:id>', methods=['GET'])
def get_trip_by_id(id):
    trip = Trip.query.filter_by(id=id).first()
    if not trip:
        return make_response({"error": "Trip not found"}, 404)
    return make_response(trip.to_dict(), 200)

if __name__ == '__main__':
    app.run(port=5555, debug=True)