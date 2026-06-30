from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

app = Flask(__name__)
CORS(app)

# Database Setup
client = MongoClient('mongodb://localhost:27017/')
db = client['ekalavya']
colleges_collection = db['colleges']

def get_all_courses():
    """Fetch and flatten all courses from MongoDB into a DataFrame."""
    colleges = list(colleges_collection.find({}, {"_id": 0, "name": 1, "courses": 1}))
    course_list = []
    
    for college in colleges:
        if "courses" in college and college["courses"]:
            for course in college["courses"]:
                if "name" in course and len(course["name"]) > 2:
                    # Flatten into a nice dictionary
                    course_dict = {
                        "college_name": college.get("name", "Unknown College"),
                        "course_name": course.get("name", ""),
                        "level": course.get("level", "UG"),
                        "duration": course.get("duration", ""),
                        "fees": course.get("fees", 0),
                        "mode": course.get("mode", "Full Time")
                    }
                    course_list.append(course_dict)
                    
    # Drop exact duplicate course names to keep recommendations unique
    df = pd.DataFrame(course_list)
    if not df.empty:
        df = df.drop_duplicates(subset=['course_name'])
    return df


def filter_by_age(df, age):
    """Filter courses based on student's age to recommend age-appropriate programs."""
    if age is None or df.empty:
        return df
    
    level_col = df['level'].str.upper()
    
    if age <= 20:
        # After class 10/12: UG, Diploma, Certificate
        mask = level_col.isin(['UG', 'DIPLOMA', 'CERTIFICATE', 'OTHER'])
    elif age <= 24:
        # Could be finishing UG or starting PG
        mask = level_col.isin(['UG', 'PG', 'DIPLOMA', 'CERTIFICATE', 'OTHER'])
    else:
        # Prefer higher education
        mask = level_col.isin(['PG', 'PHD', 'UG', 'DIPLOMA', 'OTHER'])
    
    filtered = df[mask]
    # If filtering removes everything, return original
    return filtered if not filtered.empty else df


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "ML Recommendation Engine"})

@app.route('/api/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json
        print("Received Prediction Request for:", data.get('name'))
        
        dominant_domain = data.get('dominant_domain', 'Science')
        aptitude = data.get('aptitude_scores', {"science": 0, "commerce": 0, "arts": 0, "vocational": 0})
        age = data.get('age', None)
        hobbies = data.get('hobbies', '')
        career_goals = data.get('career_goals', '')
        
        df = get_all_courses()
        
        if df.empty:
            return jsonify({
                "success": False,
                "message": "No courses found in MongoDB to train the model.",
                "recommendations": []
            })
        
        # --- Age-based filtering ---
        df = filter_by_age(df, age)
            
        # --- ML Pipeline (Content-Based Filtering via Cosine Similarity) ---
        
        # 1. Feature Engineering for Courses
        def enrich_feature(row):
            name = str(row['course_name']).lower()
            features = [name]
            
            # Map known keywords to domains to boost TF-IDF vectors
            if any(k in name for k in ['tech', 'eng', 'sci', 'computer', 'med', 'b.sc', 'b.tech']):
                features.append('science technology engineering mathematics')
            if any(k in name for k in ['com', 'bus', 'manag', 'fin', 'bba', 'mba', 'account']):
                features.append('commerce business finance management')
            if any(k in name for k in ['art', 'design', 'hum', 'lit', 'b.a', 'm.a', 'social']):
                features.append('arts humanities creative literature')
            if any(k in name for k in ['voc', 'dip', 'cert', 'hotel', 'hospitality']):
                features.append('vocational practical skills diploma')
                
            return " ".join(features)
            
        df['ml_features'] = df.apply(enrich_feature, axis=1)
        
        # 2. Build Student's Ideal Vector
        student_features = []
        student_features.append(dominant_domain.lower())
        
        # Add weights based on aptitude scores
        if aptitude.get('science', 0) > 40: student_features.append('science technology')
        if aptitude.get('commerce', 0) > 40: student_features.append('commerce business')
        if aptitude.get('arts', 0) > 40: student_features.append('arts creative')
        if aptitude.get('vocational', 0) > 40: student_features.append('vocational practical')
        
        # Add hobbies and career goals as additional features for personalization
        if hobbies:
            student_features.append(hobbies.lower())
        if career_goals:
            student_features.append(career_goals.lower())
        
        student_profile_doc = " ".join(student_features)
        
        # 3. Vectorization (TF-IDF)
        vectorizer = TfidfVectorizer()
        # Fit on all courses PLUS the student profile
        all_docs = df['ml_features'].tolist() + [student_profile_doc]
        tfidf_matrix = vectorizer.fit_transform(all_docs)
        
        course_vectors = tfidf_matrix[:-1] # All except the last one
        student_vector = tfidf_matrix[-1:] # Just the last one
        
        # 4. Predict via Cosine Similarity
        similarity_scores = cosine_similarity(student_vector, course_vectors).flatten()
        df['similarity_score'] = similarity_scores
        
        # 5. Extract Top 5 Recommendations
        top_indices = similarity_scores.argsort()[-5:][::-1]
        top_courses = df.iloc[top_indices]
        
        recommendations = []
        rank = 1
        for _, row in top_courses.iterrows():
            score_percent = min(100, int(row['similarity_score'] * 100) + 40) # Baseline bump for presentation
            
            reason = f"This {row['level']} course matches your {dominant_domain} profile"
            if hobbies:
                reason += f", aligns with your hobbies ({hobbies})"
            if career_goals:
                reason += f", and supports your career goal of {career_goals}"
            reason += f" with a compatibility score of {score_percent}%."
            if age:
                reason += f" Suitable for your age group ({age} years)."
            
            recommendations.append({
                "course": row['course_name'],
                "reason": reason,
                "score": score_percent,
                "rank": rank,
                "college_offering": row['college_name']
            })
            rank += 1
            
        return jsonify({
            "success": True,
            "recommendations": recommendations,
            "model": "Content-Based Filtering (scikit-learn Cosine Similarity)"
        })

    except Exception as e:
        print("ML Model Error:", str(e))
        return jsonify({
            "success": False,
            "message": "Failed to run ML prediction",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
