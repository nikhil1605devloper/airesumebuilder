from django.db import models
 
class Education(models.Model):
    education_id = models.AutoField(primary_key=True)
    personal = models.ForeignKey('PersonalDetails', models.DO_NOTHING)
    education_type = models.CharField(max_length=19)
    school_college_name = models.CharField(max_length=200)
    board_university = models.CharField(max_length=200, blank=True, null=True)
    year_of_passing = models.TextField(blank=True, null=True)  # This field type is a guess.
    percentage_cgpa = models.CharField(max_length=50, blank=True, null=True)
    created_on = models.DateTimeField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'education'

class PersonalDetails(models.Model):
    personal_id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=150)
    email = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    linkedin_url = models.CharField(max_length=300, blank=True, null=True)
    github_url = models.CharField(max_length=300, blank=True, null=True)
    professional_summary = models.TextField(blank=True, null=True)
    created_on = models.DateTimeField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'personal_details'

class ResumeMaster(models.Model):
    resume_id = models.AutoField(primary_key=True)
    user_id = models.IntegerField(blank=True, null=True)
    resume_title = models.CharField(max_length=200, blank=True, null=True)
    created_on = models.DateTimeField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'resume_master'

class Skills(models.Model):
    skill_id = models.AutoField(primary_key=True)
    personal = models.ForeignKey('PersonalDetails', models.DO_NOTHING)
    skill_name = models.CharField(max_length=150)
    created_on = models.DateTimeField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'skills'

class WorkExperience(models.Model):
    experience_id = models.AutoField(primary_key=True)
    personal = models.ForeignKey('PersonalDetails', models.DO_NOTHING)
    job_title = models.CharField(max_length=150)
    company_name = models.CharField(max_length=200)
    start_date = models.CharField(max_length=50, blank=True, null=True)
    end_date = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_on = models.DateTimeField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'work_experience'

class Project(models.Model):
    project_id = models.AutoField(primary_key=True)
    personal = models.ForeignKey('PersonalDetails', models.DO_NOTHING)
    project_name = models.CharField(max_length=200)
    tech_stack = models.CharField(max_length=500, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    project_url = models.CharField(max_length=500, blank=True, null=True)
    github_url = models.CharField(max_length=500, blank=True, null=True)
    created_on = models.DateTimeField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'project'

class Certification(models.Model):
    certification_id = models.AutoField(primary_key=True)
    personal = models.ForeignKey('PersonalDetails', models.DO_NOTHING)
    certification_name = models.CharField(max_length=300)
    issuing_organization = models.CharField(max_length=300, blank=True, null=True)
    issue_date = models.CharField(max_length=50, blank=True, null=True)
    credential_url = models.CharField(max_length=500, blank=True, null=True)
    created_on = models.DateTimeField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'certification'

class Achievement(models.Model):
    achievement_id = models.AutoField(primary_key=True)
    personal = models.ForeignKey('PersonalDetails', models.DO_NOTHING)
    description = models.TextField()
    created_on = models.DateTimeField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'achievement'

class Strength(models.Model):
    strength_id = models.AutoField(primary_key=True)
    personal = models.ForeignKey('PersonalDetails', models.DO_NOTHING)
    strength_name = models.CharField(max_length=150)
    created_on = models.DateTimeField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'strength'

class Language(models.Model):
    language_id = models.AutoField(primary_key=True)
    personal = models.ForeignKey('PersonalDetails', models.DO_NOTHING)
    language_name = models.CharField(max_length=100)
    proficiency = models.CharField(max_length=100, blank=True, null=True)
    created_on = models.DateTimeField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'language'

class AdditionalDetails(models.Model):
    additional_id = models.AutoField(primary_key=True)
    personal = models.OneToOneField('PersonalDetails', models.DO_NOTHING)
    availability = models.CharField(max_length=100, blank=True, null=True)
    created_on = models.DateTimeField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    updated_on = models.DateTimeField(blank=True, null=True)
    updated_by = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'additional_details'


