from django.db import models
from django.contrib.auth.models import User
import uuid

class ChatSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_sessions')
    created_at = models.DateTimeField(auto_now_add=True)
    topic = models.CharField(max_length=255, blank=True, null=True)
    share_uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # save once to get an ID
        if not self.topic:
            self.topic = f"Session {self.id}"
            super().save(update_fields=["topic"])  # update only topic

    def __str__(self):
        return self.topic or f"Session {self.id} for {self.user.username}"


class ChatMessage(models.Model):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=10)  # "user" or "bot"
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.sender}] {self.text[:30]}..."
