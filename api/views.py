from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.serializers import Serializer
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse
from .models import Profile, Post, LikePost, AddComment
from .serializers import UserSerializer, ProfileSerializer, PostSerializer, CommentSerializer, LikeSerializer

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class ProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        if instance.user == self.request.user:
            instance.delete()
        else:
            return Response({'detail': 'You do not have permission to delete this post.'}, status=status.HTTP_403_FORBIDDEN)

class CommentListCreateView(generics.ListCreateAPIView):
    queryset = AddComment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    def get_serializer_context(self):
        return {'request': self.request}

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AddComment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

class LikePostView(generics.CreateAPIView):
    queryset = LikePost.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {'request': self.request}

class ProfileDetailByUserId(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_object(self):
        user_id = self.kwargs['user_id']
        return Profile.objects.get(user__id=user_id)
    
class LikeStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        user = request.user
        liked = LikePost.objects.filter(user=user, post_id=post_id).exists()
        return Response({'liked': liked}, status=status.HTTP_200_OK)
    
class UserSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '')
        users = User.objects.filter(username__istartswith=query)
        user_data = [{'id': user.id, 'username': user.username} for user in users]
        return Response(user_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
    })

from django.views.generic import TemplateView
class IndexView(TemplateView):
    template_name = 'index.html'