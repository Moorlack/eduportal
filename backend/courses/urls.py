# courses/urls.py
from django.urls import path
from .views import (
    RegisterView, LoginView, CsrfTokenView, CourseList, CourseDetail,
    LessonList, LessonDetail, ResourceList, AssessmentList, FeedbackCreateView,
    TestListCreateView, QuestionCreateView, AnswerCreateView,
    UserTestAttemptView, ProgressView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('csrf/', CsrfTokenView.as_view(), name='csrf'),
    path('courses/', CourseList.as_view(), name='course-list'),
    path('courses/<int:id>/', CourseDetail.as_view(), name='course-detail'),
    path('lessons/', LessonList.as_view(), name='lesson-list'),
    path('lessons/<int:id>/', LessonDetail.as_view(), name='lesson-detail'), 
    path('resources/', ResourceList.as_view(), name='resource-list'),
    path('assessments/', AssessmentList.as_view(), name='assessment-list'),
    path('feedback/', FeedbackCreateView.as_view(), name='feedback-create'),
    path('tests/', TestListCreateView.as_view(), name='test-list-create'),
    path('questions/', QuestionCreateView.as_view(), name='question-create'),
    path('answers/', AnswerCreateView.as_view(), name='answer-create'),
    path('attempts/', UserTestAttemptView.as_view(), name='test-attempt'),
    path('progress/<int:course_id>/', ProgressView.as_view(), name='progress'),
]