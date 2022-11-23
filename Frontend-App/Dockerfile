FROM debian:9

RUN apt-get update -yq \
   && apt-get install curl gnupg -yq \
   && curl -sL https://deb.nodesource.com/setup_10.x | bash \
   && apt-get install nodejs -yq \
   && apt-get clean -y


COPY . /app/

WORKDIR /app

RUN npm install

EXPOSE 4200
VOLUME  /app/logs

CMD npm run start