# EKALAVYA - Career Guidance System

A personalized career guidance system for Indian students after Class 10 and 12, focused on government degree colleges in India.

## Features

- **Personalized Assessment**: Comprehensive aptitude quiz to identify student strengths and interests
- **AI-Powered Recommendations**: Hybrid recommendation engine combining rule-based filtering and LLM analysis
- **Government College Database**: Extensive database of government colleges across India
- **Career Path Guidance**: Detailed career information for each recommended course
- **Modern UI**: Clean, responsive React frontend with Tailwind CSS

## Tech Stack

### Backend
- **Node.js** + **Express.js** - REST API server
- **MongoDB** + **Mongoose** - Database and ODM
- **Joi** - Input validation
- **Axios** - HTTP client for LLM API calls
- **Morgan** + **Helmet** - Logging and security middleware

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### AI Layer
- **OpenAI API** (or equivalent) - LLM for personalized recommendations
- **Hybrid Engine** - Rule-based + LLM recommendations

## Project Structure

```
ekalavya-career-guidance/
|-- client/                 # React frontend
|   |-- public/
|   |-- src/
|   |   |-- components/     # Reusable components
|   |   |-- context/        # React context
|   |   |-- pages/          # Page components
|   |   |-- App.js          # Main app component
|   |   |-- index.js        # Entry point
|   |-- package.json
|   |-- tailwind.config.js
|-- server/                 # Node.js backend
|   |-- controllers/        # Route controllers
|   |-- middleware/         # Custom middleware
|   |-- models/            # MongoDB models
|   |-- routes/            # API routes
|   |-- services/          # Business logic
|   |-- utils/             # Utility functions
|   |-- index.js           # Server entry point
|-- scripts/               # Utility scripts
|   |-- dataSeeder.js      # Database seeding
|-- .env                   # Environment variables
|-- package.json           # Root dependencies
|-- README.md
```

## Database Design

### Collections

1. **students**
   ```javascript
   {
     name: String,
     marks: Number,
     declared_interest: String, // Science/Commerce/Arts
     aptitude_scores: {
       science: Number,
       commerce: Number,
       arts: Number
     },
     dominant_domain: String,
     quiz_completed: Boolean,
     quiz_answers: Array
   }
   ```

2. **courses**
   ```javascript
   {
     name: String,
     stream: String, // Science/Commerce/Arts
     min_marks: Number,
     description: String,
     career_paths: [String],
     duration_years: Number
   }
   ```

3. **colleges**
   ```javascript
   {
     name: String,
     location: String,
     district: String,
     state: String,
     courses: [ObjectId],
     facilities: {
       hostel: Boolean,
       library: Boolean,
       laboratory: Boolean,
       sports: Boolean
     },
     college_type: String // Government/Private/Aided
   }
   ```

4. **recommendations**
   ```javascript
   {
     student_id: ObjectId,
     recommended_courses: [{
       course: ObjectId,
       reason: String,
       score: Number,
       rank: Number
     }],
     aptitude_profile: Object,
     student_profile: Object,
     recommendation_type: String
   }
   ```

## API Endpoints

### Students
- `POST /api/students` - Create student profile
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student profile
- `DELETE /api/students/:id` - Delete student profile

### Quiz
- `GET /api/quiz/questions` - Get quiz questions
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/results/:student_id` - Get quiz results
- `POST /api/quiz/reset/:student_id` - Reset quiz for student

### Recommendations
- `POST /api/recommendations/:studentId` - Generate recommendations
- `GET /api/recommendations/:studentId` - Get all recommendations
- `GET /api/recommendations/:studentId/latest` - Get latest recommendation

### Colleges
- `GET /api/colleges` - Get colleges with filters
- `GET /api/colleges/:id` - Get college details
- `GET /api/colleges/search` - Search colleges
- `GET /api/colleges/states` - Get all states
- `GET /api/colleges/states/:state/districts` - Get districts by state

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ekalavya-career-guidance
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ekalavya

# Server Configuration
PORT=5000
NODE_ENV=development

# LLM API Configuration
OPENAI_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-3.5-turbo

# Frontend URL
FRONTEND_URL=http://localhost:3000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 4. Database Setup
Start MongoDB service:
```bash
# For MongoDB installed locally
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 5. Seed the Database
```bash
npm run seed
```

This will populate the database with:
- 18 sample courses across Science, Commerce, and Arts streams
- 10 sample government colleges
- 3 sample student profiles

### 6. Start the Application

#### Development Mode
```bash
# Start both server and client concurrently
npm run dev

# Or start individually
npm run server    # Backend on port 5000
npm run client    # Frontend on port 3000
```

#### Production Mode
```bash
# Build the frontend
cd client
npm run build
cd ..

# Start the server
npm start
```

## Usage

### 1. Student Registration
- Navigate to the home page
- Click "Get Started" 
- Fill in academic details (name, marks, field of interest)

### 2. Aptitude Quiz
- Complete 8-question aptitude assessment
- Questions evaluate preferences across Science, Commerce, and Arts domains
- Receive normalized aptitude scores and dominant domain

### 3. Get Recommendations
- System processes quiz results with hybrid recommendation engine
- Rule-based filtering identifies eligible courses
- LLM provides personalized reasoning and ranking
- Results include match scores and detailed explanations

### 4. Explore Colleges
- Browse colleges offering recommended courses
- Filter by state, district, college type
- View facilities, contact information, and available courses

## Recommendation Algorithm

### Phase 1: Rule-Based Filtering
- Filter courses by eligibility (marks >= min_marks)
- Match declared interest and dominant domain
- Consider stream alignment

### Phase 2: LLM Personalization
- Input: Student profile + filtered courses
- Process: Generate ranked recommendations with reasoning
- Output: 3-5 courses with match scores and explanations

### Phase 3: Validation & Storage
- Validate LLM output against filtered courses
- Calculate confidence levels
- Store recommendations for tracking

## Error Handling & Validation

- **Input Validation**: Joi schemas for all API endpoints
- **Error Logging**: Structured logging with file output
- **Graceful Degradation**: Fallback to rule-based recommendations if LLM fails
- **Rate Limiting**: Built-in timeout and retry logic for LLM calls
- **Data Validation**: MongoDB schema validation and constraints

## Security Features

- **Helmet.js**: Security headers
- **CORS**: Configured cross-origin requests
- **Input Sanitization**: Joi validation and MongoDB sanitization
- **Environment Variables**: Sensitive data in .env file

## Monitoring & Logging

- **Request Logging**: Morgan middleware for HTTP requests
- **Error Logging**: Custom logger with file output
- **Performance Monitoring**: LLM response time tracking
- **Database Monitoring**: Connection status and query performance

## Deployment

### Docker Deployment
```bash
# Build Docker images
docker build -t ekalavya-server .
docker build -t ekalavya-client ./client

# Run with Docker Compose
docker-compose up -d
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
OPENAI_API_KEY=your-production-api-key
FRONTEND_URL=https://your-domain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation and FAQ

## Future Enhancements

- [ ] User authentication and profiles
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Integration with more college databases
- [ ] Scholarship information integration
- [ ] Application deadline tracking
- [ ] Alumni network integration
=======
# AI-Powered-Career-Guidance-Platform
Eklavya – An AI-powered career guidance platform that delivers personalized career recommendations, skill-gap analysis, and learning roadmaps.
>>>>>>> ac8efe61c27ec084ba5632f7217715853d665cb4
