from firebase_admin import messaging

def breaking_news_notification(title: str, id):
    message = messaging.Message(
        notification= messaging.Notification(
            title= "Breaking News",
            body= title
        ),
        data= {
            "type": "news",
            "postId": str(id),
        },
        topic= "BreakingNews",
    )
    response = messaging.send(message)
    print("notification sent: ", response)
    

