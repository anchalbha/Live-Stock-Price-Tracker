Live Stock Price Tracker:
          A visually engaging, real-time stock tracking web app that lets you monitor live prices, view historical charts, and search for specific stocks with ease.

1) Features:
    * Search Functionality — Instantly search for stocks by symbol or name  
    * Live Charts — Interactive stock graphs powered by real-time data  
    * Timestamp Display — See the latest update time for each stock  
    * Modern UI — Clean, responsive interface with intuitive design  
    * Tech Stack:
                  - React.js (Frontend)
                  - Node.js + Express (Backend)
                  - MongoDB (Database)
                  - Twelve Data API (Stock data source)



2) Installation & Setup

	To run the project locally:

	- Clone the repository:
   	git clone https://github.com/anchalbha/Live-Stock-Price-Tracker.git
   	cd Live-Stock-Price-Tracker

	- Install dependencies:
	For frontend:
              cd client
              npm install
	For backend:
             cd server
             npm install

	- Set up environment variables:Create a .env file in the server directory with the following:
             	MONGO_URI=your_mongodb_connection_string
             	TWELVE_DATA_API_KEY=your_twelve_data_api_key

	- Start the app
	Backend:
              npm run dev
	Frontend (in another terminal):
              npm start
