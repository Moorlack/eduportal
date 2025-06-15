from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Feedback
from .serializers import FeedbackSerializer
from django.db.models import Avg, Count

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FeedbackAnalytics(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.groups.filter(name__in=['teachers', 'admins']).exists():
             return Response({'error': 'Доступ заборонено'}, status=403)
        analytics = Feedback.objects.values('course__title').annotate(
            avg_rating=Avg('rating'),
            total=Count('id')
        )
        return Response(analytics)