from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserSearchView, LikeStatusView, get_user_details, ProfileDetailByUserId, CreateUserView, ProfileDetailView, PostListCreateView, PostDetailView, CommentListCreateView, CommentDetailView, LikePostView

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profiles/<int:pk>/', ProfileDetailView.as_view(), name='profile-detail'),
    path('posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),
    path('like/', LikePostView.as_view(), name='like-post'),
    path('profiles/user/<int:user_id>/', ProfileDetailByUserId.as_view(), name='profile-detail-by-user-id'),
    path('user-details/', get_user_details, name='user-details'),
    path('like-status/<int:post_id>/', LikeStatusView.as_view(), name='like-status'),
    path('search-users/', UserSearchView.as_view(), name='search-users'),
]
