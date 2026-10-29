from django.shortcuts import render, get_object_or_404
import os
import json
import requests
import pdfplumber
import docx

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.db import transaction
from django.db.models import Q
from django.utils import timezone

from .models import Education, PersonalDetails, ResumeMaster, Skills, WorkExperience
from .serializers import (
    EducationSerializer,
    PersonalDetailsSerializer,
    PersonalDetailsWithRelationsSerializer,
    ResumeCreateSerializer,
    ResumeMasterSerializer,
    SkillsSerializer,
    WorkExperienceSerializer,
)


# ─── Utility ──────────────────────────────────────────────────────────────────

def extract_text_from_file(uploaded_file):
    """Dynamically extract text depending on the file type — no hardcoded content."""
    filename = uploaded_file.name.lower()

    if filename.endswith('.pdf'):
        text = ""
        with pdfplumber.open(uploaded_file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text

    elif filename.endswith('.docx'):
        document = docx.Document(uploaded_file)
        return "\n".join([para.text for para in document.paragraphs])

    else:
        return None


def call_openrouter(resume_text):
    """Sends the actual extracted resume text to OpenRouter dynamically."""
    api_key = os.getenv("OPENROUTER_API_KEY")
    model = os.getenv("OPENROUTER_MODEL")

    prompt = f"""
You are an expert ATS (Applicant Tracking System) resume reviewer.

Analyze the following resume text and respond with ONLY a valid JSON object,
no extra text, no markdown formatting, in this exact structure:

{{
  "score": <integer 0-100>,
  "strengths": ["...", "...", "..."],
  "improvements": ["...", "...", "..."],
  "missingKeywords": ["...", "...", "..."]
}}

Resume text:
\"\"\"
{resume_text}
\"\"\"
"""

    response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        data=json.dumps({
            "model": model,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }),
        timeout=60
    )

    response.raise_for_status()
    result = response.json()
    ai_message = result["choices"][0]["message"]["content"]

    # Clean up in case the model wraps JSON in markdown code fences
    cleaned = ai_message.strip().strip('`').replace('json\n', '', 1).strip()

    return json.loads(cleaned)


# ─── Analyze & Create (original views) ────────────────────────────────────────

