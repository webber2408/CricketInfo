cd client ..
docker build -t cricket-client .
cd ..
docker build -t cricket-api .
docker-compose up
