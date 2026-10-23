from rest_framework import serializers

from .models import Education, PersonalDetails, ResumeMaster, Skills, WorkExperience


# ─── Individual Model Serializers (pattern: PartnerBankDetailsSerializer) ─────

class PersonalDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalDetails
        fields = '__all__'
        read_only_fields = ('personal_id', 'created_on', 'updated_on')


class ResumeMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeMaster
        fields = '__all__'
        read_only_fields = ('resume_id', 'created_on', 'updated_on')


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'
        read_only_fields = ('education_id', 'created_on', 'updated_on')
        extra_kwargs = {
            'personal': {'required': False, 'allow_null': True},
        }


class SkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skills
        fields = '__all__'
        read_only_fields = ('skill_id', 'created_on', 'updated_on')
        extra_kwargs = {
            'personal': {'required': False, 'allow_null': True},
        }


class WorkExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExperience
        fields = '__all__'
        read_only_fields = ('experience_id', 'created_on', 'updated_on')
        extra_kwargs = {
            'personal': {'required': False, 'allow_null': True},
        }


# ─── Nested Resume Create Serializer ──────────────────────────────────────────

class ResumeCreateSerializer(serializers.Serializer):
    resume_title = serializers.CharField(
        max_length=200, required=False, allow_blank=True, default='Resume'
    )
    personal_details = PersonalDetailsSerializer()
    education = EducationSerializer(many=True, required=False, default=list)
    skills = SkillsSerializer(many=True, required=False, default=list)
    work_experience = WorkExperienceSerializer(many=True, required=False, default=list)

    def create(self, validated_data):
        from django.utils import timezone

        personal_data = validated_data.pop('personal_details')
        education_data = validated_data.pop('education', [])
        skills_data = validated_data.pop('skills', [])
        experience_data = validated_data.pop('work_experience', [])
        resume_title = validated_data.pop('resume_title', 'Resume')

        now = timezone.now()

        # Strip 'personal' FK from nested items (it arrives as None since allow_null=True)
        # and inject created_on; we assign personal= explicitly below.
        def _clean(item):
            item.pop('personal', None)
            item.setdefault('created_on', now)
            return item

        personal_data.setdefault('created_on', now)
        personal = PersonalDetails.objects.create(**personal_data)
        resume = ResumeMaster.objects.create(resume_title=resume_title, created_on=now)

        education = [
            Education.objects.create(personal=personal, **_clean(item))
            for item in education_data
        ]
        skills = [
            Skills.objects.create(personal=personal, **_clean(item))
            for item in skills_data
        ]
        work_experience = [
            WorkExperience.objects.create(personal=personal, **_clean(item))
            for item in experience_data
        ]

        return {
            'resume': resume,
            'personal_details': personal,
            'education': education,
            'skills': skills,
            'work_experience': work_experience,
        }


# ─── Resume Detail Serializer (nested read) ───────────────────────────────────

class PersonalDetailsWithRelationsSerializer(serializers.ModelSerializer):
    education_set = EducationSerializer(many=True, read_only=True, source='education_set')
    skills_set = SkillsSerializer(many=True, read_only=True, source='skills_set')
    work_experience_set = WorkExperienceSerializer(many=True, read_only=True, source='workexperience_set')

    class Meta:
        model = PersonalDetails
        fields = '__all__'
