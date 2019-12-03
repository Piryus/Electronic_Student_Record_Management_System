#!/bin/bash

cd /usr/src/app/backend && node index.js &
cd /usr/src/app/frontend && npm start &
/bin/bash