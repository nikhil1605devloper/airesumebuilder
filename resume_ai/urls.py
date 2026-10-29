from django.urls import path
from .views import (
    # Original views
    AnalyzeResumeView,
    ResumeCreateView,

    # PersonalDetails
    PersonalDetailsListView,
    PersonalDetailsDetailView,
    PersonalDetailsCreateView,
    PersonalDetailsUpdateView,
    PersonalDetailsDeleteView,

    # ResumeMaster
    ResumeMasterListView,
    ResumeMasterDetailView,
    ResumeMasterCreateView,
    ResumeMasterUpdateView,
    ResumeMasterDeleteView,

    # Education
    EducationListView,
    EducationDetailView,
    EducationCreateView,
    EducationUpdateView,
    EducationDeleteView,

    # Skills
    SkillsListView,
    SkillsDetailView,
    SkillsCreateView,
    SkillsUpdateView,
    SkillsDeleteView,

    # WorkExperience
    WorkExperienceListView,
    WorkExperienceDetailView,
    WorkExperienceCreateView,
    WorkExperienceUpdateView,
    WorkExperienceDeleteView,
)

urlpatterns = [
    # ── Original endpoints ────────────────────────────────────────────────────
    path('analyze/', AnalyzeResumeView.as_view(), name='analyze-resume'),
    path('resumes/', ResumeCreateView.as_view(), name='create-resume'),

    # ── PersonalDetails ───────────────────────────────────────────────────────
    path('personal/', PersonalDetailsListView.as_view(), name='personal-list'),
    path('personal/create/', PersonalDetailsCreateView.as_view(), name='personal-create'),
    path('personal/<int:id>/', PersonalDetailsDetailView.as_view(), name='personal-detail'),
    path('personal/<int:id>/update/', PersonalDetailsUpdateView.as_view(), name='personal-update'),
    path('personal/<int:id>/delete/', PersonalDetailsDeleteView.as_view(), name='personal-delete'),

    # ── ResumeMaster ──────────────────────────────────────────────────────────
    path('resume-master/', ResumeMasterListView.as_view(), name='resume-master-list'),
    path('resume-master/create/', ResumeMasterCreateView.as_view(), name='resume-master-create'),
    path('resume-master/<int:id>/', ResumeMasterDetailView.as_view(), name='resume-master-detail'),
    path('resume-master/<int:id>/update/', ResumeMasterUpdateView.as_view(), name='resume-master-update'),
    path('resume-master/<int:id>/delete/', ResumeMasterDeleteView.as_view(), name='resume-master-delete'),

    # ── Education ────────────────────────────────────────────────────────────
    path('education/', EducationListView.as_view(), name='education-list'),
    path('education/create/', EducationCreateView.as_view(), name='education-create'),
    path('education/<int:id>/', EducationDetailView.as_view(), name='education-detail'),
    path('education/<int:id>/update/', EducationUpdateView.as_view(), name='education-update'),
    path('education/<int:id>/delete/', EducationDeleteView.as_view(), name='education-delete'),

    # ── Skills ───────────────────────────────────────────────────────────────
    path('skills/', SkillsListView.as_view(), name='skills-list'),
    path('skills/create/', SkillsCreateView.as_view(), name='skills-create'),
    path('skills/<int:id>/', SkillsDetailView.as_view(), name='skills-detail'),
    path('skills/<int:id>/update/', SkillsUpdateView.as_view(), name='skills-update'),
    path('skills/<int:id>/delete/', SkillsDeleteView.as_view(), name='skills-delete'),

    # ── WorkExperience ────────────────────────────────────────────────────────
    path('work-experience/', WorkExperienceListView.as_view(), name='work-experience-list'),
    path('work-experience/create/', WorkExperienceCreateView.as_view(), name='work-experience-create'),
    path('work-experience/<int:id>/', WorkExperienceDetailView.as_view(), name='work-experience-detail'),
    path('work-experience/<int:id>/update/', WorkExperienceUpdateView.as_view(), name='work-experience-update'),
    path('work-experience/<int:id>/delete/', WorkExperienceDeleteView.as_view(), name='work-experience-delete'),
]