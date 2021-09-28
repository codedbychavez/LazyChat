FROM python:3.7

ENV PYTHONUNBUFFERED 1

RUN mkdir /socket

WORKDIR /socket

COPY . /socket

RUN pip install -r requirements.txt

# run entrypoint.sh
ENTRYPOINT ["sh","./entrypoint.sh"]