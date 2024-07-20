from django.contrib import admin
from .models import Profile, Post, AddComment, LikePost

admin.site.register(Profile)
admin.site.register(Post)
admin.site.register(AddComment)
admin.site.register(LikePost)
