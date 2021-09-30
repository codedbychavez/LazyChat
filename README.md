# 💬 LazyChat
I made this project to demo how we can combine Angular, Python, and Socket IO to create a real-time chat application with features such as:

- Online status updates (As one of your friends connect their online status is updated instantly via SocketIO)
- The ability to search for someone on lazy chat via their email (Search suggestions are shown as you type the first two letters)
- The ability to unfriend someone
- The ability to delete messages sent by you (Only the sender of the message can delete a message, hence you cannot delete messages sent by your friend)
- Builtin JWT Authentication (Settings for tokens can be easily adjusted)
- Users are notified when:
  - Messages are deleted
  - Someone is unfriended
- There are also template checks for a selected friend, messages, etc.

### Here are some snapshots

#### Login screen
![image](https://user-images.githubusercontent.com/74829200/135458484-6e779f47-8ea4-465c-ba4e-c04ef7710f85.png)

#### Sign-up screen
![image](https://user-images.githubusercontent.com/74829200/135458719-fffc6fe9-8c95-4e4e-af29-3d92a67a100b.png)

#### Dashboard - No friend selected
![image](https://user-images.githubusercontent.com/74829200/135458949-199fc318-ed72-44c9-a0fb-792009e9a189.png)

#### Dashboard - Searching for a friend
![image](https://user-images.githubusercontent.com/74829200/135459279-b20018f9-046c-48b0-9ea9-69a0d400d9e0.png)

#### Dashboard - Unfriending a friend
![image](https://user-images.githubusercontent.com/74829200/135459522-02c1691a-0ff4-43dc-8554-3c9eb853a9cc.png)

#### Dashboard - Deleting a message (messages can only be deleted by the user that sends the message, note the three horizontal dots)
![image](https://user-images.githubusercontent.com/74829200/135459862-abb47e2e-9ef5-4238-81c1-314965cb3949.png)

#### Dashboard - Gray dot turns green to show that your friend is logged in.
The socket is configured to only notify a user friends that he/she is online/offline and does not broadcast the online status to every member of LazyChat.
![image](https://user-images.githubusercontent.com/74829200/135460921-0b9b67e9-7c6a-4763-a793-c80da142c392.png)

#### Dashboard - If new messages are sent from a friend...
if the user is engaged with another user a badge notification is shown with the number of messages send from a friend. These badge notifications are automatically cleared when the user reads the messages received from the respective friend.
![image](https://user-images.githubusercontent.com/74829200/135461914-7a6f3f42-66f4-4fd8-8bd5-e3c408d3be9d.png)


## How to setup on your local machine
1. Make sure that you have docker installed on your local machine.
2. In the cloned repo folder run `docker-compose -f docker-compose.local.yml up --build`
3. Ports for the containers (There will be three of them) will be shown in docker.

### Need help?
* Instagram - @codedbychavez
* Twitter - @codedbychavez
* Email - codedbychavez@gmail.com


