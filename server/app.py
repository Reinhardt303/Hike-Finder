from models import  Hike, Hiker, Review
from flask import request, make_response, Flask, jsonify, session
from flask_restful import Resource
from flask_migrate import Migrate
from config import app, db, api
from sqlalchemy.exc import IntegrityError


class Hikers(Resource):
    def get(self):
        hikers = [h.to_dict(rules=('-reviews', )) for h in Hiker.query.all()]
        return make_response(hikers, 200)
    
    def post(self):
        req_data = request.get_json()
        try:
            hiker = Hiker(**req_data) # type: ignore
            db.session.add(hiker)
            db.session.commit()
            return make_response(hiker.to_dict(), 201)
        except ValueError as e:
            return make_response({"error": str(e)}, 400)
        
class HikersById(Resource):
    def get(self, id):
        try:
            hiker = Hiker.query.filter(Hiker.id == id).first()
            if not hiker:
                return make_response({"error": "Hiker not found"}, 404)
            return make_response(hiker.to_dict(), 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)
        
    def delete(self, id):
        hiker = Hiker.query.filter(Hiker.id == id).first()
        if not hiker:
            return make_response({"error": "Hiker not found"}, 404)
        db.session.delete(hiker)
        db.session.commit()
        return make_response({}, 204)
    
    def patch(self, id):
        hiker = Hiker.query.filter(Hiker.id == id).first()
        if not hiker:
            return make_response({"error": "Hiker not found"}, 404)
        req_json = request.get_json()
        try:
            for key, value in req_json.items(): # type: ignore
                setattr(hiker, key, value)
            db.session.add(hiker)
            db.session.commit()
            return make_response(hiker.to_dict(), 202)
        except Exception as e:
            return make_response({"error": str(e)}, 500)
        
class Hikes(Resource):
    def get(self):
        hikes = [hi.to_dict( rules=('-reviews',) ) for hi in Hike.query.all()]
        return make_response(hikes, 200)
    
    def post(self):
        try:
            req_json = request.get_json()
            new_hike = Hike(
                name=req_json['name'], # type: ignore
                city=req_json['city'], # type: ignore
                state=req_json['state'], # type: ignore
                length=int(req_json['length']), # type: ignore
                difficulty=int(req_json['difficulty']) # type: ignore
            )
            db.session.add(new_hike)
            db.session.commit()
            return make_response(new_hike.to_dict(), 201)
        except Exception as e:
            return make_response({'error': str(e)}, 400)

class HikesById(Resource):
    def get(self, id):
        try:
            hike = Hike.query.filter(Hike.id == id).first()
            if not hike:
                return make_response({'error': 'Hike not found'}, 404)
            else: 
                return make_response(hike.to_dict(), 200) 
        except Exception as e:
            return make_response({'error': str(e)}, 500)
        
    def delete(self, id):
        hike = Hike.query.filter(Hike.id == id).first()
        if not hike:
            return make_response({'error': 'Hike not found'}, 404)
        db.session.delete(hike)
        db.session.commit()
        return make_response({}, 204)
    
    def patch(self, id):
        hike = Hike.query.filter(Hike.id == id).first()
        if not hike:
            return make_response({"error": "Hike not found"}, 404)
        req_json = request.get_json()
        try:
            for key, value in req_json.items(): # type: ignore
                setattr(hike, key, value)
            db.session.add(hike)
            db.session.commit()
            return make_response(hike.to_dict(), 202)
        except Exception as e:
            return make_response({"error": str(e)}, 500)
        
class Reviews(Resource):
    def post(self):
        req_json = request.get_json()
        try:
            review = Review(**req_json) # type: ignore
            db.session.add(review)
            db.session.commit()
            return make_response(review.to_dict(), 201)
        except Exception as e:
            return make_response({'error': str(e)}, 400)
        