class AnalyzeResumeView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        uploaded_file = request.FILES.get('resume')

        if not uploaded_file:
            return Response(
                {"error": "No file uploaded. Please attach a resume file."},
                status=status.HTTP_400_BAD_REQUEST
            )

        resume_text = extract_text_from_file(uploaded_file)

        if not resume_text or not resume_text.strip():
            return Response(
                {"error": "Could not extract any text from this file. Try a different PDF/DOCX."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            ai_result = call_openrouter(resume_text)
        except Exception as e:
            return Response(
                {"error": f"AI analysis failed: {str(e)}"},
                status=status.HTTP_502_BAD_GATEWAY
            )

        return Response(ai_result, status=status.HTTP_200_OK)


class ResumeCreateView(APIView):
    def post(self, request):
        serializer = ResumeCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            created = serializer.save()

        return Response(
            {
                "resume": ResumeMasterSerializer(created["resume"]).data,
                "personal_details": PersonalDetailsSerializer(
                    created["personal_details"]
                ).data,
                "education": EducationSerializer(
                    created["education"], many=True
                ).data,
                "skills": SkillsSerializer(created["skills"], many=True).data,
                "work_experience": WorkExperienceSerializer(
                    created["work_experience"], many=True
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


# ─── PersonalDetails APIViews ──────────────────────────────────────────────────

class PersonalDetailsListView(APIView):
    """List all personal detail records or filter by search."""

    def get(self, request):
        try:
            queryset = PersonalDetails.objects.all().order_by('-personal_id')

            search = request.query_params.get('search', '').strip()
            if search:
                queryset = queryset.filter(
                    Q(full_name__icontains=search) |
                    Q(email__icontains=search) |
                    Q(phone__icontains=search)
                )

            serializer = PersonalDetailsSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PersonalDetailsDetailView(APIView):
    """Retrieve a single PersonalDetails record by ID."""

    def get(self, request, id):
        try:
            item = get_object_or_404(PersonalDetails, pk=id)
            serializer = PersonalDetailsWithRelationsSerializer(item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PersonalDetailsCreateView(APIView):
    """Create a new PersonalDetails record."""

    def post(self, request):
        try:
            data = request.data.copy()
            full_name = str(data.get('full_name', '')).strip()
            if not full_name:
                return Response(
                    {"error": "Full name is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            data['full_name'] = full_name

            email = str(data.get('email', '')).strip()
            if not email:
                return Response(
                    {"error": "Email is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            data['email'] = email
            data['created_on'] = timezone.now()

            serializer = PersonalDetailsSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            err_msg = "Validation failed"
            if serializer.errors:
                first_err = next(iter(serializer.errors.values()))
                if isinstance(first_err, list) and first_err:
                    err_msg = str(first_err[0])
                else:
                    err_msg = str(first_err)
            return Response(
                {"error": err_msg, "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PersonalDetailsUpdateView(APIView):
    """Update a PersonalDetails record."""

    def put(self, request, id):
        return self._update(request, id, partial=False)

    def patch(self, request, id):
        return self._update(request, id, partial=True)

    def _update(self, request, id, partial=False):
        try:
            item = get_object_or_404(PersonalDetails, pk=id)
            data = request.data.copy()
            if 'full_name' in data:
                full_name = str(data.get('full_name', '')).strip()
                if not full_name:
                    return Response(
                        {"error": "Full name is required."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                data['full_name'] = full_name
            data['updated_on'] = timezone.now()

            serializer = PersonalDetailsSerializer(item, data=data, partial=partial)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            err_msg = "Validation failed"
            if serializer.errors:
                first_err = next(iter(serializer.errors.values()))
                if isinstance(first_err, list) and first_err:
                    err_msg = str(first_err[0])
                else:
                    err_msg = str(first_err)
            return Response(
                {"error": err_msg, "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PersonalDetailsDeleteView(APIView):
    """Delete a PersonalDetails record."""

    def delete(self, request, id):
        try:
            item = get_object_or_404(PersonalDetails, pk=id)
            item.delete()
            return Response(
                {"message": "Personal details deleted successfully"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─── ResumeMaster APIViews ─────────────────────────────────────────────────────

class ResumeMasterListView(APIView):
    """List all resumes, optionally filter by user_id or search."""

    def get(self, request):
        try:
            queryset = ResumeMaster.objects.all().order_by('-resume_id')

            user_id = request.query_params.get('user_id')
            if user_id:
                queryset = queryset.filter(user_id=user_id)

            search = request.query_params.get('search', '').strip()
            if search:
                queryset = queryset.filter(resume_title__icontains=search)

            serializer = ResumeMasterSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResumeMasterDetailView(APIView):
    """Retrieve a single ResumeMaster record by ID."""

    def get(self, request, id):
        try:
            item = get_object_or_404(ResumeMaster, pk=id)
            serializer = ResumeMasterSerializer(item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResumeMasterCreateView(APIView):
    """Create a new ResumeMaster record."""

    def post(self, request):
        try:
            data = request.data.copy()
            data['created_on'] = timezone.now()

            serializer = ResumeMasterSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            err_msg = "Validation failed"
            if serializer.errors:
                first_err = next(iter(serializer.errors.values()))
                if isinstance(first_err, list) and first_err:
                    err_msg = str(first_err[0])
                else:
                    err_msg = str(first_err)
            return Response(
                {"error": err_msg, "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResumeMasterUpdateView(APIView):
    """Update a ResumeMaster record."""

    def put(self, request, id):
        return self._update(request, id, partial=False)

    def patch(self, request, id):
        return self._update(request, id, partial=True)

    def _update(self, request, id, partial=False):
        try:
            item = get_object_or_404(ResumeMaster, pk=id)
            data = request.data.copy()
            data['updated_on'] = timezone.now()

            serializer = ResumeMasterSerializer(item, data=data, partial=partial)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            err_msg = "Validation failed"
            if serializer.errors:
                first_err = next(iter(serializer.errors.values()))
                if isinstance(first_err, list) and first_err:
                    err_msg = str(first_err[0])
                else:
                    err_msg = str(first_err)
            return Response(
                {"error": err_msg, "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResumeMasterDeleteView(APIView):
    """Delete a ResumeMaster record."""

    def delete(self, request, id):
        try:
            item = get_object_or_404(ResumeMaster, pk=id)
            item.delete()
            return Response(
                {"message": "Resume deleted successfully"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─── Education APIViews ────────────────────────────────────────────────────────

class EducationListView(APIView):
    """List all education records, optionally filter by personal_id."""

    def get(self, request):
        try:
            queryset = Education.objects.all().order_by('-education_id')

            personal_id = request.query_params.get('personal_id')
            if personal_id:
                queryset = queryset.filter(personal_id=personal_id)

            search = request.query_params.get('search', '').strip()
            if search:
                queryset = queryset.filter(
                    Q(school_college_name__icontains=search) |
                    Q(board_university__icontains=search) |
                    Q(education_type__icontains=search)
                )

            serializer = EducationSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EducationDetailView(APIView):
    """Retrieve a single Education record by ID."""

    def get(self, request, id):
        try:
            item = get_object_or_404(Education, pk=id)
            serializer = EducationSerializer(item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EducationCreateView(APIView):
    """Create a new Education record."""

    def post(self, request):
        try:
            data = request.data.copy()
            if not data.get('school_college_name', '').strip():
                return Response(
                    {"error": "School/College name is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not data.get('education_type', '').strip():
                return Response(
                    {"error": "Education type is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            data['created_on'] = timezone.now()

            serializer = EducationSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            err_msg = "Validation failed"
            if serializer.errors:
                first_err = next(iter(serializer.errors.values()))
                if isinstance(first_err, list) and first_err:
                    err_msg = str(first_err[0])
                else:
                    err_msg = str(first_err)
            return Response(
                {"error": err_msg, "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EducationUpdateView(APIView):
    """Update an Education record."""

    def put(self, request, id):
        return self._update(request, id, partial=False)

    def patch(self, request, id):
        return self._update(request, id, partial=True)

    def _update(self, request, id, partial=False):
        try:
            item = get_object_or_404(Education, pk=id)
            data = request.data.copy()
            data['updated_on'] = timezone.now()

            serializer = EducationSerializer(item, data=data, partial=partial)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            err_msg = "Validation failed"
            if serializer.errors:
                first_err = next(iter(serializer.errors.values()))
                if isinstance(first_err, list) and first_err:
                    err_msg = str(first_err[0])
                else:
                    err_msg = str(first_err)
            return Response(
                {"error": err_msg, "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EducationDeleteView(APIView):
    """Delete an Education record."""

    def delete(self, request, id):
        try:
            item = get_object_or_404(Education, pk=id)
            item.delete()
            return Response(
                {"message": "Education record deleted successfully"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─── Skills APIViews ───────────────────────────────────────────────────────────

class SkillsListView(APIView):
    """List all skills, optionally filter by personal_id."""

    def get(self, request):
        try:
            queryset = Skills.objects.all().order_by('-skill_id')

            personal_id = request.query_params.get('personal_id')
            if personal_id:
                queryset = queryset.filter(personal_id=personal_id)

            search = request.query_params.get('search', '').strip()
            if search:
                queryset = queryset.filter(skill_name__icontains=search)

            serializer = SkillsSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SkillsDetailView(APIView):
    """Retrieve a single Skill record by ID."""

    def get(self, request, id):
        try:
            item = get_object_or_404(Skills, pk=id)
            serializer = SkillsSerializer(item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SkillsCreateView(APIView):
    """Create a new Skill record."""

    def post(self, request):
        try:
            data = request.data.copy()
            skill_name = str(data.get('skill_name', '')).strip()
            if not skill_name:
                return Response(
                    {"error": "Skill name is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            data['skill_name'] = skill_name
            data['created_on'] = timezone.now()

            serializer = SkillsSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            err_msg = "Validation failed"
            if serializer.errors:
                first_err = next(iter(serializer.errors.values()))
                if isinstance(first_err, list) and first_err:
                    err_msg = str(first_err[0])
                else:
                    err_msg = str(first_err)
            return Response(
                {"error": err_msg, "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SkillsUpdateView(APIView):
    """Update a Skill record."""

    def put(self, request, id):
        return self._update(request, id, partial=False)

    def patch(self, request, id):
        return self._update(request, id, partial=True)

    def _update(self, request, id, partial=False):
        try:
            item = get_object_or_404(Skills, pk=id)
            data = request.data.copy()
            if 'skill_name' in data:
                skill_name = str(data.get('skill_name', '')).strip()
                if not skill_name:
                    return Response(
                        {"error": "Skill name is required."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                data['skill_name'] = skill_name
            data['updated_on'] = timezone.now()

            serializer = SkillsSerializer(item, data=data, partial=partial)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            err_msg = "Validation failed"
            if serializer.errors:
                first_err = next(iter(serializer.errors.values()))
                if isinstance(first_err, list) and first_err:
                    err_msg = str(first_err[0])
                else:
                    err_msg = str(first_err)
            return Response(
                {"error": err_msg, "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SkillsDeleteView(APIView):
    """Delete a Skill record."""

    def delete(self, request, id):
        try:
            item = get_object_or_404(Skills, pk=id)
            item.delete()
            return Response(
                {"message": "Skill deleted successfully"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─── WorkExperience APIViews ───────────────────────────────────────────────────

class WorkExperienceListView(APIView):
    """List all work experience records, optionally filter by personal_id."""

    def get(self, request):
        try:
            queryset = WorkExperience.objects.all().order_by('-experience_id')

            personal_id = request.query_params.get('personal_id')
            if personal_id:
                queryset = queryset.filter(personal_id=personal_id)

            search = request.query_params.get('search', '').strip()
            if search:
                queryset = queryset.filter(
                    Q(job_title__icontains=search) |
                    Q(company_name__icontains=search)
                )

            serializer = WorkExperienceSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WorkExperienceDetailView(APIView):
    """Retrieve a single WorkExperience record by ID."""

    def get(self, request, id):
        try:
            item = get_object_or_404(WorkExperience, pk=id)
            serializer = WorkExperienceSerializer(item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WorkExperienceCreateView(APIView):
    """Create a new WorkExperience record."""

    def post(self, request):
        try:
            data = request.data.copy()
            if not data.get('job_title', '').strip():
                return Response(
                    {"error": "Job title is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not data.get('company_name', '').strip():
                return Response(
                    {"error": "Company name is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            data['created_on'] = timezone.now()

            serializer = WorkExperienceSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            err_msg = "Validation failed"
            if serializer.errors:
                first_err = next(iter(serializer.errors.values()))
                if isinstance(first_err, list) and first_err:
                    err_msg = str(first_err[0])
                else:
                    err_msg = str(first_err)
            return Response(
                {"error": err_msg, "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WorkExperienceUpdateView(APIView):
    """Update a WorkExperience record."""

    def put(self, request, id):
        return self._update(request, id, partial=False)

    def patch(self, request, id):
        return self._update(request, id, partial=True)

    def _update(self, request, id, partial=False):
        try:
            item = get_object_or_404(WorkExperience, pk=id)
            data = request.data.copy()
            data['updated_on'] = timezone.now()

            serializer = WorkExperienceSerializer(item, data=data, partial=partial)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            err_msg = "Validation failed"
            if serializer.errors:
                first_err = next(iter(serializer.errors.values()))
                if isinstance(first_err, list) and first_err:
                    err_msg = str(first_err[0])
                else:
                    err_msg = str(first_err)
            return Response(
                {"error": err_msg, "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WorkExperienceDeleteView(APIView):
    """Delete a WorkExperience record."""

    def delete(self, request, id):
        try:
            item = get_object_or_404(WorkExperience, pk=id)
            item.delete()
            return Response(
                {"message": "Work experience deleted successfully"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)