# Generated by Django 4.2 on 2025-05-30 02:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('courses', '0002_assessment_alter_lesson_options_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Test',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.AlterModelOptions(
            name='assessment',
            options={},
        ),
        migrations.AlterModelOptions(
            name='course',
            options={},
        ),
        migrations.AlterModelOptions(
            name='lesson',
            options={},
        ),
        migrations.AlterModelOptions(
            name='resource',
            options={},
        ),
        migrations.RemoveField(
            model_name='assessment',
            name='points',
        ),
        migrations.RemoveField(
            model_name='course',
            name='additional_resources',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='video_url',
        ),
        migrations.AddField(
            model_name='assessment',
            name='title',
            field=models.CharField(default='Default Assessment Title', max_length=200),
        ),
        migrations.AddField(
            model_name='lesson',
            name='order',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='lesson',
            name='passing_score',
            field=models.PositiveIntegerField(default=80, help_text='Прохідний бал (%)'),
        ),
        migrations.AddField(
            model_name='resource',
            name='created_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='assessment',
            name='course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assessments', to='courses.course'),
        ),
        migrations.AlterField(
            model_name='assessment',
            name='description',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='course',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='course',
            name='description',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='course',
            name='title',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='content',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lessons', to='courses.course'),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='title',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='resource',
            name='course',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='resources', to='courses.course'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='resource',
            name='file',
            field=models.FileField(upload_to='resources/'),
        ),
        migrations.AlterField(
            model_name='resource',
            name='title',
            field=models.CharField(max_length=200),
        ),
        migrations.CreateModel(
            name='UserTestAttempt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.PositiveIntegerField()),
                ('max_score', models.PositiveIntegerField()),
                ('passed', models.BooleanField(default=False)),
                ('attempted_at', models.DateTimeField(auto_now_add=True)),
                ('test', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='courses.test')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='test',
            name='lesson',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='test', to='courses.lesson'),
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('order', models.PositiveIntegerField(default=0)),
                ('test', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='courses.test')),
            ],
        ),
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('rating', models.PositiveIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='feedbacks', to='courses.course')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='course_feedbacks', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=200)),
                ('is_correct', models.BooleanField(default=False)),
                ('points', models.PositiveIntegerField(default=1)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='courses.question')),
            ],
        ),
    ]