class ReviewsByHikesHiker(Resource): 
    def get(self, id):
        hike = Hike.query.get(id)
        if not hike:
            return {"error": "Hike not found"}, 404

        hike_dict = {} #hike dict

        for review in hike.reviews:
            hiker = review.hiker
            if hiker.id not in hike_dict:
                hike_dict[hiker.id] = hiker.to_dict(rules=('-reviews',))
                hike_dict[hiker.id]['reviews'] = []
            hike_dict[hiker.id]['reviews'].append(review.to_dict(rules=('-hiker', '-hike')))

        return list(hike_dict.values()), 200
        
class Signup(Resource):
    def post(self):
        req_json = request.get_json()

        if req_json.get("password") != req_json.get("password_confirmation"): # type: ignore
            return {"error": "Password confirmation does not match password"}, 400
        
        try:
            hiker = Hiker(
                username = req_json["username"], # type: ignore
                password = req_json.get("password"), # type: ignore
                name = req_json.get("name"), # type: ignore
                city = req_json.get("city"), # type: ignore
                state = req_json.get("state") # type: ignore
            )
            db.session.add(hiker)
            db.session.commit()
            session['hiker_id'] = hiker.id
            return {
                'id': hiker.id,
                'username': hiker.username,
                'name': hiker.name,
                'city': hiker.city,
                'state': hiker.state
            }, 201

        except (KeyError, ValueError, IntegrityError) as e:
            db.session.rollback()
            return {"error": f"Invalid signup: {str(e)}"}, 422

class CheckSession(Resource):
    def get(self):
        hiker_id = session.get('hiker_id')
        if hiker_id:
            hiker = Hiker.query.get(hiker_id)
            if hiker:
                return {
                    'id': hiker.id,
                    'username': hiker.username,
                    'name': hiker.name,
                    'city': hiker.city,
                    'state': hiker.state
                }, 200
        return {'error': "Unauthorized"}, 401

class Login(Resource):
    def post(self):
        req_json = request.get_json()

        if not req_json or 'username' not in req_json or 'password' not in req_json:
            return {'error': 'Missing username or password'}, 400

        hiker = Hiker.query.filter_by(username=req_json['username']).first()

        if hiker and hiker.authenticate(req_json['password']):
            session['hiker_id'] = hiker.id
            return {
                'id': hiker.id,
                'username': hiker.username,
                'name': hiker.name,
                'city': hiker.city,
                'state': hiker.state
            }, 200
        else:
            return {'error': 'Invalid username or password'}, 401

class Logout(Resource):
    def delete(self):
        hiker_id = session.get('hiker_id')
        if hiker_id:
            session.pop('hiker_id', None)
            return {}, 204
        else:
            return {'error': 'Not logged in'}, 401 
        
class ClearSession(Resource):

    def delete(self):
    
        session['page_views'] = None
        session['user_id'] = None

        return {}, 204

api.add_resource(Reviews, '/reviews')
api.add_resource(ReviewsByHikesHiker, '/hikes/<int:id>/reviews')
api.add_resource(Hikes, '/hikes')
api.add_resource(HikesById, '/hikes/<int:id>')
api.add_resource(Hikers, '/hikers')
api.add_resource(HikersById, '/hikers/<int:id>')    
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(ClearSession, '/clear', endpoint='clear')

@app.route('/')
def index():
    return '<h1>HikeFinder Backend</h1>'

""" @app.route('/hikes/<int:id>/reviews')
def hike_reviews(id):
    hike = Hike.query.get(id)
    if not hike:
        return jsonify({"error": "Hike not found"}), 404

    return jsonify([
        {
            "review_text": review.review_text,
            "hiker": {
                "id": review.hiker.id,
                "name": review.hiker.name,
                "username": review.hiker.username,
            }
        }
        for hiker in hike.hikers
        for review in hiker.reviews
        if review.hike_id == hike.id
    ]) """

if __name__ == '__main__':
    app.run(port=5555, debug=True)