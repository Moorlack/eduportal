from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.db import models
from django.utils import timezone
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .models import Course, Lesson, Resource, Assessment, Feedback, Test, Question, Answer, UserTestAttempt
from .serializers import (
    UserRegisterSerializer, CourseSerializer, LessonSerializer, ResourceSerializer,
    AssessmentSerializer, FeedbackSerializer, TestSerializer, QuestionSerializer,
    AnswerSerializer, UserTestAttemptSerializer, ProgressSerializer
)
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.middleware.csrf import get_token
import logging

logger = logging.getLogger(__name__)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logger.info(f"Реєстрація: отримані дані {request.data}")
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Користувач {request.data['username']} успішно зареєстрований")
            return Response({"message": "Користувач успішно зареєстрований"}, status=status.HTTP_201_CREATED)
        logger.error(f"Помилка реєстрації: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Невірний логін або пароль'}, status=status.HTTP_400_BAD_REQUEST)

class CsrfTokenView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({'csrfToken': get_token(request)})

class CourseList(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class CourseDetail(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field = 'id'

class LessonList(generics.ListCreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    def get_queryset(self):
        course_id = self.request.query_params.get('course')
        if course_id:
            return Lesson.objects.filter(course_id=course_id)
        return super().get_queryset()

class ResourceList(generics.ListCreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer

    def get_queryset(self):
        course_id = self.request.query_params.get('course')
        if course_id:
            return Resource.objects.filter(course_id=course_id)
        return super().get_queryset()

class AssessmentList(generics.ListCreateAPIView):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer

    def get_queryset(self):
        course_id = self.request.query_params.get('course')
        if course_id:
            return Assessment.objects.filter(course_id=course_id)
        return super().get_queryset()


class FeedbackCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logger.debug(f"Creating feedback for user {request.user.username}, data: {request.data}")
        try:
            serializer = FeedbackSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save(user=request.user)
                logger.info(f"Feedback created: {serializer.data}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                # Перетворюємо помилки в рядок
                error_message = ', '.join([f"{field}: {err[0]}" for field, err in serializer.errors.items()])
                logger.error(f"Serializer errors: {error_message}")
                return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Feedback creation error for user {request.user.username}: {str(e)}", exc_info=True)
            return Response({'error': 'Внутрішня помилка сервера'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TestListCreateView(generics.ListCreateAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get_queryset(self):
        lesson_id = self.request.query_params.get('lesson')
        if lesson_id:
            return Test.objects.filter(lesson_id=lesson_id)
        return super().get_queryset()

class QuestionCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AnswerCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = AnswerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserTestAttemptView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        test_id = request.data.get('test_id')
        answers = request.data.get('answers', [])  # Список ID відповідей

        try:
            test = Test.objects.get(id=test_id)
        except Test.DoesNotExist:
            return Response({'error': 'Тест не знайдено'}, status=status.HTTP_404_NOT_FOUND)

        score = 0
        max_score = 0
        for question in test.questions.all():
            correct_answers = question.answers.filter(is_correct=True)
            max_score += sum(answer.points for answer in correct_answers)
            user_answer_ids = [ans['id'] for ans in answers if ans['question_id'] == question.id]
            for answer_id in user_answer_ids:
                try:
                    answer = Answer.objects.get(id=answer_id)
                    if answer.is_correct:
                        score += answer.points
                except Answer.DoesNotExist:
                    continue

        passed = (score / max_score * 100) >= test.lesson.passing_score
        attempt = UserTestAttempt.objects.create(
            user=user,
            test=test,
            score=score,
            max_score=max_score,
            passed=passed
        )
        serializer = UserTestAttemptSerializer(attempt)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



class ProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        logger.debug(f"Processing progress for user {request.user.username}, course_id {course_id}")
        try:
            course = Course.objects.get(id=course_id)
            lessons = Lesson.objects.filter(course=course)
            total_lessons = lessons.count()
            completed_lessons = UserTestAttempt.objects.filter(
                user=request.user,
                test__lesson__course=course,
                passed=True
            ).count()  # Прибрано distinct() для сумісності з SQLite
            average_score = UserTestAttempt.objects.filter(
                user=request.user,
                test__lesson__course=course
            ).aggregate(avg_score=models.Avg('score'))['avg_score'] or 0

            data = {
                'course_id': course_id,
                'total_lessons': total_lessons,
                'completed_lessons': completed_lessons,
                'average_score': round(average_score, 2)
            }
            logger.info(f"Progress data: {data}")
            serializer = ProgressSerializer(data=data)  # Явно передаємо data
            if serializer.is_valid():
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                logger.error(f"Serializer errors: {serializer.errors}")
                return Response({'error': 'Помилка серіалізації'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Course.DoesNotExist:
            logger.error(f"Course {course_id} not found for user {request.user.username}")
            return Response({'error': 'Курс не знайдено'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Progress error for course {course_id}, user {request.user.username}: {str(e)}", exc_info=True)
            return Response({'error': 'Внутрішня помилка сервера'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class LessonDetail(generics.RetrieveAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    lookup_field = 'id'
    permission_classes = [IsAuthenticated]