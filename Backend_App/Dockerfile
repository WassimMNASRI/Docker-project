FROM debian:11.5

RUN apt-get update -yq \
   && apt-get install curl gnupg -yq \
   && curl -sL https://deb.nodesource.com/setup_10.x | bash \
   && apt-get install nodejs -yq \
   && apt-get clean -y


COPY . /app/

WORKDIR /app

RUN apt install nodejs npm -y\
    && npm install

EXPOSE 3000
VOLUME  /app/logs

CMD ["node", "server"]