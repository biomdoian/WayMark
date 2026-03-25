from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin

db = SQLAlchemy()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    avatar_url = db.Column(db.String) # For the "Author" section in UI

    trips = db.relationship('Trip', backref='user', lazy=True)
    
    serialize_rules = ('-trips.user', '-password_hash')

class Trip(db.Model, SerializerMixin):
    __tablename__ = 'trips'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    subtitle = db.Column(db.String(255)) # Added for Chronicles.tsx
    body = db.Column(db.Text)             # Added for Markdown content
    status = db.Column(db.String(20), default="published") # "published" or "draft"
    video_url = db.Column(db.String) 
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    waymarks = db.relationship('WayMark', backref='trip', cascade="all, delete-orphan")
    
    # We rename waymarks to linkedWaymarks in the JSON to match the frontend
    serialize_rules = ('-waymarks.trip', '-user.trips')

    def to_dict(self):
        return {
            "id": str(self.id),
            "title": self.title,
            "subtitle": self.subtitle or "",
            "body": self.body or "",
            "status": self.status,
            "publishedAt": self.created_at.strftime("%b %d, %Y"),
            "author": {"name": self.user.username, "avatarUrl": self.user.avatar_url or ""},
            "linkedWaymarks": [wm.to_dict() for wm in self.waymarks],
            "video_url": self.video_url
        }

class WayMark(db.Model, SerializerMixin):
    __tablename__ = 'waymarks'
    
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(100)) 
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False)
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "title": self.label,
            "lat": self.latitude,
            "lng": self.longitude
        }