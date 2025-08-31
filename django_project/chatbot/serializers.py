from rest_framework import serializers
from .models import ChatSession

class ChatSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSession
        fields = ["id", "created_at", "topic"]
        read_only_fields = ["id", "created_at"]
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["user"] = instance.user.id
        return data