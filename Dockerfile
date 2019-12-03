FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
ADD ./backend/package*.json ./backend/
ADD ./frontend/package*.json ./frontend/
RUN cd /usr/src/app/backend && npm install
RUN cd /usr/src/app/frontend && npm install

# Bundle app source
COPY . .

EXPOSE 3000 3001

ADD ./start.sh .
RUN sed -i -e 's/\r$//' ./start.sh
RUN chmod +x ./start.sh

CMD ["./start.sh"]