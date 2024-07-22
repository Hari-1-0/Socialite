from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Post, LikePost, AddComment
import uuid

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = ['username', 'bio', 'profile_image']
    def get_username(self, obj):
        return obj.user.username

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id','user', 'image', 'content', 'created_at', 'no_of_likes']
        extra_kwargs = {"user": {"read_only": True}}

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(default=serializers.CurrentUserDefault(), read_only=True)
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())
    username = serializers.SerializerMethodField()

    class Meta:
        model = AddComment
        fields = ['username', 'user', 'post', 'content', 'created_at']
    def create(self, validated_data):
        request = self.context.get('request', None)
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        return super().create(validated_data)
    def get_username(self, obj):
        return obj.user.username if obj.user else None

class LikeSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(default=serializers.CurrentUserDefault(), read_only=True)
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())
    liked = serializers.BooleanField(read_only=True)

    class Meta:
        model = LikePost
        fields = ['user', 'post', 'liked']

    def create(self, validated_data):
        request = self.context.get('request', None)
        liked = False
        if request and hasattr(request, 'user'):
            user = request.user
            validated_data['user'] = user
            post_instance = validated_data['post']
            like, created = LikePost.objects.get_or_create(user=user, post=post_instance)
            if not created:
                like.delete()
                post_instance.no_of_likes -= 1
            else:
                post_instance.no_of_likes += 1
                liked = True
            post_instance.save()
        validated_data['liked'] = liked
        return validated_data