from django.core.management.base import BaseCommand, CommandError


from aiohttp import web
import socketio

ALLOWED_ORIGINS = '*'

sio = socketio.AsyncServer(cors_allowed_origins=ALLOWED_ORIGINS)
app = web.Application()
sio.attach(app)



@sio.event
async def join_chatroom(sid, data):
    roomToJoin = data['room']
    friendsRaw = data['account']['friends']
    friendsListString = friendsRaw.split(',')
    friendsList = [int(i) for i in friendsListString]
    account = data['account']
    account['available'] = True
    for friend in friendsList:
        await sio.emit('update_available', {'data': account}, room=friend)
    print('Joining chat room: ', roomToJoin)
    sio.enter_room(sid, roomToJoin)
    

@sio.event
async def leave_chatroom(sid, data):
    roomToLeave = data['room']
    friendsRaw = data['account']['friends']
    friendsListString = friendsRaw.split(',')
    friendsList = [int(i) for i in friendsListString]
    account = data['account']
    account['available'] = False
    for friend in friendsList:
        await sio.emit('update_available', {'data': account}, room=friend)
    print('Leaving chat room: ', roomToLeave)
    sio.leave_room(sid, roomToLeave)


@sio.event
async def chat_message(sid, data):
    print("message ", data['message'])
    message = data['message']
    room = data['room']
    await sio.emit('message_received', {'data': message}, room=room)

  

# Core Events

@sio.event
def connect(sid, data):
    print("connect ", sid)

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

# if __name__ == '__main__':
#     web.run_app(app)

class Command(BaseCommand):
    help = 'Starts the socketio server on http://0.0.0.0:5000'
    def handle(self, *args, **options):
        try:
            print('Starting socketio server')
            web.run_app(app, port=5000)
        except:
            raise CommandError('Error starting the socket io server')
