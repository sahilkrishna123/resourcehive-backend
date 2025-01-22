# ResourceHive: Proactive Healthcare Equipment Maintenance Platform

**ResourceHive** is a SaaS-based platform designed to improve healthcare institutions' equipment management through real-time monitoring and AI-driven predictive maintenance. The platform uses machine learning to analyze data from critical medical equipment, such as ventilators and MRI machines, to predict potential failures and alert healthcare professionals. This proactive approach helps prevent equipment downtime, reducing the risks associated with equipment failure and improving operational efficiency.

## Features

- **Proactive Maintenance**: Prevent major equipment failures by predicting potential issues before they occur.
- **Real-Time Equipment Monitoring**: Monitor critical equipment like ventilators, MRI machines, and patient monitors in real-time.
- **Machine Learning-Based Failure Prediction**: Leverage AI models to predict equipment failures based on real-time data.
- **Maintenance History Tracking**: Track maintenance events and their intervals to identify equipment lifespan and schedule future maintenance.
- **User-Friendly Dashboard**: An intuitive interface built with React.js, allowing healthcare professionals to monitor equipment status and receive alerts.
- **Scalable SaaS Platform**: Multi-tenant design that allows healthcare institutions to subscribe to the service and scale as needed.
- **Cloud Hosting & Data Management**: Deployed on AWS for scalability, reliability, and data storage.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Machine Learning**: Python, TensorFlow (for AI models)
- **Cloud**: AWS (for hosting and storage)
- **Version Control**: Git, GitHub
- **Testing**: Selenium (for automated testing)

## Installation

### Prerequisites

- Node.js and npm
- MongoDB (local or cloud)
- AWS account for cloud hosting
- Python (for AI model training and development)

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/sahilkrishna123/resourcehive-backend.git

2. Navigate to the project directory:
   ```bash
   cd resourcehive-backend

3. Install backend dependencies:
   ```bash
   npm install

4. Run the backend server:
   ```bash
   nodemon server.js

5. Deployment:
   ```bash
   vercel link: https://resourcehive-backend.vercel.app/
