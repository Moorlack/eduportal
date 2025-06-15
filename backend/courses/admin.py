# courses/admin.py
from django.contrib import admin
from .models import Assessment, Course, Lesson, Resource, Test, Question, Answer, UserTestAttempt, Feedback

@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'description']
    list_filter = ['course']

# Інші класи адмінки (для повноти)
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_at']
    list_filter = ['created_at']

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'passing_score']
    list_filter = ['course']

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'created_at']
    list_filter = ['course']

@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson']
    list_filter = ['lesson__course']

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['text', 'test']
    list_filter = ['test']

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['text', 'question', 'is_correct', 'points']
    list_filter = ['question']

@admin.register(UserTestAttempt)
class UserTestAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'test', 'score', 'max_score', 'passed', 'attempted_at']
    list_filter = ['test', 'passed']

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'rating', 'created_at']
    list_filter = ['course', 'rating']